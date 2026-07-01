import { ScheduleRowDto } from './schedule-row.dto';
import { SimulationResultDto } from './simulation-result.dto';

export interface SimulationDto extends Omit<SimulationResultDto, 'schedule'> {
  id: number;
  code: string;
  clientId: number;
  vehicleId: number;
  financialProductId: number;
  currency: string;
  status: string;
  createdAt: string;
  productSnapshot: Record<string, unknown>;
  schedule: ScheduleRowDto[] | null;
}
