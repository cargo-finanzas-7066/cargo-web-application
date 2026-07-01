import { ScheduleRowDto } from './schedule-row.dto';

export interface SimulationResultDto {
  monthlyPayment: number;
  teaPercent: number;
  temPercent: number;
  tirPercent: number;
  tceaPercent: number;
  van: number;
  totalInterest: number;
  totalInsurance: number;
  totalFees: number;
  totalPayment: number;
  schedule: ScheduleRowDto[];
}
