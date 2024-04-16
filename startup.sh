#!/bin/sh

export SET_ENV_JS_FILE=/usr/share/nginx/html/assets/set-env.js

envsubst < ${SET_ENV_JS_FILE} > ${SET_ENV_JS_FILE}.tmp
mv ${SET_ENV_JS_FILE}.tmp ${SET_ENV_JS_FILE}

nginx -g 'daemon off;'
