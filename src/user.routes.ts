import { UserController } from "./controller/UserController"
const API = '/api/bar_assistant/v1';
export const userRoutes = [
    {
        method: "get",
        route: API + "/users",
        controller: UserController,
        action: "all"
    }, {
        method: "get",
        route: API + "/users/:id",
        controller: UserController,
        action: "one"
    }, {
        method: "post",
        route: API + "/user",
        controller: UserController,
        action: "save"
    }, {
        method: "delete",
        route: API + "/users/:id",
        controller: UserController,
        action: "remove"
    }
]