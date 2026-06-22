import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Simulation, SimulationResult } from '../models';
import { API_URL } from './api.service';

@Injectable({ providedIn: 'root' })
export class SimulationService {
  private http = inject(HttpClient);
  simulations = signal<Simulation[]>([]);

  constructor() { this.refresh(); }

  refresh() {
    this.http.get<Simulation[]>(`${API_URL}/simulations`).subscribe(data => this.simulations.set(data));
  }

  getAll() { return this.simulations(); }

  getById(id: number) {
    return this.simulations().find(s => s.id === id);
  }

  save(sim: Simulation) {
    const obs = sim.id
      ? this.http.put<Simulation>(`${API_URL}/simulations/${sim.id}`, sim)
      : this.http.post<Simulation>(`${API_URL}/simulations`, sim);
    obs.subscribe(() => this.refresh());
    return obs;
  }

  calculate(id: number) {
    return this.http.post<SimulationResult>(`${API_URL}/simulations/${id}/calculate`, {});
  }

  delete(id: number) {
    this.http.delete(`${API_URL}/simulations/${id}`).subscribe(() => this.refresh());
  }
}
