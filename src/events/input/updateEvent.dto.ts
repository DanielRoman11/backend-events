import { PartialType } from '@nestjs/swagger';
import { CreateEventDto } from './createEvents.dto';

export class UpdateEventDto extends PartialType(CreateEventDto) {}
