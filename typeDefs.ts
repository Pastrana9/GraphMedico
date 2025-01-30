export const typeDefs = `#graphql
    type Contact {
        id: ID!
        name: String!
        phone: String!
        country: String!
        datetime: String!
    }

    type Query {
        getContacts: [Contact!]!
        getContact(id: String!): Contact
    }

    type Mutation {
        addContact(name: String!, phone: String!): Contact!
        updateContact(id: String!, name: String, phone: String): Contact!
        deleteContact(id: String!): Boolean!
    }
`;
