import express from 'express';

import './paths';
import common from '@/common/index';

function main() {
  const app = express();
  common(app);

  app.set('trust proxy', 1);
  app.get(/.*/, (_req, res) => res.sendFile(__dirname + '/public/index.html'));
  
  process.on('uncaughtException', function (err) {
    console.error(err);
    console.log('Node NOT Exiting...');
  });
}

main();