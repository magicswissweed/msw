# How to deploy

## Requirements

- Access to GitHub project

## Deployment

<details>
    <summary>Ponteshare</summary>

1. On Github, copy full SHA of <a href="https://github.com/AaronOderStudi/msw/commits/master/">last relevant commit</a>
2. Find action <a href="https://github.com/AaronOderStudi/msw/actions/workflows/deploy.yml">Deploy via SSH</a>, click
   `Run workflow`, and provide SHA as argument
3. Wait a few minutes for the <a href="https://magicswissweed.ch">result</a> to show

</details>

## Adding public Spots

Needs to be done on an empty database. Not with every deployment.

1. connect to the database
    - Easiest way is to connect with a tool provided by your IDE.
    - But there are a lot of ways to achieve this
2. copy commands from [here](public-spots.sql) and execute them.
    - If you connected to the database using the IntelliJ-Plugin, you can execute the sql-script directly from the
      sql-file. No need to copy stuff.
3. Restart backend.
    - This way, the backend picks up the changes made to the db and fetches Samples and forecasts for the new spots.
    - If you can live with 404's for a maximum of 10 minutes, you can skip this step.
