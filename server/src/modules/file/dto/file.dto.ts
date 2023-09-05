import { Common } from '@/interfaces/common.dto';
import { User } from '@/modules/user/dto/user.dto';

export namespace File {
  export interface Dto extends Common.BaseModel {
    type: Type;
    src: string;
    name: string;
    meta: Record<string, string>,
    size: number;
    cover: string;
    mimetype: string;
    creator: Common.BaseModel['_id'] | User.Dto;
  }
  export enum Type {
    IMAGE = 'IMAGE',
    DOCUMENT = 'DOCUMENT',
  }
}

/**
 * @swagger
 * components:
 *  schemas:
 *    FileEntity:
 *      description: Сущность файла
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *          description: ID файла
 *        type:
 *          $ref: '#/components/schemas/FileTypeEnum'
 *        src:
 *          type: string
 *          example: /upload/user/631990ddac7d053f66e8e3c3/picture.webp
 *        name:
 *          type: string
 *          example: picture
 *        size:
 *          type: number
 *          format: 1000
 *        mimetype:
 *          type: string
 *          example: image/webp
 *        cover:
 *          type: string
 *          example: /upload/user/631990ddac7d053f66e8e3c3/picture.webp
 *          description: Обложка изображения в плохом качестве + блюр, можно использовать как прелоудер
 *        creater:
 *          type: string
 *          description: ID создателя файла
 *        createdAt:
 *          type: string
 *          format: date-time
 *        updatedAt:
 *          type: string
 *          format: date-time
 *    FilePopulateEntity:
 *      description: Сущность файла
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *          description: ID файла
 *        type:
 *          $ref: '#/components/schemas/FileTypeEnum'
 *        src:
 *          type: string
 *          example: /upload/user/631990ddac7d053f66e8e3c3/picture.webp
 *        cover:
 *          type: string
 *          example: /upload/user/631990ddac7d053f66e8e3c3/picture.webp
 *          description: Обложка изображения в плохом качестве + блюр, можно использовать как прелоудер
 *    FileTypeEnum:
 *      type: string
 *      enum:
 *        - IMAGE
 *        - DOCUMENT
 */