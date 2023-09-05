import { FileDto } from '@/interfaces/file/file.dto';

export type MediaSizes = 'main' | 'small' | 'verysmall' | 'large';

export interface MediaProps {
  image: File | FileDto | string | null | undefined;
}
