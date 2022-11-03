import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import * as crypto from 'crypto';

@Injectable()
export class UtilService {
  constructor(private jwtService: JwtService) {}

  /**
   * Takes plain text as string and returns hashed string using argon2 algorithm
   * @param plainText plain text to be masked
   * @returns hashed string using argon2 algorithm with argon2id specs
   */
  async argon2hash(plainText: string): Promise<string> {
    const hash = await argon2.hash(plainText, {
      type: argon2.argon2id,
      hashLength: 32,
      parallelism: 4,
      memoryCost: 65536,
      timeCost: 10,
      salt: crypto.randomBytes(16),
      saltLength: 16,
    });

    return hash;
  }

  /**
   * Takes hash and text as string and returns whether the text verifies with argon2 hash
   * @param hash argon2 hash
   * @param plainText plain text to match
   * @returns whether text verifies with argon2 hash
   */
  async argon2verify(hash: string, plainText: string): Promise<boolean> {
    return await argon2.verify(hash, plainText, { type: argon2.argon2id });
  }

  /**
   * Takes payload as string | object and returns jwt
   * @param payload plain text to be masked
   * @returns jwt
   */
  async signJWT(
    payload: string | object,
    options?: JwtSignOptions,
  ): Promise<string> {
    const signedToken = await this.jwtService.signAsync(payload, options);
    return signedToken;
  }

  /**
   * Takes token as string and returns payload
   * @param token jwt to verify
   * @returns decoded payload
   */
  async decodeJWT(token: string): Promise<any> {
    return this.jwtService.decode(token);
  }
}
