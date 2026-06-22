import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Vehicle } from '../models';
import { API_URL } from './api.service';

@Injectable({ providedIn: 'root' })
export class VehicleService {
  private http = inject(HttpClient);
  vehicles = signal<Vehicle[]>([]);

  constructor() { this.refresh(); }

  refresh() {
    this.http.get<Vehicle[]>(`${API_URL}/vehicles`).subscribe(data => this.vehicles.set(data));
  }

  getAll() { return this.vehicles(); }

  getById(id: number) {
    return this.vehicles().find(v => v.id === id);
  }

  save(vehicle: Vehicle) {
    const obs = vehicle.id
      ? this.http.put<Vehicle>(`${API_URL}/vehicles/${vehicle.id}`, vehicle)
      : this.http.post<Vehicle>(`${API_URL}/vehicles`, vehicle);
    obs.subscribe(() => this.refresh());
    return obs;
  }

  delete(id: number) {
    this.http.delete(`${API_URL}/vehicles/${id}`).subscribe(() => this.refresh());
  }
}
