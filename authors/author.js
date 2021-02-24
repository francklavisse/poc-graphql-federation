const { ApolloServer, gql } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation')
const { db } = require('../db')

// The GraphQL schema in string form
const typeDefs = gql`
  type Query { 
    authors: [Author] 
  }
  type Author @key(fields: "id") { 
    id: Int
    name: String
  }
`;

// The resolvers
const resolvers = {
  Query: { authors: () => db.authors },
  Author: {
    __resolveReference(author) {
      return db.authors[author.id]
    },
  },
};

// Initialize the app
const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }])
});

server.listen(3001).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});