import { File } from './file.dto';

export type CreateFileDto = Pick<File.Dto, 'src' | 'name' | 'size' | 'cover' | 'type' | 'creator' | 'meta'>;

/**
 * @swagger
 * components:
 *  schemas:
 *    CreateFileDto:
 *      type: object
 *      properties:
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
 *        cover:
 *          type: string
 *          example: /upload/user/631990ddac7d053f66e8e3c3/picture.webp
 *          description: Обложка изображения в плохом качестве + блюр, можно использовать как прелоудер
 */