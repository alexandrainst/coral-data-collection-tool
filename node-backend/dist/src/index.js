"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const standalone_1 = require("@trpc/server/adapters/standalone");
const appRouter_1 = require("./appRouter");
dotenv_1.default.config();
console.log('Started server');
(0, standalone_1.createHTTPServer)({
    middleware: (0, cors_1.default)(),
    router: appRouter_1.appRouter,
}).listen(process.env.PORT || 3000);
