import { ApiWrapper } from '..';
import { CommonQuery, Response, ResponseWithTotal } from '@/interfaces/common/index.dto';

interface ITableService {
  getPagination(url: string, params: CommonQuery): ResponseWithTotal<Array<Record<string, any>>>;
}

class TableAPI extends ApiWrapper implements ITableService {
  constructor() {
    super('', true);
  }
  async getPagination(
    url: string,
    params: CommonQuery,
  ): ResponseWithTotal<Array<Record<string, any>>> {
    return await this._axios.request({ url, params });
  }
  async getFilterList(url: string): Response<Array<Record<string, any>>> {
    return await this._axios.request({ url });
  }
}

const tableAPI = new TableAPI();
export default tableAPI;
