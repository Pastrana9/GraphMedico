import { MongoClient } from "mongodb";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { GraphQLError } from "graphql";
import { typeDefs } from "./typeDefs.ts";
import { resolvers } from "./resolvers.ts";

const MONGO_URL = Deno.env.get("MONGO_URL");
if (!MONGO_URL) throw new GraphQLError("Error en la conexión a MongoDB");

const client = new MongoClient(MONGO_URL);
await client.connect();
console.log("✅ Conectado a la base de datos");

const db = client.db("MedicalClinic");
const PatientsCollection = db.collection("patients");
const AppointmentsCollection = db.collection("appointments");

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  context: async () => ({ PatientsCollection, AppointmentsCollection }),
  listen: { port: 4000 },
});

console.log(`🚀 Servidor GraphQL corriendo en: ${url}`);

