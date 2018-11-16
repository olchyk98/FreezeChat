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
const { GraphQLUpload, PubSub, withFilter } = require('apollo-server');

const pubsub = new PubSub();

const fileSystem = require('fs');

const settings = require('./settings');

const {
    user: User,
    conversation: Conversation,
    message: Message
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

let str = str => str.toString();

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
        },
        conversations: {
            type: new GraphQLList(ConversationType),
            resolve: ({ id }) => Conversation.find({
                members: {
                    $in: [id]
                }
            })
        }
    })
});

const ConversationType = new GraphQLObjectType({
    name: "Conversation",
    fields: () => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        members: {
            type: new GraphQLList(UserType),
            resolve: async ({ members }) => User.find({
                _id: {
                    $in: members
                }
            })
        },
        messages: {
            type: new GraphQLList(MessageType),
            args: {
                limit: { type: GraphQLInt }
            },
            resolve: ({ id }, { limit }) => (
                (limit) ? (
                    Message.find({
                        conversationID: id
                    }).sort({ time: -1 }).limit(limit)
                ) : (
                    Message.find({
                        conversationID: id
                    }).sort({ time: -1 })
                )
            )
        },
        previewTitle: {
            type: GraphQLString,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve: async ({ members }, { id }) => (await User.findById(
                str(members.find( io => str(io) !== str(id) ))
            )).name || ""
        },
        previewImage: {
            type: GraphQLString,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve: async ({ members }, { id }) => {
                let a = await User.findById(
                    members.find( io => str(io) === str(id) )
                );
                if(a) return a.avatar;
                else return "";
            }
        },
        previewContent: {
            type: GraphQLString,
            resolve: async ({ id }) => {
                let a = (await Message.find({ conversationID: id, type: "TEXT_TYPE" }).sort({ time: -1 }).limit(1))[0];
                return (a && a.content) || "";
            }
        },
        previewTime: {
            type: GraphQLString,
            resolve: async ({ id }) => {
                let a = (await Message.find({ conversationID: id }).sort({ time: -1 }).limit(1))[0];
                return (a && a.time) || "";
            }
        },
        unSeenMessages: {
            type: GraphQLInt,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve: ({ id }, { id: _id }) => Message.count({
                conversationID: id,
                isSeen: false,
                creatorID: {
                    $ne: _id
                }
            })
        }
    })
});

