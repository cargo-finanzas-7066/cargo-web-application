import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import { API_URL } from '../../../services/api.service';
import { PageDto } from '../../../shared/models/dtos/page.dto';
import { FinancialProductDto } from '../../models/dtos/financial-product.dto';

const PRODUCT_PAGE_SIZE = 100;

@Injectable({ providedIn: 'root' })
export class FinancialProductService {
  private http = inject(HttpClient);
  products = signal<FinancialProductDto[]>([]);

  constructor() {
    this.refresh();
  }

  refresh() {
    const params = new HttpParams().set('page', 0).set('size', PRODUCT_PAGE_SIZE);
    this.http.get<PageDto<FinancialProductDto>>(`${API_URL}/financial-products`, { params })
      .pipe(map((page) => page.content))
      .subscribe((products) => this.products.set(products));
  }

  getById(id: number) {
    return this.products().find((product) => product.id === id);
  }

  byInstitution(institutionId: number) {
    return this.products().filter((product) => product.financialInstitutionId === institutionId);
  }
}
