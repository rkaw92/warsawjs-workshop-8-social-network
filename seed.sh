#!/bin/sh
curl -H "Content-Type: application/json" --data @test-data/user.post.json http://localhost:7545/services/registerUser
curl -v -H "Content-Type: application/json" -b cookie.jar -c cookie.jar --data '{"email":"gutek@gutek.pl","password":"123456"}' http://localhost:7545/services/login
curl -H "Content-Type: application/json" -b cookie.jar -c cookie.jar --data @test-data/message.post.json http://localhost:7545/services/postMessage
