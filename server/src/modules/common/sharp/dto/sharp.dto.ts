export namespace Sharp {
  export type ConvertSizeImage = (file: Express.Multer.File, type: Type) => Promise<string>;
  export type GenerateImage = (
    old_path: string,
    new_path: string,
    size: { width: number; height: number },
    blur?: boolean,
  ) => Promise<void>;
  export type Type = 'user' | 'event';
}
