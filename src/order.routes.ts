import { OrderController } from './controller/OrderController';
const API = '/api/bar_assistant/v1';
export const orderRoutes = [
    {
        method: "get",
        route: API + "/orders/:id/fullorder",
        controller: OrderController,
        action: "fullOrder"
    },
    {
        method: "get",
        route: API + "/orders/fullorders",
        controller: OrderController,
        action: "fullOrders"
    },
    {
        method: "get",
        route: API + "/orders",
        controller: OrderController,
        action: "all"
    }, {
        method: "get",
        route: API + "/orders/:id",
        controller: OrderController,
        action: "one"
    }, {
        method: "post",
        route: API + "/order",
        controller: OrderController,
        action: "save"
    }, {
        method: "delete",
        route: API + "/orders/:id",
        controller: OrderController,
        action: "remove"
    }, {
        method: "get",
        route: API + "/tables/:tableId/active-order",
        controller: OrderController,
        action: "getActiveOrderByTable"
    } 

]