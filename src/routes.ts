import { UserController } from "./controller/UserController"
import { enterpriseRoutes } from "./enterprise.routes";
import { orderRoutes } from "./order.routes";
import { orderLineRoutes } from "./orderLine.routes";
import { productRoutes } from "./product.routes";
import { userRoutes } from "./user.routes";
import { tableRoutes } from "./table.routes";
const API = '/api/bar_assistant/v1';

export const Routes = [
    ...userRoutes, ...enterpriseRoutes, ...productRoutes, ...orderRoutes, ...orderLineRoutes, ...tableRoutes
]