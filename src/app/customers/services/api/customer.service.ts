import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import { API_URL } from '../../../services/api.service';
import { PageDto } from '../../../shared/models/dtos/page.dto';
import { CustomerDto } from '../../models/dtos/customer.dto';

const CUSTOMER_PAGE_SIZE = 100;

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private http = inject(HttpClient);
  customers = signal<CustomerDto[]>([]);

  constructor() {
    this.refresh();
  }

  refresh() {
    const params = new HttpParams().set('page', 0).set('size', CUSTOMER_PAGE_SIZE);
    this.http.get<PageDto<CustomerDto>>(`${API_URL}/clients`, { params })
      .pipe(map((page) => page.content))
      .subscribe((customers) => this.customers.set(customers));
  }

  getById(id: number) {
    return this.customers().find((customer) => customer.id === id);
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
