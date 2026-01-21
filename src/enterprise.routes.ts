import { EnterpriseController } from "./controller/EnterpriseController";
const API = '/api/bar_assistant/v1';
export const enterpriseRoutes = [
    {
        method: "get",
        route: API + "/enterprises",
        controller: EnterpriseController,
        action: "all"
    }, {
        method: "get",
        route: API + "/enterprises/:id",
        controller: EnterpriseController,
        action: "one"
    }, {
        method: "post",
        route: API + "/enterprise",
        controller: EnterpriseController,
        action: "save"
    }, {
        method: "delete",
        route: API + "/enterprises/:id",
        controller: EnterpriseController,
        action: "remove"
    }
]