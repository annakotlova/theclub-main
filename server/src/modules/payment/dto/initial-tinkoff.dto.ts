export interface InitialTinkoffDto {
  Amount: number;
  OrderId: string;
  Description: string;
  TerminalKey: string;
  FailURL: string;
  SuccessURL: string;
  CustomerKey?: string;
}
