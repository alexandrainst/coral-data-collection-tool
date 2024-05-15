# CoRal data collection tool

## Backend

The backend utilizes Node.js and tRPC.

To recieve recording data experimental support for formdata in tRPC is utilized. The implementation of the experimental features are mainly from: <https://github.com/trpc/trpc/blob/main/examples/.experimental/next-formdata/src>.

Otherwise the tRPC server side implementation follows this guide: <https://trpc.io/docs/server/introduction> and this implementation example: <https://github.com/trpc/trpc/tree/next/examples/minimal-react>.

## Frontend

The frontend is an React app that utilizes tRPC for communication with the backend. The tRPC implementation follows this guide: <https://trpc.io/docs/client/react> and this implementation example: <https://github.com/trpc/trpc/tree/next/examples/minimal-react>.


## Deployment
Both the frontend and backend are distributed as docker containers.
To deploy an updated version simply go to the backend or frontend folder and run the following commands where **<...>** is replaced by either **frontend** or **backend**:

1. npm run build

2. docker build -t docker.alexandra.dk/coral-data-collection-\<...\>:latest .

3. docker push docker.alexandra.dk/coral-data-collection-\<...\>:latest (*Requires login to Alexandras docker server)

    - *(Alternatively to 3.)* docker save docker.alexandra.dk/coral-data-collection-\<...\>:latest > <...\>.tar 

    - *(Alternatively to 3.)* Move .tar file to target machine and run "docker load --input <...\>.tar"

6. On the target machine run "docker compose down" followed by "docker-compose pull && docker-compose up -d" **OR** "docker-compose up -d" if the containers alternatively are loaded manually


### First time setup
Both the frontend and backend are part of a docker compose setup defined in the file *docker-compose.yml*. Thus, the target machine needs to have [docker compose installed](https://docs.docker.com/compose/install/) and preferrably set to start on boot.

Assuming that the docker containers are available on Alexandras docker server then the target machine only needs the docker-compose.yml and .env file. Otherwise the .tar files are also required (see the above deployment steps).

For the first time setup the data folder (containing the DB and recordings folder) needs to be mapped into the backend container. This is done by changing *./path/relative/to/docker-compose.yml* in the following section of the docker-compose.yml file:

    volumes:
       - ./path/relative/to/docker-compose.yml:${CORAL_DATA_DIR}

Then run:
>docker compose up -d
