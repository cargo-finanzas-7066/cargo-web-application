import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../../../services/api.service';
import { FinancialInstitutionDto } from '../../models/dtos/financial-institution.dto';

@Injectable({ providedIn: 'root' })
export class FinancialInstitutionService {
  private http = inject(HttpClient);
  institutions = signal<FinancialInstitutionDto[]>([]);

  constructor() {
    this.refresh();
  }

  refresh() {
    this.http.get<FinancialInstitutionDto[]>(`${API_URL}/financial-institutions`).subscribe((institutions) => {
      this.institutions.set(institutions);
    });
  }

  getById(id: number) {
    return this.institutions().find((institution) => institution.id === id);
  }
}
