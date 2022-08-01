import userTake from "../controllers/userController.js";


var routes = (app) =>
{
    app.route("/test1")
        .post(userTake.loginRequired, userTake.profile);
    app.route("/test2")
        .post(userTake.register)
    app.route("/test3")
        .post(userTake.sign_in);
}

export default routes;