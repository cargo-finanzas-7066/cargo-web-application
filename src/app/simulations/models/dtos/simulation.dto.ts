import { GraceType } from './simulation-request.dto';
import { ScheduleRowDto } from './schedule-row.dto';
import { SimulationResultDto } from './simulation-result.dto';

export interface SimulationDto extends Omit<SimulationResultDto, 'schedule'> {
  id: number;
  code: string;
  clientId: number;
  vehicleId: number;
  financialProductId: number;
  currency: string;
  vehiclePrice: number;
  downPaymentPercent: number;
  financedAmount: number;
  termMonths: number;
  firstPaymentDate: string;
  paymentDay: number;
  graceType: GraceType;
  graceMonths: number;
  balloonPercent: number;
  createdAt: string;
  productSnapshot: Record<string, unknown>;
  schedule: ScheduleRowDto[] | null;
}
