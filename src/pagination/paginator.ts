import { Expose } from "class-transformer";
import { SelectQueryBuilder } from "typeorm";

export interface PaginationsOptions {
  currentPage: number;
  limit: number;
  totalPages?: boolean;
}

export class PaginationResults<T>{
  constructor(partial: Partial<PaginationResults<T>>){
    Object.assign(this, partial)
  }
  
  @Expose()
  first: number;
  @Expose()
  last: number;
  @Expose()
  limit: number;
  @Expose()
  totalPages?: number;
  @Expose()
  data: T[]
}

export async function Paginate<T>(
    qb: SelectQueryBuilder<T>, 
    options: PaginationsOptions = { currentPage: 1, limit: 10 }
  ): Promise<PaginationResults<T>> {

  const offset = (options.currentPage - 1) * options.limit;
  const data = await qb.limit(options.limit).offset(offset).getMany();

 return new PaginationResults({
  first: offset + 1,
  last: offset + data.length,
  limit: options.limit,
  totalPages: options.totalPages && await qb.getCount(),
  data
 })
}