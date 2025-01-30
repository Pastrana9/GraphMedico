import { MongoClient } from 'mongodb'
import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { GraphQLError } from "graphql"
import { ContactModel } from "./type.ts";
import { typeDefs } from "./typeDefs.ts";
import { resolvers } from "./resolvers.ts";

// Obtener las variables de entorno
const MONGO_URL = Deno.env.get("MONGO_URL")
const API_KEY = Deno.env.get("API_KEY")

// Verificar si las variables de entorno están configuradas correctamente
console.log("Mongo URL:", MONGO_URL)  // Verifica que el URL de Mongo esté correcto
console.log("API Key:", API_KEY)      // Verifica que la API Key esté correcta

// Comprobar que MONGO_URL está presente
if (!MONGO_URL) {
  throw new GraphQLError("Error en mongo url")
}

// Comprobar que API_KEY está presente
if (!API_KEY) {
  throw new GraphQLError("Error en API_KEY")
}

// Conectar a MongoDB
const client = new MongoClient(MONGO_URL)

await client.connect()

console.log("Conectado a la base de datos")

const db = client.db("Agenda")

const ContactCollection = db.collection<ContactModel>("contacts")

// Crear servidor Apollo
const server = new ApolloServer({ typeDefs, resolvers })

// Iniciar el servidor Apollo
const { url } = await startStandaloneServer(server, {
  // deno-lint-ignore require-await
  context: async () => ({ ContactCollection })
})

console.log(`Server ready at: ${url}`);


