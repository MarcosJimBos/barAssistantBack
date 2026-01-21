import { TableController } from "./controller/TableController";

const API = "/api/bar_assistant/v1";

export const tableRoutes = [
    {
        method: "get",
        route: API + "/tables/:tableId/active-order",
        controller: TableController,
        action: "getActiveOrder"
    },

    {
    method: "post",
    route: API + "/tables/:tableId/open-order",
    controller: TableController,
    action: "openOrder"
    }

];
