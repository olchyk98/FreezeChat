const { createServer } = require('http');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const cors = require('cors');

// Stuff
const schema = require('./schema');
let getDate = () => (new Date()).toLocaleString() + " :: ";

// Database
mongoose.connect("mongodb://oles:0password@ds259253.mlab.com:59253/graphql-freezechat", {
    useNewUrlParser: true
});
mongoose.connection.once('open', () => console.log(getDate() + "Connected to database!"));

// Express application
const app = express();

// Middleware
app.use(cors());
app.use('/files', express.static('./files'));

// Apollo
const server = new ApolloServer({
    schema,
    playground: {
        settings: {
            'editor.theme': 'light'
        }
    }
});

server.applyMiddleware({ app, path: '/graphql' });
const httpServer = createServer(app);

// Subscriptions
server.installSubscriptionHandlers(httpServer);

// Listen
httpServer.listen(4000, () => console.log(getDate() + "Server is listening on port 4000!"));