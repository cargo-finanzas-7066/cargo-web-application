import { ScheduleRowDto } from './schedule-row.dto';

export interface SimulationResultDto {
  monthlyPayment: number;
  balloonAmount: number;
  tea: number;
  tem: number;
  van: number;
  tir: number;
  tcea: number;
  financedAmount: number;
  totalInterest: number;
  totalInsurance: number;
  totalCommissions: number;
  totalCreditCost: number;
  totalPayment: number;
  schedule: ScheduleRowDto[];
}
