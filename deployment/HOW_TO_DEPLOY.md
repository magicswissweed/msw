# How to deploy

## Requirements

- You need to have the file 'docker-compose-deployment.yml' locally (it's git-ignored in the directory this readme is
  in)
  - File is needed to orchestrate the docker images on the VM
  - It's not checked in, because it contains secrets
- Access to GCP console.

## Deployment

1. connect to VM by clicking on 'SSH':
    - <https://console.cloud.google.com/compute/instancesDetail/zones/europe-west8-c/instances/msw-instance-medium?project=magicswissweed-msw>

2. Switch to Nicola's directory (where the Docker containers live)

    ```bash
    cd ../nickueng
    ```

3. modify the file `docker-compose-deployment.yml` (that you have locally, not checked in because of secrets)
    - change the version of the backend- and frontend-images to your desired version (check Artifact Registry for existing images or have them built by filing a pull request on GitHub)
4. upload the file docker-compose-deployment.yml to the VM
    - use the button 'Upload File' in the console
5. rename docker-compose-deployment.yml to docker-compose.yml

      ```bash
      mv docker-compose-deployment.yml docker-compose.yml
      ```

6. build the containers (updating existing ones)

    ```bash
    docker compose up -d
    ```

    If you get an error message about conflicts, make sure you are in Nicola's directory where the containers live.

7. Check if everything is running smoothly
8. delete docker-compose.yml from VM

    ```bash
    rm docker-compose.yml
    ```
