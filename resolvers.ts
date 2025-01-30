import { Collection, ObjectId } from "mongodb";
import { ContactModel } from "./type.ts";
import { getDatetime, validatePhoneNumber } from "./utils.ts";  // Eliminar getCountryFromPhone
import { GraphQLError } from "graphql";

type Context = {
    ContactCollection: Collection<ContactModel>
}

type MutationArgs = {
    name: string, 
    phone: string
}

export const resolvers = {
    Contact: {
        id: (parent: ContactModel) => parent._id!.toString(),
        // deno-lint-ignore no-unused-vars
        datetime: (parent: ContactModel) => getDatetime() // Ajustamos getDatetime sin el parámetro de país
    },

    Query: {
        getContacts: async(
            _: unknown,
            __: unknown,
            context: Context
        ): Promise<ContactModel[]> => await context.ContactCollection.find().toArray(),

        getContact: async(
            _: unknown,
            { id }: { id: string },
            context: Context
        ): Promise<ContactModel | null> => {
            const contact = await context.ContactCollection.findOne({ _id: new ObjectId(id) });
            if (!contact) throw new GraphQLError("Contacto no encontrado");
            return contact;
        }
    },

    Mutation: {
        addContact: async(
            _: unknown,
            args: MutationArgs,
            context: Context
        ): Promise<ContactModel> => {
            const { name, phone } = args;

            // Validar el número de teléfono
            const isValid = await validatePhoneNumber(phone);
            if (!isValid) throw new GraphQLError("Número de teléfono no válido");

            // Verificar si el teléfono ya existe
            const existingContact = await context.ContactCollection.findOne({ phone });
            if (existingContact) throw new GraphQLError("El número de teléfono ya está registrado");

            // Asignar un valor por defecto o nulo a country si no quieres usarlo
            const country = "Desconocido"; // O puedes poner `null` si prefieres dejarlo vacío

            const { insertedId } = await context.ContactCollection.insertOne({
                name,
                phone,
                country, // No hace falta obtener el país desde la API externa
            });

            return {
                _id: insertedId,
                name,
                phone,
                country,
            };
        },

        updateContact: async(
            _: unknown,
            { id, name, phone }: { id: string, name?: string, phone?: string },
            context: Context
        ): Promise<ContactModel> => {
            const updateData: Partial<ContactModel> = {};
            if (name) updateData.name = name;
            if (phone) {
                // Validar el nuevo número de teléfono
                const isValid = await validatePhoneNumber(phone);
                if (!isValid) throw new GraphQLError("Número de teléfono no válido");

                // Verificar si el teléfono ya está en uso
                const existingContact = await context.ContactCollection.findOne({ phone });
                if (existingContact) throw new GraphQLError("El número de teléfono ya está registrado");

                updateData.phone = phone;
                // Asignamos un valor por defecto a country en lugar de llamar a la API
                updateData.country = "Desconocido"; // O también `null` si lo prefieres
            }

            const result = await context.ContactCollection.findOneAndUpdate(
                { _id: new ObjectId(id) },
                { $set: updateData },
                { returnDocument: "after" }
            );

            if (!result) throw new GraphQLError("El contacto no existe o no se pudo actualizar");

            // Retornar el documento actualizado
            const updatedContact = await context.ContactCollection.findOne({ _id: new ObjectId(id) });
            if (!updatedContact) throw new GraphQLError("Error al recuperar el contacto actualizado");

            return updatedContact;
        },

        deleteContact: async(
            _: unknown,
            { id }: { id: string },
            context: Context
        ): Promise<boolean> => {
            const result = await context.ContactCollection.deleteOne({ _id: new ObjectId(id) });
            return result.deletedCount > 0;
        }
    }
};
