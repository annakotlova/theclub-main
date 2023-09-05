import { TimestampDto } from '../common/index.dto';

export interface FileDto extends TimestampDto {
  type: FileType;
  src: string;
  name: string;
  meta: Record<string, string> & { orientation: string };
  size: number;
  cover: string;
  mimetype: string;
  creator: string;
}

export enum FileType {
  IMAGE = 'IMAGE',
  DOCUMENT = 'DOCUMENT',
}
