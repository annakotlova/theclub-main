import multer from 'multer';
import fs from 'fs/promises';

const MAX_SIZE = 26_214_400; // 25 мб

const getFileName = (name: string) =>
  Buffer.from(name, 'latin1').toString('utf8').replaceAll(' ', '_');

const createDirectory = async (dir: string) => {
  try {
    await fs.mkdir(dir);
  } finally {
    return true;
  }
};

export const multerExcel = multer({ storage: multer.memoryStorage() });

export const multerCommonCover = (env_name: string) => {
  const storage = multer.diskStorage({
    destination: async (req, _file, callback) => {
      const dir = `${process.env[env_name]}/${req.body._id}`;
      await createDirectory(dir);
      callback(null, dir);
    },
    filename(_req, file, callback) {
      callback(null, getFileName(file.originalname));
    },
  });
  return multer({ storage, limits: { fileSize: MAX_SIZE } });
};

export const multerUserAvatar = (env_name: string) => {
  const storage = multer.diskStorage({
    destination: async (req, _file, callback) => {
      const dir = `${process.env[env_name]}/${req.query.identificator}`;
      await createDirectory(dir);
      callback(null, dir);
    },
    filename(_req, file, callback) {
      callback(null, getFileName(file.originalname));
    },
  });
  return multer({ storage, limits: { fileSize: MAX_SIZE } });
};
