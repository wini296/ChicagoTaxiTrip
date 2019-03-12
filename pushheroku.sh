#!/bin/bash
echo "Pushing to Heroku"
git add .
git commit -am "make it better"
git push heroku master
