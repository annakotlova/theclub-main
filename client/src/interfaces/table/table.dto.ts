export interface TableMain {
  id: string;
  variables: Array<string>;
  data: Array<Record<string, any>>;
}

export interface TableOptions {
  id: string;
  width: string;
  min_width: string;
  name: string;
  request: string;
  empty: string;
  actions?: {
    table?: {
      edit?: boolean;
      transaction?: boolean;
    };
    search?: {
      status?: boolean;
      name?: string;
    };
    header?: {
      filters?: boolean;
      excel?: boolean;
    }
    click?: boolean;
  };
  elements: Array<TableElement>;
}

export interface TableElement {
  id: string;
  name: string;
  width: string;
  filter?: TableElementFilter;
}
export interface TableElementFilter {
  id: string;
  type: string;
  list?: Array<Record<string, any>>;
  request?: string;
  value?: string | number;
}