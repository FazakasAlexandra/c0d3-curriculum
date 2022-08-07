const { gql } = require("apollo-server-express");
const fetch = require("node-fetch");

const typeDefs = gql(`
type Lesson {
    title: String
}

type BasicPokemon{
    name: String
}

type Pokemon {
    name: String
    image: String
}

type User {
    name: String
    image: String
    lessons: [Lesson]
}

type Query {
    lessons: [Lesson]
    search(name: String!): [BasicPokemon]
    pokemon(name: String!): Pokemon
    login(name: String!): User
    user: User
}

type Mutation {
    enroll(title: String!): User
    unenroll(title: String!): User
  }
`);

let pokemons = [];
let cache = {};

const getPokemon = async (name) => {
  let pokemon;

  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    pokemon = await res.json();
  } catch (e) {
    throw Error(`Cannot find pokemon: ${e}`);
  }

  return {
    name: pokemon?.name,
    image: pokemon?.sprites.back_default,
  };
};

const setCache = ({ name, image }) => {
  cache[name] = {
    name,
    image,
  };
};

const storePokemons = () => {
  try {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=1118")
      .then((res) => res.json())
      .then((data) => (pokemons = data.results));
  } catch(e) {
    throw Error(`Cannot find pokemons: ${e}`);
  }
};

const resolvers = {
  Mutation: {
    enroll: (_obj, { title }, { req: { session } }) => {
      if (!session.user) {
        throw Error("403 Not authenticated");
      }
      session.user = {
        ...session.user,
        lessons: [...session.user.lessons, { title }],
      };
      return session.user;
    },
    unenroll: (_obj, { title }, { req: { session } }) => {
      if (!session.user) {
        throw Error("403 Not authenticated");
      }
      session.user = {
        ...session.user,
        lessons: user.lessons.filter((lesson) => lesson.title !== title),
      };

      return session.user;
    },
  },
  Query: {
    lessons: () => {
      return fetch("https://www.c0d3.com/api/lessons").then((r) => r.json());
    },
    search: (_obj, args) => {
      return pokemons.filter((pokemon) => pokemon?.name.includes(args.name));
    },
    user: (_obj, _args, { req: { session } }) => {
      return session.user || null;
    },
    login: async (_obj, { name }, { req: { session } }) => {
      if (cache[name]) {
        session.user = {
          ...cache[name],
          lessons: [],
        };
      } else {
        const pokemon = await getPokemon(name);
        setCache(pokemon);

        session.user = {
          ...pokemon,
          lessons: [],
        };
      }

      return session.user;
    },
    pokemon: async (_obj, { name }) => {
      if (cache[name]) return cache[name];

      const pokemon = await getPokemon(name);
      setCache(pokemon);

      return pokemon;
    },
  },
};

module.exports = {
  typeDefs,
  resolvers,
  storePokemons,
};
