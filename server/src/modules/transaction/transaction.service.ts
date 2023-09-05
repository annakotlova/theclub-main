import transactionEntity from './transaction.entity';

import { Common } from '@/interfaces/common.dto';
import { Transaction } from './dto/transaction.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';

class TransactionService {
  async findByFilters(f: Common.GetByFilters<Transaction.Dto>) {
    const e = transactionEntity.find(f.filters, null, f.options);
    if (f.select) e.select(f.select);
    if (f.populate) e.populate(f.populate);
    if (f.lean) e.lean();
    return e;
  }

  async findOneByFilters(f: Common.GetByFilters<Transaction.Dto>) {
    const e = transactionEntity.findOne(f.filters, null);
    if (f.select) e.select(f.select);
    if (f.populate) e.populate(f.populate);
    if (f.lean) e.lean();
    return e;
  }

  async exists({ filters }: Common.Filters<Transaction.Dto>) {
    return transactionEntity.exists(filters);
  }

  async count({ filters }: Common.Filters<Transaction.Dto>) {
    return transactionEntity.countDocuments(filters);
  }

  async create(dto: CreateTransactionDto) {
    return transactionEntity.create(dto);
  }

  async update({ filters, update, updated, populate }: Common.UpdateByFilters<Transaction.Dto>) {
    const e = transactionEntity.findOneAndUpdate(filters, update, { new: updated });
    if (populate) e.populate(populate);
    return e.lean();
  }

  async updateMany({ filters, update }: Common.UpdateByFilters<Transaction.Dto>) {
    return transactionEntity.updateMany(filters, update);
  }

  async updateDoc({ doc, update }: Common.UpdateDoc<Transaction.Dto>) {
    return doc.updateOne(update, { new: true });
  }

  async delete({ filters }: Common.Filters<Transaction.Dto>) {
    return transactionEntity.findOneAndDelete(filters);
  }

  async deleteMany({ filters }: Common.Filters<Transaction.Dto>) {
    return transactionEntity.deleteMany(filters);
  }
}

export default new TransactionService();
