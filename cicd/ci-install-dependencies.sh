#!/bin/sh
set -eu

docker run -v "$(pwd):/var/task" -w /var/task mhart/alpine-node:12 /bin/sh -c \
  'yarn'