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
userRouter.get('/history/:username', async (ctx) => {
    await UserController.getFromUserHistory(ctx);
});
userRouter.post('/new/', async ctx => {
    let newUser = ctx.request.body;
    await UserController.newUser(ctx, newUser);
});
userRouter.post('/addToHistory/', async ctx => {
    let toAdd = ctx.request.body;
    await UserController.addToHistory(ctx, toAdd);
});

const RestaurantController = new (require('../app/Controllers/RestaurantController.js'))();
const restaurantRouter = require('koa-router')({
    prefix: '/restaurant'
});
restaurantRouter.post('/new/', async ctx => {
    let restaurant = ctx.request.body;
    await RestaurantController.newRestaurant(ctx, restaurant);
})

/**
 * Register all of the controllers into the default controller.
 */
router.use(
    '',
    loginRouter.routes(),
    userRouter.routes(),
    restaurantRouter.routes()
);

module.exports = function (app) {
    app.use(router.routes());
    app.use(router.allowedMethods());
};
