# How to deploy

## Requirements

- You need to have the file 'docker-compose-deployment.yml' locally (it's git-ignored in the directory this readme is
  in)
    - File is needed to orchestrate the docker images on the VM
    - It's not checked in, because it contains secrets
- Access to GCP console.

1. connect to VM by clicking on 'SSH':
    - https://console.cloud.google.com/compute/instancesDetail/zones/europe-west8-c/instances/msw-instance-medium?project=magicswissweed-msw
2. modify the file docker-compose-deployment.yml (that you have locally, not checked in because of secrets)
    - change the version of the backend- and frontend-images to your desired version
3. upload the file docker-compose-deployment.yml to the VM
    - (there's a button 'Upload File' in the console)
4. rename docker-compose-deployment.yml to docker-compose.yml
5. run 'docker compose up -d'
6. Check if everything is running smoothly
7. delete docker-compose.yml from VM


