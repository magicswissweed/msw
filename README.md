# MagicSwissWeed

## Initial Setup

1. Copy [application.properties-TEMPLATE](backend%2Fsrc%2Fmain%2Fresources%2Fapplication.properties-TEMPLATE) and rename to `application.properties`
    - replace the firebase keys
2. Copy [.env.local-TEMPLATE](frontend%2F.env.local-TEMPLATE) and rename it to `.env.local`
    - replace the secret values
3. Copy [http-client.private.env.json-TEMPLATE](http-client%2Fhttp-client.private.env.json-TEMPLATE) and rename to '
   http-client.private.env.json'
    - replace the secret values

## Run the backend

1. Run the 'docker-compose.yml' to start the database.

    ```bash
      docker compose up
    ```

2. Run the [backend](backend/src/main/java/com/aa/msw/MswApplication.java) using the Run Configuration (built in feature of IntelliJ IDEA), for VS Code, check [this Java extension](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-java-pack).

## Start the frontend

```bash
  cd frontend
  npm install
  npm start
```

## More Information

- [Frontend](frontend/README.md)
- [Backend](backend/README.md)
- [Deployment](deployment/README.md)
