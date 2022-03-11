const {ApolloServer, gql} = require('apollo-server');
const SessionAPI = require('./datasources/sessions');
const { ApolloServerPluginLandingPageGraphQLPlayground, ApolloServerPluginLandingPageDisabled } = require('apollo-server-core');


const typeDefs = gql`
    type Query {
        sessions: [Session]
    }

type Session
{
    id: ID! ,
    title: String!,
    description: String,
    startAt: String,
    endAt: String,
    room: String,
    day: String,
    format: String,
    track: String @deprecated(reason: "Too manny session do not fit into a single track, we will be migrating to a tag based system in the fututre.."),
    level: String
}`

const resolvers = {
    Query: {
        sessions: (parent, args, {dataSources}, info) => {
            return dataSources.sessionAPI.getSessions();
        }
    }
};

const dataSources = () =>  ({
    sessionAPI: new SessionAPI()
});
const server = new ApolloServer({typeDefs, 
    resolvers, 
    dataSources, 
    plugins: [
        ApolloServerPluginLandingPageGraphQLPlayground, 
        ApolloServerPluginLandingPageDisabled
    ]});

server
    .listen({port: process.env.PORT ||4500})
    .then(({url}) => console.log(`GraohQL Server ready at ${url}`));
