const { ApolloServer, gql } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation')
const { db } = require('../db')

// The GraphQL schema in string form
const typeDefs = gql`
  type Query { 
    movies: [Movie] 
  }
  # @key needed to define the primaryKey for the gateway
  type Movie @key(fields: "id") { 
    id: Int, 
    title: String,
    authorId: Int,
    author: Author
  }
  extend type Author @key(fields: "id") {
    id: Int @external
  }
`;

// The resolvers
const resolvers = {
  Query: { movies: () => db.movies },
  Movie: {
    __resolveReference(movie) {
      return movies[movie.id]
    },
    author(movie) {
      return db.authors[movie.authorId]
    },
  }
};

// Initialize the app
const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }])
});

server.listen(3000).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});