const Koa = require('koa');
const app = new Koa();
const bodyParser = require('koa-bodyparser');
const http = require('http');

// Load environment variables (or .env if local environment)
// The .env file is not uploaded to github. I used the one from project 2.
require('dotenv').config();
app.use(bodyParser());
require('./app/Middleware/CORS.js')(app);

// Custom error catch for koa-jwt so that we can log the specific error message
// when attempting to read and parse the access_token
app.use(async (ctx, next) => {
    //console.log(ctx.request.body);
    
    return next().catch((err) => {
        if(err.status === 401) {
            console.log('server.js: sending 401 to the client.');
            ctx.status = 401;
            ctx.body = 'JWT Token expired. If this was an app in production, you do not want to tell the public why their request was rejected!';
        } else {
            console.log('server.js: one of the modules in the chain fired an exception.');
            console.log(`The error message is ${err}`);
        }
    });
});

// require('./config/courses_routes.js')(app);
require('./config/routes.js')(app);

const httpsServer = require('./config/ssl/ssl.js')(app.callback());
httpsServer.listen(process.env.APP_PORT, () => {
    console.log(`Listening on HTTPS port ${process.env.APP_PORT}`)
});
