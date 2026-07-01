import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, tap } from 'rxjs';
import { API_URL } from '../../../services/api.service';
import { PageDto } from '../../../shared/models/dtos/page.dto';
import { VehicleDto } from '../../models/dtos/vehicle.dto';

const CATALOG_PAGE_SIZE = 100;

@Injectable({ providedIn: 'root' })
export class VehicleCatalogService {
  private http = inject(HttpClient);
  vehicles = signal<VehicleDto[]>([]);

  constructor() {
    this.refresh();
  }

  refresh() {
    this.getAll().subscribe((vehicles) => this.vehicles.set(vehicles));
  }

  getAll() {
    const params = new HttpParams().set('page', 0).set('size', CATALOG_PAGE_SIZE);
    return this.http.get<PageDto<VehicleDto>>(`${API_URL}/vehicles/catalog`, { params })
      .pipe(map((page) => page.content));
  }

  getById(id: number) {
    return this.vehicles().find((vehicle) => vehicle.id === id);
  }

  save(vehicle: VehicleDto) {
    const request = vehicle.id
      ? this.http.put<VehicleDto>(`${API_URL}/vehicles/${vehicle.id}`, vehicle)
      : this.http.post<VehicleDto>(`${API_URL}/vehicles`, vehicle);
    return request.pipe(tap(() => this.refresh()));
  }

  delete(id: number) {
    return this.http.delete<void>(`${API_URL}/vehicles/${id}`).pipe(tap(() => this.refresh()));
  }
}
