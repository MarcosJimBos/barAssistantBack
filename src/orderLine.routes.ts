import { OrderLineController } from './controller/OrderLineController';
const API = '/api/bar_assistant/v1';
export const orderLineRoutes = [
    {
        method: "get",
        route: API + "/orderlines/nostatus/:status/room/:room",
        controller: OrderLineController,
        action: "getOrderLinesByNoStatusAndRoom"
    },
    {
        method: "get",
        route: API + "/orderlines/status/:status/room/:room",
        controller: OrderLineController,
        action: "getOrderLinesByStatusAndRoom"
    },
    {
        method: "get",
        route: API + "/orderlines",
        controller: OrderLineController,
        action: "all"
    },
    {
        method: "get",
        route: API + "/orderlines/:id",
        controller: OrderLineController,
        action: "one"
    },
    {
        method: "post",
        route: API + "/orderlines/next-status",
        controller: OrderLineController,
        action: "saveNextStatus"
    },
    {
        method: "post",
        route: API + "/orderlines",
        controller: OrderLineController,
        action: "save"
    },
    {
        method: "delete",
        route: API + "/orderlines/:id",
        controller: OrderLineController,
        action: "remove"
    },
    {
        method: "post",
        route: API + "/orderlines/add-product",
        controller: OrderLineController,
        action: "addProductToTable"
    }
];