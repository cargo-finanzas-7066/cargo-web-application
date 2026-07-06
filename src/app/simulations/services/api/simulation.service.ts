import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, tap } from 'rxjs';
import { API_URL } from '../../../services/api.service';
import { PageDto } from '../../../shared/models/dtos/page.dto';
import { SimulationDto } from '../../models/dtos/simulation.dto';
import { SimulationRequestDto } from '../../models/dtos/simulation-request.dto';

const SIMULATION_PAGE_SIZE = 100;

@Injectable({ providedIn: 'root' })
export class SimulationService {
  private http = inject(HttpClient);
  simulations = signal<SimulationDto[]>([]);

  constructor() {
    this.refresh();
  }

  refresh() {
    const params = new HttpParams().set('page', 0).set('size', SIMULATION_PAGE_SIZE);
    this.http.get<PageDto<SimulationDto>>(`${API_URL}/simulations`, { params })
      .pipe(map((page) => page.content))
      .subscribe((simulations) => this.simulations.set(simulations));
  }

  getById(id: number) {
    return this.simulations().find((simulation) => simulation.id === id);
  }

  getByIdRemote(id: number) {
    return this.http.get<SimulationDto>(`${API_URL}/simulations/${id}`);
  }

  create(request: SimulationRequestDto) {
    return this.http.post<SimulationDto>(`${API_URL}/simulations`, request).pipe(tap(() => this.refresh()));
  }

  delete(id: number) {
    return this.http.delete<void>(`${API_URL}/simulations/${id}`).pipe(tap(() => this.refresh()));
  }
}
