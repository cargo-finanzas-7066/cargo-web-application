import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from './api.service';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private http = inject(HttpClient);

  getStats() {
    return this.http.get<{ totalSimulations: number; totalClients: number; totalVehicles: number; totalEntities: number }>(
      `${API_URL}/dashboard/stats`
    );
  }
}
