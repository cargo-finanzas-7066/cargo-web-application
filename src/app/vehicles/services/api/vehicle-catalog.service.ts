import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../../../services/api.service';
import { VehicleDto } from '../../models/dtos/vehicle.dto';

@Injectable({ providedIn: 'root' })
export class VehicleCatalogService {
  private http = inject(HttpClient);
  vehicles = signal<VehicleDto[]>([]);

  refresh() {
    this.http.get<VehicleDto[]>(`${API_URL}/vehicles/catalog`).subscribe((vehicles) => {
      this.vehicles.set(vehicles);
    });
  }

  getAll() {
    return this.http.get<VehicleDto[]>(`${API_URL}/vehicles/catalog`);
  }
}
