import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsString, Length } from "class-validator";

export class CreateEventDto {
  @IsString()
  @Length(5, 255, { message: 'The name length is wrong' })
  @ApiProperty()
  name: string;
  
  @Length(5, 255)
  @ApiProperty()
  description: string;
  
  @IsDateString()
  @ApiProperty()
  when: string;
  
  @Length(5, 255)
  @ApiProperty()
  address: string;
}