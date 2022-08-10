const express = require("express");
const session = require("express-session");
const app = express();
const { ApolloServer } = require("apollo-server-express");
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core');
const { typeDefs, resolvers, storePokemons } = require("./schema");

app.use(express.static("public"));
app.use(
  session({
    proxy: true,
    secret: "my secret password",
    resave: false,
    saveUninitialized: true,
    // cookies will not be set for requests coming from same site http servers
    // client requires x-forwarded-proto: https and Access-Control-Allow-Credentials: include headers
    cookie: { path: '/', sameSite: "none", secure: true },
  })
);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  credentials: 'include',
  introspection: true,
  playground: true,
  context: ({ req, res }) => ({
    req,
    res
  }),
  plugins: [
    ApolloServerPluginLandingPageGraphQLPlayground(),
  ]
});


app.listen(process.env.PORT || 3000, async () => {
  await server.start();
  server.applyMiddleware({
    app,
    path: "/graphql",
    cors: { origin: true, credentials: true },
  });
  storePokemons();
});
