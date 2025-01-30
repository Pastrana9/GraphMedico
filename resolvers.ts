import { Collection, ObjectId } from "mongodb";
import { GraphQLError } from "graphql";

type Context = {
    PatientsCollection: Collection<any>;
    AppointmentsCollection: Collection<any>;
};

export const resolvers = {
    Query: {
        getPatients: async (_: unknown, __: unknown, context: Context) => {
            return await context.PatientsCollection.find().toArray();
        },

        getPatient: async (_: unknown, { id }: { id: string }, context: Context) => {
            const patient = await context.PatientsCollection.findOne({ _id: new ObjectId(id) });
            if (!patient) throw new GraphQLError("Paciente no encontrado");

            const appointments = await context.AppointmentsCollection.find({ patientId: id }).toArray();
            return { ...patient, appointments };
        },

        getAppointments: async (_: unknown, __: unknown, context: Context) => {
            return await context.AppointmentsCollection.find().toArray();
        },
    },

    Mutation: {
        addPatient: async (_: unknown, { name, phone, email }: { name: string; phone: string; email: string }, context: Context) => {
            // Validar que no haya un paciente con el mismo teléfono o correo
            const existingPatient = await context.PatientsCollection.findOne({ $or: [{ phone }, { email }] });
            if (existingPatient) throw new GraphQLError("El paciente ya existe con ese teléfono o correo");

            const { insertedId } = await context.PatientsCollection.insertOne({ name, phone, email });
            return { id: insertedId.toString(), name, phone, email, appointments: [] };
        },

        updatePatient: async (_: unknown, { id, name, phone, email }: { id: string; name?: string; phone?: string; email?: string }, context: Context) => {
            const updateData: any = {};
            if (name) updateData.name = name;
            if (phone) updateData.phone = phone;
            if (email) updateData.email = email;

            await context.PatientsCollection.updateOne({ _id: new ObjectId(id) }, { $set: updateData });
            return await context.PatientsCollection.findOne({ _id: new ObjectId(id) });
        },

        addAppointment: async (_: unknown, { patientId, date, type }: { patientId: string; date: string; type: string }, context: Context) => {
            const patient = await context.PatientsCollection.findOne({ _id: new ObjectId(patientId) });
            if (!patient) throw new GraphQLError("Paciente no encontrado");

            const { insertedId } = await context.AppointmentsCollection.insertOne({ patientId, date, type });
            return { id: insertedId.toString(), patient, date, type };
        },

        deleteAppointment: async (_: unknown, { id }: { id: string }, context: Context) => {
            const result = await context.AppointmentsCollection.deleteOne({ _id: new ObjectId(id) });
            return result.deletedCount > 0;
        },
    },

    Appointment: {
        patient: async (parent: { patientId: string }, _: unknown, context: Context) => {
            return await context.PatientsCollection.findOne({ _id: new ObjectId(parent.patientId) });
        },
    },
};

