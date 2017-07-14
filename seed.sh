#!/bin/sh
curl -H "Content-Type: application/json" --data @test-data/user.post.json http://localhost:7545/services/registerUser
curl -H "Content-Type: application/json" -b cookie.jar -c cookie.jar --data '{"email":"gutek@gutek.pl","password":"123456"}' http://localhost:7545/services/login
curl -H "Content-Type: application/json" -b cookie.jar -c cookie.jar --data @test-data/message1.post.json http://localhost:7545/services/postMessage
curl -H "Content-Type: application/json" -b cookie.jar -c cookie.jar --data @test-data/message2.post.json http://localhost:7545/services/postMessage
