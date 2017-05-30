docker login -u="$DOCKER_USERNAME" -p="$DOCKER_PASSWORD";
VERSION=`node -e "console.log(require('./package.json').version);"`;

if [ "$TRAVIS_BRANCH" == "dev" ]; then
  sed -i "s/$VERSION/$VERSION-dev/g" package.json;
elif [ "$TRAVIS_BRANCH" != "master" ] && [ "$TRAVIS_BRANCH" != "dev" ]; then
  sed -i "s/$VERSION/$VERSION-${TRAVIS_BRANCH#*/}/g" package.json;
fi

docker build -t theconnman/npmjrss .;

if [ "$TRAVIS_BRANCH" == "master" ]; then
  docker tag theconnman/npmjrss theconnman/npmjrss:$VERSION;
  docker push theconnman/npmjrss:latest;
  docker push theconnman/npmjrss:$VERSION;
elif [ "$TRAVIS_BRANCH" == "dev" ]; then
  docker tag theconnman/npmjrss theconnman/npmjrss:latest-dev;
  docker push theconnman/npmjrss:latest-dev;
else
  docker tag theconnman/npmjrss theconnman/npmjrss:${TRAVIS_BRANCH#*/};
  docker push theconnman/npmjrss:${TRAVIS_BRANCH#*/};
fi
