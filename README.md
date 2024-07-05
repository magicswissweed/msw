# MagicSwissWeed

## Initial Setup

1. Copy [application.properties-TEMPLATE](backend%2Fsrc%2Fmain%2Fresources%2Fapplication.properties-TEMPLATE) and rename to 'application.properties'
2. Copy your firebase-service-account.json into src/main/resources (filename has to match name in application.properties)
3. Copy [FirebaseConfig.tsx-TEMPLATE](frontend%2Fsrc%2Ffirebase%2FFirebaseConfig.tsx-TEMPLATE) and rename it to Firebaseconfig.tsx
    - replace the secret values.
4. Copy [http-client.private.env.json-TEMPLATE](http-client%2Fhttp-client.private.env.json-TEMPLATE) and rename to 'http-client.private.env.json'
    - replace the secret values

## Run the backend

1. Run the 'docker-compose.yml' to start the database.
2. Run the backend using the Run Configuration

## Start the frontend

1. cd frontend
2. npm start
