import xl from 'excel4node';

import excelConstants from './excel.constants';

import { ErrorHandler } from '@/utils/response';
import dateFilter from '@/utils/date/date.filter';
import { User } from '../user/dto/user.dto';

class ExcelController {
  @ErrorHandler({ request: false, log: true })
  async createUserExcel(users: Array<User.Dto>) {
    const wb = await this.createWorkbook();
    this.setUsers(wb, users);
    return wb;
  }

  @ErrorHandler({ request: false })
  setUsers(wb: any, users: Array<User.Dto>) {
    const ws = wb.addWorksheet('Список транзакций');
    const style = this.getCommonStyle(wb);

    this.setPageHeader(ws, excelConstants.TITLE_USERS);

    users.forEach((user, index) => {
      ws.cell(index + 2, 1)
        .number(user.number || 0)
        .style(style);
      ws.cell(index + 2, 2)
        .string(user.name || '--')
        .style(style);
      ws.cell(index + 2, 3)
        .string(user.phone || '--')
        .style(style);
      ws.cell(index + 2, 4)
        .string(User.RoleName[user.role])
        .style(style);
      ws.cell(index + 2, 5)
        .string(user.email || '--')
        .style(style);
      ws.cell(index + 2, 6)
        .string(user.activated ? 'Да' : 'Нет')
        .style(style);
      ws.cell(index + 2, 7)
        .string(dateFilter(user.createdAt, 'datetime'))
        .style(style);
    });
  }

  @ErrorHandler({ request: false })
  setPageHeader(ws: any, titles: typeof excelConstants.TITLE_USERS) {
    titles.forEach((title, index) => {
      ws.column(index + 1).setWidth(title.width);
      ws.cell(1, index + 1).string(title.name);
    });
  }

  @ErrorHandler({ request: false })
  createWorkbook() {
    return new xl.Workbook({
      defaultFont: {
        name: 'Noto Sans Carian',
      },
    });
  }

  getCommonStyle(wb: any) {
    return wb.createStyle({
      font: {
        bold: false,
        underline: false,
      },
      alignment: {
        wrapText: true,
        vertical: 'top',
      },
    });
  }
}

export default new ExcelController();