const MessageType = new GraphQLObjectType({
    name: "Message",
    fields: () => ({
        id: { type: GraphQLID },
        content: { type: GraphQLString },
        time: { type: GraphQLString },
        creatorID: { type: GraphQLID },
        type: { type: GraphQLString },
        conversationID: { type: GraphQLID },
        isSeen: { type: GraphQLBoolean },
        conversation: {
            type: ConversationType,
            resolve: ({ conversationID }) => Conversation.findById(conversationID)
        },
        creator: {
            type: UserType,
            resolve: ({ creatorID }) => User.findById(creatorID)
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
                return validateAccount(id, authToken);
            }
        },
        conversation: {
            type: ConversationType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                authToken: { type: new GraphQLNonNull(GraphQLString) },
                conversationID: { type: new GraphQLNonNull(GraphQLID) }
            },
            async resolve(_, { id, authToken, conversationID }) {
                let user = await validateAccount(id, authToken);
                if(!user) return null;
  
                return Conversation.findOne({
                    _id: conversationID,
                    members: {
                        $in: [str(user._id)]
                    }
                });
            }
        },
        conversationMessages: {
            type: new GraphQLList(MessageType),
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                authToken: { type: new GraphQLNonNull(GraphQLString) },
                conversationID: { type: new GraphQLNonNull(GraphQLID) },
                cursorID: { type: GraphQLID },
                limit: { type: GraphQLInt }
            },
            async resolve(_, { id, authToken, conversationID, cursorID, limit }) {
                let user = await validateAccount(id, authToken);
                if(!user) return null;

                const sortParams = { time: -1 }

                if(cursorID) {
                    if(limit) {
                        return Message.find({
                            conversationID,
                            _id: {
                                $lt: cursorID
                            }
                        }).sort(sortParams).limit(limit);
                    } else {
                        return Message.find({
                            conversationID,
                            _id: {
                                $lt: cursorID
                            }
                        }).sort(sortParams);
                    }
                } else {
                    if(limit) {
                        return Message.find({ conversationID }).sort(sortParams).limit(limit);
                    } else {
                        return Message.find({ conversationID }).sort(sortParams);
                    }
                }
            }
        },
        searchConversations: {
            type: new GraphQLList(ConversationType),
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                authToken: { type: new GraphQLNonNull(GraphQLString) },
                query: { type: new GraphQLNonNull(GraphQLString) }
            },
            async resolve(_, { id, authToken, query }) {
                let user = await validateAccount(id, authToken);
                if(!user) return null;

                let reg = a => new RegExp(a, "i");

                return Conversation.find({
                    members: {
                        $in: [str(user._id)]
                    },
                    title: reg(query)
                });
            }
        },
        searchUsers: {
            type: new GraphQLList(UserType),
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                authToken: { type: new GraphQLNonNull(GraphQLString) },
                query: { type: new GraphQLNonNull(GraphQLString) }  
            },
            async resolve(_, { id, authToken, query }) {
                // Validate account
                let user = await validateAccount(id, authToken);
                if(!user) return null;

                // Submit
                return User.find({
                    _id: {
                        $ne: str(user._id)
                    },
                    name: new RegExp(query, "i")
                }).sort({ registeredTime: -1 });
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
                if(exists) return null;

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
                    status: "Free",
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
        },
        setUserStatus: {
            type: UserType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                authToken: { type: new GraphQLNonNull(GraphQLString) },
                status: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(_, { id, authToken, status }) {
                return User.findOneAndUpdate({
                    _id: id,
                    authTokens: {
                        $in: [authToken]
                    }
                }, { status });
            }
        },
        createConversation: {
            type: ConversationType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                authToken: { type: new GraphQLNonNull(GraphQLString) },
                trackID: { type: new GraphQLNonNull(GraphQLID) }
            },
            async resolve(_, { id, authToken, trackID }) {
                if(str(trackID) === str(id)) return null;

                let user = await validateAccount(id, authToken);
                if(!user) return null;

                let victim = null;
                try {
                    victim = await User.findById(trackID);
                } catch(_) {
                    victim = null;
                }

                if(victim) { // trackID is a person
                    let conversation = await Conversation.findOne({
                        $or: [
                            { members: [str(user._id), str(victim._id)] },
                            { members: [str(victim._id), str(user._id)] }
                        ]
                    });

                    if(!conversation) {
                        let nConv = (await (new Conversation({
                            members: [str(user._id), str(victim._id)],
                            title: `${ user.name } and ${ victim.name }`
                        })).save());
    
                        return nConv;
                    } else { // exists
                        return conversation;
                    }
                } else { // trackID is a conversation
                    return Conversation.findOne({
                        _id: trackID,
                        members: {
                            $in: [str(user._id)]
                        }
                    });
                }
            }
        },
        createMessage: {
            type: MessageType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                authToken: { type: new GraphQLNonNull(GraphQLString) },
                content: { type: new GraphQLNonNull(GraphQLString) },
                type: { type: new GraphQLNonNull(GraphQLString) },
                conversationID: { type: new GraphQLNonNull(GraphQLID) }
            },
            async resolve(_, { id, authToken, content, type, conversationID }) {
                let user = await validateAccount(id, authToken);
                if(!user) return null;

                let conversation = await Conversation.findById(conversationID);
                if(!conversation || !conversation.members.includes(str(user._id))) return null;

                let message = (await (new Message({
                    content, type, conversationID,
                    creatorID: user._id,
                    isSeen: false,
                    time: new Date()
                }).save()));

                pubsub.publish('sendedChatMessage', {
                    message,
                    members: conversation.members,
                    convID: conversation._id,
                    creatorID: user._id
                });

                pubsub.publish('updatedChatConversation', {
                    conversation
                });

                return message;
            }
        },
        viewMessages: {
            type: GraphQLBoolean,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                authToken: { type: new GraphQLNonNull(GraphQLString) },
                conversationID: { type: new GraphQLNonNull(GraphQLID) }
            },
            async resolve(_, { id, authToken, conversationID }) {
                let user = await validateAccount(id, authToken);
                if(!user) return false;

                let conversation = await Conversation.findById(conversationID);
                if(!conversation || !conversation.members.includes(str(user._id))) return false;

                await Message.updateMany({
                    conversationID,
                    creatorID: {
                        $ne: user._id
                    }
                }, { isSeen: true });

                return true;
            }
        }
    }
});

const RootSubscription = new GraphQLObjectType({
    name: "RootSubscription",
    fields: {
        newChatMessage: {
            type:  MessageType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                authToken: { type: new GraphQLNonNull(GraphQLString) },
                conversationID: { type: new GraphQLNonNull(GraphQLID) }
            },
            subscribe: withFilter(
                () => pubsub.asyncIterator('sendedChatMessage'),
                async ({ message, members, convID, creatorID }, { id, authToken, conversationID }) => {
                    return(
                        str(conversationID) !== str(convID) ||
                        str(creatorID) === str(id) ||
                        !(await validateAccount(id, authToken)) ||
                        !members.includes(str(id))
                    ) ? false:true;
                }
            ),
            resolve: ({ message }) => message
        },
        chatConversationUpdated:  { // can fire on increase, but it's a better way
            type: ConversationType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                authToken: { type: new GraphQLNonNull(GraphQLString) }
            },
            subscribe: withFilter(
                () => pubsub.asyncIterator('updatedChatConversation'),
                async ({ conversation }, { id, authToken }) => {
                    return(
                        !conversation.members.includes(str(id)) ||
                        !(await validateAccount(id, authToken))
                    ) ? false:true;
                }
            ),
            resolve: ({ conversation }) => conversation
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation,
    subscription: RootSubscription
});