import userTake from "../controllers/userController.js";


var routes = (app) =>
{
    app.route("/test1")
        .post(userTake.loginRequired, userTake.profile);
    app.route("/api/auth/signup")
        .post(userTake.register)
    app.route("/api/auth/signin")
        .post(userTake.sign_in);
}

export default routes;