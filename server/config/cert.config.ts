import fs from 'fs';

export const getCertConfig = () => {
  const folder = process.env.KEYS_FOLDER;
  return {
    key: fs.readFileSync(folder + '/private.key'),
    cert: fs.readFileSync(folder + '/certificate.crt'),
    dhparam: fs.readFileSync(folder + '/dhparam.pem'),
    hostname: process.env.HOSTNAME,
  };
};
