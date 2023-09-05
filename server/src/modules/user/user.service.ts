import userEntity from './user.entity';

import { User } from './dto/user.dto';
import { Common } from '@/interfaces/common.dto';
import { CreateUserDto } from './dto/create-user.dto';

import { createPassword } from '@/utils/password';

class UserService {
  async findByFilters(f: Common.GetByFilters<User.Dto>) {
    const e = userEntity.find(f.filters, null, f.options);
    if (f.select) e.select(f.select);
    if (f.populate) e.populate(f.populate);
    if (f.lean) e.lean();
    return e;
  }

  async findOneByFilters(f: Common.GetByFilters<User.Dto>) {
    const e = userEntity.findOne(f.filters, null);
    if (f.select) e.select(f.select);
    if (f.populate) e.populate(f.populate);
    if (f.lean) e.lean();
    return e;
  }

  async exists({ filters }: Common.Filters<User.Dto>) {
    return userEntity.exists(filters);
  }

  async count({ filters }: Common.Filters<User.Dto>) {
    return userEntity.countDocuments(filters);
  }

  async create(dto: CreateUserDto) {
    return userEntity.create(dto);
  }

  async createMany(dto: Array<CreateUserDto>) {
    return userEntity.insertMany(dto);
  }

  createPassword(password: string) {
    return createPassword(password);
  }

  async update({ filters, update, updated, select }: Common.UpdateByFilters<User.Dto>) {
    const e = userEntity.findOneAndUpdate(filters, update, { new: updated });
    if (select) e.select(select);
    return e.lean();
  }

  async updateActivated(data: { user: Common.BaseModel['_id']; activated: boolean }) {
    const userUpdate: Common.UpdateByFilters<User.Dto> = {
      filters: { _id: data.user },
      update: { activated: data.activated },
    };
    await this.update(userUpdate);
  }

  async updateMany({ filters, update }: Common.UpdateByFilters<User.Dto>) {
    return userEntity.updateMany(filters, update);
  }

  async updateDoc({ doc, update }: Common.UpdateDoc<User.Dto>) {
    return doc.updateOne(update, { new: true });
  }

  async delete({ filters }: Common.Filters<User.Dto>) {
    return userEntity.findOneAndDelete(filters);
  }

  async deleteMany({ filters }: Common.Filters<User.Dto>) {
    return userEntity.deleteMany(filters);
  }
}

export default new UserService();
