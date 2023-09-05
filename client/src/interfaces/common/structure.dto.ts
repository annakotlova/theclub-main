import { CommonObject } from '../common/index.dto';

export interface StructureInput {
  id: string;
  type: string;
  name: string;
  grid: string;
  required: boolean;
  placeholder: string;
  drop?: Array<CommonObject>;
  drop_context?: Array<CommonObject>;
  drop_enum?: any;
  drop_show?: boolean;
  show?: boolean;
  error?: boolean;
  errorName?: string;
  mask?: string;
  disabled?: boolean;
  icon?: any;
  [key: string]: unknown;
}

export interface StructureOptions {
  modal?: boolean;
}

export interface StructureModule {
  classList?: string;
  inputs: Array<StructureInput>;
  data: Record<string, any>;
  options?: StructureOptions;
  id?: string;
}

export interface StructureProps {
  input: StructureInput;
  data: Record<string, any>;
}
