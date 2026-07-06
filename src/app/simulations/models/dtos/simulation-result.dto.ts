import { ScheduleRowDto } from './schedule-row.dto';

export interface SimulationResultDto {
  monthlyPayment: number;
  teaPercent: number;
  temPercent: number;
  cokTeaPercent: number;
  cokTemPercent: number;
  tirPercent: number;
  tceaPercent: number;
  van: number;
  totalInterest: number;
  totalInsurance: number;
  totalFees: number;
  totalPayment: number;
  schedule: ScheduleRowDto[];
}
