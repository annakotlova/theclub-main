import { QrCode } from './qrcode.dto';

export type CreateQrCodeDto = Pick<QrCode.Dto, 'event' | 'member' | 'code'>;
