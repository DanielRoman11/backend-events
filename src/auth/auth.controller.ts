import { Controller, Get, Injectable, Logger, Post, Request, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {
  private readonly logger: Logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
  ) { }

  @Post('login')
  @UseGuards(AuthGuard('local'))
  async login(@Request() req) {
    return {
      userId: req.user.id,
      token: this.authService.getTokenForUser(req.user),
    }
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Request() req){
    return req.user;
  }
}