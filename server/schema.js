const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLList,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLBoolean
} = require('graphql');
const { GraphQLUpload } = require('apollo-server');

const fileSystem = require('fs');

const settings = require('./settings');

const {
    user: User
} = require('./models');

function validateAccount(_id, authToken) {
    return User.findOne({
        _id,
        authTokens: {
            $in: [authToken]
        }
    });
}

function generateNoise(l = 256) {
    let a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        b = () => Math.floor(Math.random() * a.length),
        c = "";
    
    for(let ma = 0; ma < l; ma++) {
        c += a[b()];
    }

    return c;
}

function getExtension(filename) {
    return filename.match(/[^\\]*\.(\w+)$/)[1];
}

const UserType = new GraphQLObjectType({
    name: "User",
    fields: () => ({
        id: { type: GraphQLID },
        login: { type: GraphQLString },
        name: { type: GraphQLString },
        password: { type: GraphQLString },
        status: { type: GraphQLString }, // working, busy, free, await
        avatar: { type: GraphQLString },
        registeredTime: { type: GraphQLString },
        authTokens: { type: new GraphQLList(GraphQLString) },
        lastAuthToken: {
            type: GraphQLString,
            resolve: ({ authTokens }) => authTokens[authTokens.length - 1]
        }
    })
})

const RootQuery = new GraphQLObjectType({
    name: "RootQuery",
    fields: {
        users: {
            type: new GraphQLList(UserType),
            resolve: () => User.find({})
        },
        user: {
            type: UserType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                authToken: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(_, { id, authToken }) {
                return  validateAccount(id, authToken);
            }
        }
    }
});

const RootMutation = new GraphQLObjectType({
    name: "RootMutation",
    fields: {
        registerUser: {
            type: UserType,
            args: {
                login: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLString) },
                name: { type: new GraphQLNonNull(GraphQLString) },
                avatar: { type: new GraphQLNonNull(GraphQLUpload) }
            },
            async resolve(_, { login, password, avatar, name }) {
                // Validate if user doens't exists
                let exists = (await (User.findOne({
                    $or: [
                        { name },
                        { login }
                    ]
                }))) ? true:false;
                if(exists) return;

                // Receive avatar
                let avatarPath = '';
                    {
                        let { filename, stream } = await avatar;
                        if(stream && filename) avatarPath = settings.paths.avatars + generateNoise(128) + '.' + getExtension(filename);
                        stream.pipe(fileSystem.createWriteStream('.' + avatarPath));
                    }
                if(!avatarPath) return null;

                // Create user
                    // Generate token
                const authToken = generateNoise();
                    // Add to DB
                let user = await (new User({
                    login,
                    name,
                    password,
                    avatar: avatarPath,
                    registeredTime: new Date(),
                    authTokens: [authToken],
                    lastAuthToken: authToken
                }).save());

                return user;
            }
        },
        loginUser: {
            type: UserType,
            args: {
                login: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(_, { login, password }) {
                const token = generateNoise();
                return User.findOneAndUpdate({
                    login,
                    password
                }, {
                    lastAuthToken: token,
                    $push: {
                        authTokens: token
                    }
                }, (__, ns) => ns);
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation
});