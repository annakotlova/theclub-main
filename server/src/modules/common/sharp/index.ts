import sharp from 'sharp';
import fs from 'fs/promises';
import { Sharp } from './dto/sharp.dto';

const sizes = {
  event: [
    { width: 1200, height: 400, type: 'main' },
    { width: 600, height: 200, type: 'medium' },
    { width: 300, height: 100, type: 'small' },
  ],
  user: [
    { width: 200, height: 200, type: 'main' },
    { width: 100, height: 100, type: 'medium' },
    { width: 50, height: 50, type: 'small' },
  ],
};

const generateImage: Sharp.GenerateImage = async (old_path, new_path, size, blur = false) => {
  if (blur) await sharp(old_path).resize(size.width, size.height).webp().blur(8).toFile(new_path);
  else await sharp(old_path).resize(size.width, size.height).webp().toFile(new_path);
};

export const convertSizeImage: Sharp.ConvertSizeImage = async (file, type) => {
  const { filename: image } = file;

  const webp = image.replace(/png|jpeg|jpg/g, 'webp').replace(/\s/g, '');

  for (const size of sizes[type])
    await generateImage(file.path, file.destination + `/resize_${size.type}_${webp}`, size);

  const first = sizes[type][0];
  if (first) await generateImage(file.path, file.destination + `/cover_main_${webp}`, first, true);

  try {
    await fs.unlink(file.path);
  } finally {
    return webp;
  }
};
