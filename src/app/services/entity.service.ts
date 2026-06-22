import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FinancialEntity } from '../models';
import { API_URL } from './api.service';

@Injectable({ providedIn: 'root' })
export class EntityService {
  private http = inject(HttpClient);
  entities = signal<FinancialEntity[]>([]);

  constructor() { this.refresh(); }

  refresh() {
    this.http.get<FinancialEntity[]>(`${API_URL}/entities`).subscribe(data => this.entities.set(data));
  }

  getAll() { return this.entities(); }

  getById(id: number) {
    return this.entities().find(e => e.id === id);
  }

  save(entity: FinancialEntity) {
    const obs = entity.id
      ? this.http.put<FinancialEntity>(`${API_URL}/entities/${entity.id}`, entity)
      : this.http.post<FinancialEntity>(`${API_URL}/entities`, entity);
    obs.subscribe(() => this.refresh());
    return obs;
  }

  delete(id: number) {
    this.http.delete(`${API_URL}/entities/${id}`).subscribe(() => this.refresh());
  }
}
