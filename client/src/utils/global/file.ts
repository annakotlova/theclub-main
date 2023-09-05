import { useNotificationStore } from '@/store/notification';
import { NOTIFICATION_MESSAGE } from '../enums/notification';

const MAX_SIZE = 26_214_400;
const notification = useNotificationStore();

export const checkFileSize = (files: Array<File>): boolean => {
  for (const file of files) {
    if (file.size > MAX_SIZE) {
      notification.create({
        type: 'error',
        message: NOTIFICATION_MESSAGE.MAX_FILE_SIZE(file.name, convertRequestSize(MAX_SIZE)),
      });
      return false;
    }
  }
  return true;
};

export const checkImagesType = (files: Array<File>): boolean => {
  for (const file of files) if (!checkFileType(file, 'image')) return false;
  return true;
};

export const checkFileType = (file: File, type: 'image'): boolean => {
  if (type === 'image' && !file.type.includes('image')) {
    notification.create({
      type: 'error',
      message: NOTIFICATION_MESSAGE.UPLOAD_IMAGE_TYPE,
    });
    return false;
  }
  return true;
};

export const convertRequestSize = (size: number) => {
  let length = 0;
  const list = ['Б', 'КБ', 'МБ'];
  while (size > 1000) {
    size = size / 1000;
    length++;
  }
  return `${Math.ceil10(size, -2)} ${list[length]}`;
};

export function b64toBlob(b64Data: any, contentType?: any, sliceSize?: any) {
  contentType = contentType || '';
  sliceSize = sliceSize || 512;

  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) byteNumbers[i] = slice.charCodeAt(i);

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
}

export const handleInputUpdated = (fileList: File[], callback: any) => {
  const file = fileList[0];

  getOrientation(file, (orientation: number) => {
    callback(orientation);
  });
};

export function getOrientation(file: File, callback: any) {
  const reader = new FileReader();
  reader.onload = function (event: any) {
    const view = new DataView(event.target.result);
    if (view.getUint16(0, false) != 0xffd8) return callback(-2);

    let length = view.byteLength,
      offset = 2;

    while (offset < length) {
      const marker = view.getUint16(offset, false);
      offset += 2;

      if (marker == 0xffe1) {
        if (view.getUint32((offset += 2), false) != 0x45786966) {
          return callback(-1);
        }
        const little = view.getUint16((offset += 6), false) == 0x4949;
        offset += view.getUint32(offset + 4, little);
        const tags = view.getUint16(offset, little);
        offset += 2;

        for (let i = 0; i < tags; i++)
          if (view.getUint16(offset + i * 12, little) == 0x0112)
            return callback(view.getUint16(offset + i * 12 + 8, little));
      } else if ((marker & 0xff00) != 0xff00) break;
      else offset += view.getUint16(offset, false);
    }
    return callback(-1);
  };
  reader.readAsArrayBuffer(file.slice(0, 64 * 1024));
}
