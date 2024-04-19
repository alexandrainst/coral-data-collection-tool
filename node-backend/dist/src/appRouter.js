"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = void 0;
const trpc_1 = require("./trpc");
const types_1 = require("../types");
exports.appRouter = (0, trpc_1.router)({
    textToRecord: trpc_1.publicProcedure.query(() => {
        console.log('Recieved single text query');
        return {
            text: Math.random().toString(36).substring(0, 11),
            id: Math.random(),
        };
    }),
    recording: trpc_1.publicProcedure.input(types_1.RecordingTestSchema).mutation(opts => {
        console.log('Recieved recording query');
        return opts.input.id;
    }),
    user: trpc_1.publicProcedure.input(types_1.UserDataSchema).mutation(opts => {
        console.log('Recieved user query');
        return opts.input.email;
    }),
});
