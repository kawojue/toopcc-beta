"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// import utilities
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const corsOption_1 = __importDefault(require("./configs/corsOption"));
const express_1 = __importDefault(require("express"));
const credentials_1 = __importDefault(require("./middlewares/credentials"));
// import routes
const root_1 = __importDefault(require("./routes/root"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 1002;
// set middlewares
app.use(credentials_1.default);
app.use(express_1.default.json({ limit: '14mb' }));
app.use((0, morgan_1.default)('dev'));
app.use((0, cors_1.default)(corsOption_1.default));
app.use(express_1.default.urlencoded({
    limit: '14mb', extended: true
}));
app.use('/', root_1.default);
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
