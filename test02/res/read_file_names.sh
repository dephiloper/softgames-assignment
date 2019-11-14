#!/bin/bash
# https://stackoverflow.com/a/9011264
for file in ./openmoji-72x72-color/*; do
  echo "res/openmoji-72x72-color/${file##*/}" >> openmoji-list.txt
done
