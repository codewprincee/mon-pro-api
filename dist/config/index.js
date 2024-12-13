"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.connectDB = void 0;
var DbConn_1 = require("./DbConn");
Object.defineProperty(exports, "connectDB", { enumerable: true, get: function () { return __importDefault(DbConn_1).default; } });
var logger_1 = require("./logger");
Object.defineProperty(exports, "logger", { enumerable: true, get: function () { return __importDefault(logger_1).default; } });
