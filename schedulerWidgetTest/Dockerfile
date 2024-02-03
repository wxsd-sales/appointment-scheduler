#sudo docker build -t appointment-scheduler:v0.1 .
#sudo docker run -i -t appointment-scheduler

#aws ecr get-login-password --region us-west-1 | docker login --username AWS --password-stdin 191518685251.dkr.ecr.us-west-1.amazonaws.com
#docker tag appointment-scheduler:v0.1 191518685251.dkr.ecr.us-west-1.amazonaws.com/appointment-scheduler:v0.1
#docker push 191518685251.dkr.ecr.us-west-1.amazonaws.com/appointment-scheduler:v0.1

#I think this only has to be done 1 time.
#aws ecr create-repository --repository-name appointment-scheduler

#aws eks --region us-west-1 update-kubeconfig --name bdm-cluster
#kubectl cluster-info

#kubectl apply -f appointment-scheduler.yaml
#kubectl get ingress -n appointment-scheduler

#kubectl get pods
#kubectl describe pod <pod name>

FROM node:18.15.0

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

#overwrite default environment variables
COPY bdm.env .env

CMD [ "npm", "run", "dev" ]
