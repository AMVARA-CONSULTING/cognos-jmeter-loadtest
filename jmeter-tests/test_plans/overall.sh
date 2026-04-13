#!/bin/bash

#
# This is a wrapper to create multiple tests and run them over night
#


./run.sh -p='${jmeterpwd}' -t 10 -l 250 -rup 60 -e 001-cug -d
sleep 240
./run.sh -p='${jmeterpwd}' -t 10 -l 250 -rup 60 -e 001-cug -d
sleep 240
./run.sh -p='${jmeterpwd}' -t 10 -l 250 -rup 60 -e 001-cug -d
sleep 240

sleep 240
./run.sh -p='${jmeterpwd}' -t 20 -l 250 -rup 60 -e 001-cug -d
sleep 240
./run.sh -p='${jmeterpwd}' -t 20 -l 250 -rup 60 -e 001-cug -d
sleep 240
./run.sh -p='${jmeterpwd}' -t 20 -l 250 -rup 60 -e 001-cug -d
sleep 240

sleep 240
./run.sh -p='${jmeterpwd}' -t 30 -l 250 -rup 60 -e 001-cug -d
sleep 240
./run.sh -p='${jmeterpwd}' -t 30 -l 250 -rup 60 -e 001-cug -d
sleep 240
./run.sh -p='${jmeterpwd}' -t 30 -l 250 -rup 60 -e 001-cug -d
sleep 240


