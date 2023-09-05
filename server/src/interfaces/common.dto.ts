import { Document, FilterQuery, PopulateOptions, QueryOptions, Types, UpdateQuery } from 'mongoose';
import { NextFunction, Request, Response } from 'express';

export namespace Common {
  export enum TokenType {
    CODE = 'CODE',
    RESET = 'RESET',
    ACCESS = 'ACCESS',
    REFRESH = 'REFRESH',
  }
  export interface BaseModel {
    readonly _id: string | Types.ObjectId;
    createdAt: Date;
    updatedAt: Date | null;
  }
  export interface GetList {
    limit?: string;
    page?: string;
    search?: string;
  }
  export interface Filters<T> {
    filters: FilterQuery<T>;
  }
  export interface GetByFilters<T> extends Filters<T> {
    options?: QueryOptions<T>;
    select?: string;
    populate?: PopulateOptions | PopulateOptions[];
    lean?: boolean;
  }
  export interface UpdateByFilters<T> {
    filters: FilterQuery<T>;
    update: UpdateQuery<T>;
    updated?: boolean;
    populate?: PopulateOptions | PopulateOptions[];
    select?: string;
  }
  export interface UpdateDoc<T> {
    doc: Document<unknown, any, T>;
    update: UpdateQuery<T>;
  }
  export type ExpressFunction = (req: Request, res: Response, next: NextFunction) => void | Promise<void>;
  export const InvalidObjectID = 'Некорректный идентификатор!';
}
