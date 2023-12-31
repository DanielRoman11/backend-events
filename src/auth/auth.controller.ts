import { Controller, Get, Injectable, Logger, Post, Request, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { CurrentUser } from "./current-user.decorator";
import { User } from "./user.entity";
import { AuthGuardLocal } from "./auth-guard.local";
import { AuthGuardJwt } from "./auth-guard.jwt";


@Controller('auth')
export class AuthController {
  private readonly logger: Logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
  ) { }

  @Post('login')
  @UseGuards(AuthGuardLocal)
  async login(@CurrentUser() user: User) {
    return {
      userId: user.id,
      token: this.authService.getTokenForUser(user)
    }
  }

  @Get('profile')
  @UseGuards(AuthGuardJwt)
  async getProfile(@CurrentUser() user: User){
    return user;
  }
}