"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const index_model_1 = require("../../shared/models/index.model");
const routes_1 = __importDefault(require("./routes/routes"));
dotenv_1.default.config({
    path: path_1.default.resolve(process.cwd(), ".env")
});
const app = (0, express_1.default)();
const PORT = process.env.COMMERCE_PORT || 5001;
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use('/api', routes_1.default);
(0, index_model_1.initModels)().then(() => {
    app.listen(PORT, () => {
        console.log(`Commerce Service started on port ${PORT}`);
    });
});
