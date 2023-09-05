import { FilterQuery, QueryOptions } from 'mongoose';

type DefinePagination = (options: Record<string, any>, query: Record<string, any>) => void;
type DefineFilter = (
  filters: FilterQuery<any>,
  query: qs.ParsedQs,
  options: Array<{ name: string; type?: string }>,
) => void;
type DefineSort = (options: QueryOptions, query: qs.ParsedQs, sorts: string[]) => void;

export const definePagination: DefinePagination = (options, query) => {
  if (query.limit) options.limit = Number(query.limit);
  if (query.page) options.skip = Number(query.limit) * (Number(query.page) - 1);
};

export const defineFilter: DefineFilter = (filters, query, options) => {
  for (const filter of options) {
    if (!query[filter.name]) continue;
    if (filter.type) {
      filters[filter.name] = {};
      filters[filter.name][filter.type] = query[filter.name];
    } else if (filter.name.includes('At')) {
      const date = new Date(String(query[filter.name]));
      filters[filter.name] = {
        $gte: date,
        $lte: new Date(new Date(date).setDate(date.getDate() + 1)),
      };
    } else {
      filters[filter.name] = query[filter.name];
      if (filters[filter.name] === 'true') filters[filter.name] = true;
      if (filters[filter.name] === 'false') filters[filter.name] = false;
    }
  }
};

export const defineSorts: DefineSort = (options, query, sorts) => {
  for (const sort of sorts)
    if (query[sort]) {
      options.sort[sort] = Number(query[sort]);
      delete options.sort.createdAt;
    }
};

// export const defineUniqueObjects = function (array: Array<Record<string, any>>) {
//   let tmpArray: Array<string> = [];
//   function itemCheck(item: Record<string, any>) {
//     if (tmpArray.indexOf(String(item.user)) === -1) {
//       tmpArray.push(String(item.user));
//       return true;
//     }
//     return false;
//   }
//   return array.filter((item) => itemCheck(item));
// };
