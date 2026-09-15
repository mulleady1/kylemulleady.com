---
title: "Dockerizing things"
date: 2017-12-12
slug: dockerizing-things
legacy_id: 15
---

One of the most challenging parts of dockerizing apps is figuring out how to communicate to containers from the outside world. If you're a typical hacker like me, you probably have a handful of sites and projects, some of which have a decent amount of traffic, but nothing that a single cloud server can't handle. With the myriad ways to containerize applications, how do we handle smaller-scale scenarios like this?

Turns out, it's pretty easy.

1) `docker swarm init`. We need swarm mode because we're going to deploy our apps via `docker stack deploy` and because we're going to create an overlay network for cross-stack communication.

2) `docker network create -d overlay my-private-network`. Launching Compose services automatically creates a network for us, but we need a separate one that's not private to a stack so our proxy server can be on the same network as all of our apps. When it's on the same network it can leverage docker's DNS resolution to proxy traffic to the other services in their respective stacks. 

Since our apps are running in swarm mode, we have to use an overlay network--we can't use the default bridge network.

3) `docker stack deploy -c docker-compose.nginx.yml nginx`. The goal here is to have an nginx instance that routes traffic to our other docker stacks. The basic way of firing up an nginx container is with `docker run nginx`, but that method cannot connect to overlay networks so we're using a "stack" of just one service here.

`docker-compose.nginx.yml ` might look like this:

```
version: '3'

services:
  nginx:
    image: nginx
    volumes:
      - ./conf.d/app1.conf:/etc/nginx/conf.d/app1.conf
    ports:
      - "80:80"
    networks:
      - my-private-network
networks:
  my-private-network:
    external:
      name: my-private-network
```

This is a typical docker-compose file, with two notable pieces. 1) We're defining `my-private-network` as an external network so docker doesn't try to create it when deploying this stack. 2) We're volume mounting an nginx config file into the container. `app1.conf` can be as simple as:

```
server {
  listen 80;
  server_name my-domain-name-for-app1.com;
  location / {
      proxy_pass http://app1:8000;
  }
}
```

4) `docker stack deploy -c docker-compose.app1.yml app1`. This is our "real" stack for an app that likely runs multiple services. For example, `docker-compose.app1.yml` might look like:

```
version: '3'

services:
  db:
    image: postgres
    volumes:
      - /data/postgres:/var/lib/postgresql/data
    networks:
      - app1-network
  app1:
    image: my-docker-username/app1:latest
    depends_on:
      - db
    ports:
      - "8000:8000"
    networks:
      - my-private-network
      - app1-network
    deploy:
      replicas: 3
      restart_policy:
        condition: on-failure
networks:
  app1-network: {}
  my-private-network:
    external:
      name: my-private-network
```

Note here that again we're defining `my-private-network` as an external network. We're also defining `app1-network` so the app service and database service can talk to each other, and for basic security purposes the database service is not exposed over any other network. Lastly, we're taking advantage of docker's scaling features by deploying three instances of the app service.

Repeat Step 4 for additional apps, and add their nginx configurations to the volume mount in Step 3.

That's it! Now we have a server running a collection of docker stacks, with nginx also running in a container and directing web traffic to our apps.

There are a number of benefits to this setup. Two noteworthy ones are:

1) Easy automation. If our one server spontaneously combusts, we can get a new server up and running in minutes. One script can get all of our sites installed, configured, and running. The script could look something like:

```
# 1) Install docker (instructions omitted here. See https://docs.docker.com/engine/installation).

# 2) Get config/compose files from version control.
git clone https://github.com/my-github-username/my-repo.git
cd my-repo

# 3) Get database backups from wherever they are.
scp someone@somewhere:~/postgres-backup.tar.gz .
tar -xf postgres-backup.tar.gz -C /data/postgres/

# 4) Run steps 1-4 above.
```

2) Scalability. We're using a single server here because we haven't hit it big yet. But we _are_ going to hit it big eventually (amirite), and we'll be able to adjust to the traffic increase. To do so, we'll just start using `docker-machine` to add other nodes to the swarm and we're pretty much good to go. Eventually we'll use a managed database solution and all the other fancy stuff, but this is a huge step toward handling a large spike in users with minimal downtime.

Okay I'll shut up now. Thanks for reading!
