# CoRal data collection tool

## Backend

The backend utilizes Node.js and tRPC.

To recieve recording data experimental support for formdata in tRPC is utilized. The implementation of the experimental features are mainly from: <https://github.com/trpc/trpc/blob/main/examples/.experimental/next-formdata/src>.

Otherwise the tRPC server side implementation follows this guide: <https://trpc.io/docs/server/introduction> and this implementation example: <https://github.com/trpc/trpc/tree/next/examples/minimal-react>.

## Frontend

The frontend is an React app that utilizes tRPC for communication with the backend. The tRPC implementation follows this guide: <https://trpc.io/docs/client/react> and this implementation example: <https://github.com/trpc/trpc/tree/next/examples/minimal-react>.
