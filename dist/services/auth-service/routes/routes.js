"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_router_1 = __importDefault(require("./auth.router"));
const bank_router_1 = __importDefault(require("./bank.router"));
const admin_router_1 = __importDefault(require("../../admin-service/routes/admin.router"));
const routes_1 = __importDefault(require("../../commerce-service/routes/routes"));
const router = (0, express_1.Router)();
router.use('/auth', auth_router_1.default);
router.use('/bank', bank_router_1.default);
router.use('/general', routes_1.default);
router.use('/admin', admin_router_1.default);
exports.default = router;
