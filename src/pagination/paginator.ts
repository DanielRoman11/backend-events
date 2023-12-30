import { SelectQueryBuilder } from "typeorm";

export interface PaginationsOptions {
  currentPage: number;
  limit: number;
  totalPages?: boolean;
}

export interface PaginationResults<T>{
  first: number;
  last: number;
  limit: number;
  totalPages?: number;
  data: T[]
}

export async function Paginate<T>(
    qb: SelectQueryBuilder<T>, 
    options: PaginationsOptions = { currentPage: 1, limit: 10 }
  ): Promise<PaginationResults<T>> {

  const offset = (options.currentPage - 1) * options.limit;
  const data = await qb.limit(options.limit).offset(offset).getMany();

 return {
  first: offset + 1,
  last: offset + data.length,
  limit: options.limit,
  totalPages: options.totalPages && await qb.getCount(),
  data
 }
}