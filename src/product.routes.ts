import { ProductController } from "./controller/ProductController"
const API = '/api/bar_assistant/v1';
export const productRoutes = [
    {
        method: "get",
        route: API + "/products",
        controller: ProductController,
        action: "all"
    }, {
        method: "get",
        route: API + "/products/:id",
        controller: ProductController,
        action: "one"
    }, {
        method: "post",
        route: API + "/product",
        controller: ProductController,
        action: "save"
    }, {
        method: "delete",
        route: API + "/products/:id",
        controller: ProductController,
        action: "remove"
    }
]