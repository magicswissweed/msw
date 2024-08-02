# MagicSwissWeed

## Initial Setup

1. Copy [application.properties-TEMPLATE](backend%2Fsrc%2Fmain%2Fresources%2Fapplication.properties-TEMPLATE) and rename
   to 'application.properties'
   application.properties)
2. Copy [.env.local-TEMPLATE](frontend%2F.env.local-TEMPLATE) and rename it to .env.local
    - replace the secret values.
3. Copy [http-client.private.env.json-TEMPLATE](http-client%2Fhttp-client.private.env.json-TEMPLATE) and rename to '
   http-client.private.env.json'
    - replace the secret values

## Run the backend

1. Run the 'docker-compose.yml' to start the database.
2. Run the backend using the Run Configuration

## Start the frontend

1. cd frontend
2. npm start
