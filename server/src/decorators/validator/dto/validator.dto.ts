export namespace IValidator {
  export type Type = 'email' | 'phone' | 'objectid' | 'password' | 'link';
  export type ItemFunction = (check: string) => boolean;
  export type MainFunction = (list: Array<{ item: string; type: Type }>) => {
    status: boolean;
    errors: string;
  };
}
