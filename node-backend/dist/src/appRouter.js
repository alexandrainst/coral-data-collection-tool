"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = void 0;
const trpc_1 = require("./trpc");
const types_1 = require("../types");
const zod_1 = require("zod");
exports.appRouter = (0, trpc_1.router)({
    infiniteTexts: trpc_1.publicProcedure
        .input(zod_1.z.object({
        cursor: zod_1.z.number().nullish(), // <-- "cursor" needs to exist, but can be any type
        direction: zod_1.z.enum(['forward', 'backward']), // optional, useful for bi-directional query
    }))
        .query(async (opts) => {
        console.log('Recieved text query');
        const { cursor } = opts.input;
        const text = {
            text: Math.random().toString(36).substring(0, 11),
            id: Math.random(),
        };
        return {
            text,
            cursor,
        };
    }),
    textToRecord: trpc_1.publicProcedure.query(() => {
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
