import { Common } from '@/interfaces/common.dto';
import { Sharp } from '@/modules/common/sharp/dto/sharp.dto';

export interface GenerateFileDto {
  multerFile: Express.Multer.File;
  creator: Common.BaseModel['_id'];
  path: string;
  sharpType?: Sharp.Type;
};