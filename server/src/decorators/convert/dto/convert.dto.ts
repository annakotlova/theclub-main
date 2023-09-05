import { convertes } from '../constants';

export namespace Convert {
  export type Body = Array<{
    id: string;
    required: boolean;
    type: string;
    name: string;
    enum: any;
  }>;
  export type TrimElementFunction = (object: Record<string, string>, trim: string) => void;
  export type ConvertBodyFunctionOptions = {
    type: keyof typeof convertes;
    object: Record<string, string>;
    trim?: string;
  };
  export type ConvertBodyFunctionResponse = {
    status: boolean;
    body: string | Record<string, any>;
  };
  export type CheckEnumKeyFunction = (
    body: Record<string, string | string[]>,
    result: Record<string, any>,
    key: Convert.Body[number],
    errors: string[],
  ) => void;
  export type ObjectCheckFunction = (
    body: Record<string, string | number | object | boolean>,
    keys: Body,
  ) => ConvertBodyFunctionResponse;
  export type ConvertBodyFunction = (
    options: ConvertBodyFunctionOptions,
  ) => ConvertBodyFunctionResponse;
}
