"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables based on NODE_ENV
const environment = process.env.NODE_ENV || 'development';
dotenv_1.default.config({
    path: path_1.default.resolve(__dirname, `../.env.${environment}`)
});
// After loading env variables, import other modules
const app_1 = __importDefault(require("./app"));
const DbConn_1 = __importDefault(require("./config/DbConn"));
// Create and configure Express app
const app = (0, app_1.default)();
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, DbConn_1.default)();
        app.listen(port, () => {
            console.log(`Server running in ${environment} mode on port ${port}`);
            console.log('Environment variables loaded from:', path_1.default.resolve(__dirname, `../.env.${environment}`));
            console.log('JWT Access Secret:', process.env.JWT_ACCESS_SECRET ? 'is set' : 'not set');
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
});
startServer();
