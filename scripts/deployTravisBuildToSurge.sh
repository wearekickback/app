#!/bin/bash
# From https://medium.com/onfido-tech/travis-surge-github-auto-deploy-every-pr-branch-and-tag-a6c8c790831f
echo "TRAVIS_SECURE_ENV_VARS: $TRAVIS_SECURE_ENV_VARS"
if [ "$TRAVIS_PULL_REQUEST" != "false" ]
then
  if [ "$TRAVIS_SECURE_ENV_VARS" == "true" ]
  then
    echo "Deploying PR branch to surge..."
    REPO_SLUG_ARRAY=(${TRAVIS_REPO_SLUG//\// })
    REPO_OWNER=${REPO_SLUG_ARRAY[0]}
    REPO_NAME=${REPO_SLUG_ARRAY[1]}
    DEPLOY_PATH=./build
    DEPLOY_SUBDOMAIN=pr${TRAVIS_PULL_REQUEST}
    DEPLOY_DOMAIN=https://${DEPLOY_SUBDOMAIN}-${REPO_NAME}-${REPO_OWNER}.surge.sh
    echo $DEPLOY_DOMAIN
    cp ${DEPLOY_PATH}/index.html ${DEPLOY_PATH}/200.html
    surge -p ${DEPLOY_PATH} -d $DEPLOY_DOMAIN
    GITHUB_PR_COMMENTS=https://api.github.com/repos/${TRAVIS_REPO_SLUG}/issues/${TRAVIS_PULL_REQUEST}/comments
    curl -u "noblocknoparty-devs:${GITHUB_API_TOKEN}" --request POST ${GITHUB_PR_COMMENTS} --data '{"body":"PR deployed at: '${DEPLOY_DOMAIN}'"}'
  else
    echo "No secure envs (probably PR from a fork), skipping."
  fi
else
  echo "Not running on PR, skipping."
  exit -1
fi
