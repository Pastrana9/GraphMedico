export const typeDefs = `#graphql
    type Patient {
        id: ID!
        name: String!
        phone: String!
        email: String!
        appointments: [Appointment]!
    }

    type Appointment {
        id: ID!
        patient: Patient!
        date: String!
        type: String!
    }

    type Query {
        getPatients: [Patient!]!    # 🔹 Devuelve la lista de pacientes
        getPatient(id: ID!): Patient
        getAppointments: [Appointment!]!
    }

    type Mutation {
        addPatient(name: String!, phone: String!, email: String!): Patient!
        updatePatient(id: ID!, name: String, phone: String, email: String): Patient!
        addAppointment(patientId: ID!, date: String!, type: String!): Appointment!
        deleteAppointment(id: ID!): Boolean!
    }
`;