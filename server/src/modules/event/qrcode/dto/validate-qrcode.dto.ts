import { QrCode } from './qrcode.dto';

export type ValidateQrcodeDto = Pick<QrCode.Dto, 'code'>;
