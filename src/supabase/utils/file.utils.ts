import { v4 as uuidv4 } from 'uuid';

export const generateFileName = (originalName: string, extenstion = 'webp') => {
  if (!originalName) return `${uuidv4()}.${extenstion}`;

  const baseName = originalName.split('.').slice(0, -1).join('.');
  return `${uuidv4()}-${baseName}.${extenstion}`;
};
