"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const commerce_router_1 = __importDefault(require("./commerce.router"));
const order_router_1 = __importDefault(require("./order.router"));
const driver_router_1 = __importDefault(require("./driver.router"));
const service_router_1 = __importDefault(require("./service.router"));
const GeneralRouter = (0, express_1.Router)();
GeneralRouter.use('/commerce', commerce_router_1.default);
GeneralRouter.use('/orders', order_router_1.default);
GeneralRouter.use('/driver', driver_router_1.default);
GeneralRouter.use('/services', service_router_1.default);
exports.default = GeneralRouter;
