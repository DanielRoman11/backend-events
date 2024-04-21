import { ApiProperty } from '@nestjs/swagger';

export enum WhenEventFilter {
  All = 1,
  Today,
  Tomorrow,
  ThisWeek,
  NextWeek,
  ThisMonth,
  NextMonth,
  ThisYear,
  NextYear,
}

export class ListEvents {
  @ApiProperty({ required: false })
  when?: WhenEventFilter = WhenEventFilter.All;
  
  @ApiProperty({
    default: 1,
  })
  page: number = 1;
}
