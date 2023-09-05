import fileEntity from './file.entity';

import { File } from './dto/file.dto';
import { Common } from '@/interfaces/common.dto';
import { CreateFileDto } from './dto/create-file.dto';

class FileService {
  async findByFilters(f: Common.GetByFilters<File.Dto>) {
    const e = fileEntity.find(f.filters, null, f.options);
    if (f.select) e.select(f.select);
    if (f.populate) e.populate(f.populate);
    if (f.lean) e.lean();
    return e;
  }

  async findOneByFilters(f: Common.GetByFilters<File.Dto>) {
    const e = fileEntity.findOne(f.filters, null);
    if (f.select) e.select(f.select);
    if (f.populate) e.populate(f.populate);
    if (f.lean) e.lean();
    return e;
  }

  async exists({ filters }: Common.Filters<File.Dto>) {
    return fileEntity.exists(filters);
  }

  async count({ filters }: Common.Filters<File.Dto>) {
    return fileEntity.countDocuments(filters);
  }

  async create(dto: CreateFileDto) {
    return fileEntity.create(dto);
  }

  async update({ filters, update, updated, select }: Common.UpdateByFilters<File.Dto>) {
    const e = fileEntity.findOneAndUpdate(filters, update, { new: updated });
    if (select) e.select(select);
    return e.lean();
  }

  async updateMany({ filters, update }: Common.UpdateByFilters<File.Dto>) {
    return fileEntity.updateMany(filters, update);
  }

  async updateDoc({ doc, update }: Common.UpdateDoc<File.Dto>) {
    return doc.updateOne(update, { new: true });
  }

  async delete({ filters }: Common.Filters<File.Dto>) {
    return fileEntity.findOneAndDelete(filters);
  }
}

export default new FileService();
