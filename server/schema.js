const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLList,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLBoolean
} = require('graphql');

const RootQuery = new GraphQLObjectType({
    name: "RootQuery",
    fields: {
        hello: { type: GraphQLString, resolve: () => "hi" }
    }
});

const RootMutation = new GraphQLObjectType({
    name: "RootMutation",
    fields: {
        hello: { type: GraphQLString, resolve: () => "hi" }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation
});