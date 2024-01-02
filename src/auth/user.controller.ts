import { BadRequestException, Body, ConflictException, Controller, Injectable, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "./input/create.user.dto";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Controller('users')
export class UserController {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  @Post()
  async create(@Body() createUserDto: CreateUserDto){
    const { email, firstname, lastname, password, retypePassword, username } = createUserDto;

    if(password !== retypePassword){
      throw new BadRequestException(['Passwords are not identical.'])
    }

    const isExistingUser = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email OR user.username = :username', {email, username})
      .getOne();
    
    if(isExistingUser){
      throw new BadRequestException(['Username or email is already taken.'])
    }

    const user = new User();

    user.username = username;
    user.email = email;
    user.firstname = firstname;
    user.lastname = lastname;
    user.password = await this.authService.hashPassword(password);

    return {
      ...(await this.userRepository.save(user)),
      token: this.authService.getTokenForUser(user)
    };
  }
}
