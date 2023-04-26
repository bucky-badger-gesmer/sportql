import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import axios from "axios";

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Player {
    id: Int
    name: String
  }

  type Team {
    id: Int
    name: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    players: [Player]
    teams: [Team]
  }
`;

const apiCall = async (endpoint: string) => {
  return axios.get(`https://stats.nba.com/stats/${endpoint}`, {
    headers: {
      accept: "*/*",
      host: "stats.nba.com",
      origin: "https://www.nba.com",
      referer: "https://www.nba.com",
    },
  });
};

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    players: async (_) => {
      const players = [];
      const resp = await apiCall("commonallplayers?LeagueID=00");
      const resultSets = resp.data.resultSets[0];
      for (let i = 0; i < resultSets.rowSet.length; i++) {
        if (Number(resultSets.rowSet[i][5]) === 2022) {
          players.push({
            id: resultSets.rowSet[i][0],
            name: resultSets.rowSet[i][2],
          });
        }
      }

      return players;
    },
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
  listen: { port: Number(process.env.PORT) || 4000 },
});

console.log(`🚀  Server ready at: ${url}`);


