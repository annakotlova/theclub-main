import qrCodeEntity from './qrcode.entity';

import { QrCode } from './dto/qrcode.dto';
import { Common } from '@/interfaces/common.dto';
import { CreateQrCodeDto } from './dto/create-qrcode.dto';

class QrCodeService {
  async findByFilters(f: Common.GetByFilters<QrCode.Dto>) {
    const e = qrCodeEntity.find(f.filters, null, f.options);
    if (f.select) e.select(f.select);
    if (f.populate) e.populate(f.populate);
    if (f.lean) e.lean();
    return e;
  }

  async findOneByFilters(f: Common.GetByFilters<QrCode.Dto>) {
    const e = qrCodeEntity.findOne(f.filters, null);
    if (f.select) e.select(f.select);
    if (f.populate) e.populate(f.populate);
    if (f.lean) e.lean();
    return e;
  }

  async exists({ filters }: Common.Filters<QrCode.Dto>) {
    return qrCodeEntity.exists(filters);
  }

  async count({ filters }: Common.Filters<QrCode.Dto>) {
    return qrCodeEntity.countDocuments(filters);
  }

  async create(dto: CreateQrCodeDto) {
    const exist = await this.exists({ filters: dto });
    if (exist) return false;

    return qrCodeEntity.create(dto);
  }

  async insertMany(dtos: Array<CreateQrCodeDto>) {
    return qrCodeEntity.insertMany(dtos);
  }

  async update({ filters, update, updated, select }: Common.UpdateByFilters<QrCode.Dto>) {
    const e = qrCodeEntity.findOneAndUpdate(filters, update, { new: updated });
    if (select) e.select(select);
    return e.lean();
  }

  async updateMany({ filters, update }: Common.UpdateByFilters<QrCode.Dto>) {
    return qrCodeEntity.updateMany(filters, update);
  }

  async updateDoc({ doc, update }: Common.UpdateDoc<QrCode.Dto>) {
    return doc.updateOne(update, { new: true });
  }

  async delete({ filters }: Common.Filters<QrCode.Dto>) {
    return qrCodeEntity.findOneAndDelete(filters);
  }
}

export default new QrCodeService();
