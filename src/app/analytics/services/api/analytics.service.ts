import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DashboardResponseDto } from '../../models/dtos/dashboard-response.dto';
import { API_URL } from '../../../services/api.service';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private http = inject(HttpClient);

  getDashboard() {
    return this.http.get<DashboardResponseDto>(`${API_URL}/analytics/dashboard`);
  }
}
