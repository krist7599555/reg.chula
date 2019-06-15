#!/bin/bash
# Delete all containers
docker rm $(docker ps -a -q) --force
# Delete all images
docker rmi $(docker images -q) --force
docker container ls
