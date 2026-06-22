import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Client } from '../models';
import { API_URL } from './api.service';

@Injectable({ providedIn: 'root' })
export class ClientService {
  private http = inject(HttpClient);
  clients = signal<Client[]>([]);

  constructor() { this.refresh(); }

  refresh() {
    this.http.get<Client[]>(`${API_URL}/clients`).subscribe(data => this.clients.set(data));
  }

  getAll() { return this.clients(); }

  getById(id: number) {
    return this.clients().find(c => c.id === id);
  }

  save(client: Client) {
    const obs = client.id
      ? this.http.put<Client>(`${API_URL}/clients/${client.id}`, client)
      : this.http.post<Client>(`${API_URL}/clients`, client);
    obs.subscribe(() => this.refresh());
    return obs;
  }

  delete(id: number) {
    this.http.delete(`${API_URL}/clients/${id}`).subscribe(() => this.refresh());
  }
}
