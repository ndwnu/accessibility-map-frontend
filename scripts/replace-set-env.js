const fs = require('fs');

/* This file overwrites set-env.js by set-env.prod.js.
 * Start up script startup.sh will run when the docker container starts,
 * filling in the environment variables.
 */

fs.renameSync(
  'dist/accessibility-map-frontend/browser/assets/set-env.prod.js',
  'dist/accessibility-map-frontend/browser/assets/set-env.js',
);
