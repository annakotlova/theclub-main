import { Response } from 'express';

export namespace Token {
  export type Generate = (tokens: Record<string, string>, res: Response) => void;
  export type Remove = (tokens: Array<string>, res: Response) => void;
}
