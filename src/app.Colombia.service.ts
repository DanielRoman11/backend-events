import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AppColombiaService {
  constructor(
    @Inject('APP_NAME')
    private readonly name: string,
    @Inject('MESSAGE')
    private readonly message: string,
  ) {}

  getHello(): string {
    return `Hola mundo! from ${this.name}, ${this.message}`;
  }
}
