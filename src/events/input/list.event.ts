export enum WhenEventFilter {
  All = 1,
  Today,
  Tomorrow,
  ThisWeek,
  NextWeek,
  ThisMonth,
  NextMonth,
  ThisYear,
  NextYear
}

export class ListEvents {
  when?: WhenEventFilter = WhenEventFilter.All;
}
