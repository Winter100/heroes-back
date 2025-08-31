import * as bcrype from 'bcryptjs';

const SALT_ROUNDS = 10;

export class PasswordHasher {
  static async hash(password: string) {
    return await bcrype.hash(password, SALT_ROUNDS);
  }

  static async compare(password: string, hash: string) {
    return await bcrype.compare(password, hash);
  }
}
