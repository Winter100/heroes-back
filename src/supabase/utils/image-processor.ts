import * as sharp from 'sharp';

export const toWebp = (buffer: Buffer, quality = 80): Promise<Buffer> => {
  return sharp(buffer).webp({ quality }).toBuffer();
};
