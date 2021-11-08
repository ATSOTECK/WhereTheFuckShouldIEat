const Authorize = require('../app/Middleware/Authorize.js');
const VerifyJWT = require('../app/Middleware/VerifyJWT.js');


/*
|--------------------------------------------------------------------------
| Default router
|--------------------------------------------------------------------------
|
| Default router is used to define any routes that don't belong to a
| controller. Also used as a parent container for the other routers.
|
*/
const router = require('koa-router')({
    prefix: '/api'
});

router.get('/', function (ctx) {
    console.log('router.get(/)');
    return ctx.body = 'what is up my dudes';
});

/*
|--------------------------------------------------------------------------
| login router
|--------------------------------------------------------------------------
|
| Description
|
*/


const LoginController = new (require('../app/Controllers/LoginController.js'))();
const loginRouter = require('koa-router')({
    prefix: '/login'
});
loginRouter.post('/', async ctx => {
    let user = ctx.request.body;
    //console.log(user);
    await LoginController.login(ctx, user);
});
//loginRouter.get('/:user_id', LoginController.authorizeUser, (err) => console.log("routers.js: loginRouter error:", err));

const UserController = new (require('../app/Controllers/UserController.js'))();
const userRouter = require('koa-router')({
    prefix: '/user'
});

//userRouter.use(VerifyJWT);
userRouter.get('/:uid', Authorize('admin'), UserController.getUserByID);
userRouter.get('/get/:username', UserController.getUserByUsername); //TODO(Skyler): Proper auth.
userRouter.post('/new/', async ctx => {
    let newUser = ctx.request.body;
    //console.log(newUser);
    await UserController.newUser(ctx, newUser);
});

/**
 * Register all of the controllers into the default controller.
 */
router.use(
    '',
    loginRouter.routes(),
    userRouter.routes()
);

module.exports = function (app) {
    app.use(router.routes());
    app.use(router.allowedMethods());
};
