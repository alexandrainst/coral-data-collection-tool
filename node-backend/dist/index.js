"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
/**
 * This a minimal tRPC server
 */
const standalone_1 = require("@trpc/server/adapters/standalone");
const zod_1 = require("zod");
const db_1 = require("./db");
const trpc_1 = require("./trpc");
dotenv_1.default.config();
const appRouter = (0, trpc_1.router)({
    user: {
        list: trpc_1.publicProcedure.query(async () => {
            // Retrieve users from a datasource, this is an imaginary database
            const users = await db_1.db.user.findMany();
            //    ^?
            return users;
        }),
        byId: trpc_1.publicProcedure.input(zod_1.z.string()).query(async (opts) => {
            const { input } = opts;
            //      ^?
            // Retrieve the user with the given ID
            const user = await db_1.db.user.findById(input);
            return user;
        }),
        create: trpc_1.publicProcedure
            .input(zod_1.z.object({ name: zod_1.z.string() }))
            .mutation(async (opts) => {
            const { input } = opts;
            //      ^?
            // Create a new user in the database
            const user = await db_1.db.user.create(input);
            //    ^?
            return user;
        }),
    },
});
const server = (0, standalone_1.createHTTPServer)({
    router: appRouter,
});
const port = process.env.PORT || 3000;
server.listen(port);
