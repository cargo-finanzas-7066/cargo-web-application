import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../../../services/api.service';
import { CustomerDto } from '../../models/dtos/customer.dto';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private http = inject(HttpClient);
  customers = signal<CustomerDto[]>([]);

  constructor() {
    this.refresh();
  }

  refresh() {
    this.http.get<CustomerDto[]>(`${API_URL}/clients`).subscribe((customers) => this.customers.set(customers));
  }

  save(customer: CustomerDto) {
    const request = customer.id
      ? this.http.put<CustomerDto>(`${API_URL}/clients/${customer.id}`, customer)
      : this.http.post<CustomerDto>(`${API_URL}/clients`, customer);

    request.subscribe(() => this.refresh());
    return request;
  }

  delete(id: number) {
    return this.http.delete<void>(`${API_URL}/clients/${id}`);
  }
}
