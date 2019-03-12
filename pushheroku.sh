#!/bin/bash
echo "Pushing to Heroku"
git init
git add .
git commit -am "make it better"
git push heroku master
