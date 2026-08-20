"use strict";
// services/auth-service/index.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const index_model_1 = require("../../shared/models/index.model");
const routes_1 = __importDefault(require("./routes/routes"));
const bank_cron_1 = require("./cron/bank.cron");
const path_1 = __importDefault(require("path"));
const responseHandler_1 = require("../../shared/utils/responseHandler");
const multer_1 = __importDefault(require("multer"));
const app = (0, express_1.default)();
const PORT = process.env.AUTH_PORT || 5033;
app.use((0, helmet_1.default)({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
app.use('/api', routes_1.default);
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../../uploads')));
app.use((err, req, res, next) => {
    if (err instanceof multer_1.default.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return (0, responseHandler_1.sendResponse)(res, 400, false, "Fichier trop volumineux. La limite est de 5 Mo.");
        }
        return (0, responseHandler_1.sendResponse)(res, 400, false, err.message);
    }
    if (err) {
        return (0, responseHandler_1.sendResponse)(res, 500, false, err.message || "Une erreur est survenue");
    }
    next();
});
(0, index_model_1.initModels)().then(() => {
    (0, bank_cron_1.initBankCron)();
    app.listen(PORT, () => {
        console.log(`Auth Service started on port ${PORT}`);
    });
});
