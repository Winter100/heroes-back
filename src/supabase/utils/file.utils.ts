import { v4 as uuidv4 } from 'uuid';

export const generateFileName = (extenstion = 'webp') => {
  return `${uuidv4()}.${extenstion}`;
};
