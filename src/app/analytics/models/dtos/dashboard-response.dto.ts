import { VehicleDto } from '../../../vehicles/models/dtos/vehicle.dto';
import { RecentActivityDto } from './recent-activity.dto';

export interface DashboardResponseDto {
  totalSimulations: number;
  totalClients: number;
  recentActivities: RecentActivityDto[];
  recentVehicles: VehicleDto[];
}
