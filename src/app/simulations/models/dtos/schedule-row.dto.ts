export interface ScheduleRowDto {
  period: number;
  date: string;
  initialBalance: number;
  payment: number;
  balloonPayment: number;
  interest: number;
  amortization: number;
  insurance: number;
  commission: number;
  totalPayment: number;
  finalFlow: number;
  baseFlow: number;
  finalBalance: number;
  graceType: 'NONE' | 'PARTIAL' | 'TOTAL';
}
