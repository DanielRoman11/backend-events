import { IsEmail, IsString, Length } from "class-validator";

export class CreateUserDto {
  @IsString()
  @Length(5)
  username:string;
  
  @Length(8)
  password:string;
  
  @Length(8)
  retypePassword:string;
  
  @IsEmail()
  email:string;
  
  @Length(2)
  @IsString()
  firstname:string;
  
  @IsString()
  @Length(2)
  lastname:string; 
}