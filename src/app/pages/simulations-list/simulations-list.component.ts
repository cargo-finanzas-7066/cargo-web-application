import { DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CustomerService } from '../../customers/services/api/customer.service';
import { FinancialInstitutionService } from '../../financial-institutions/services/api/financial-institution.service';
import { FinancialProductService } from '../../financial-products/services/api/financial-product.service';
import { PageContainerComponent } from '../../shared/components/page-container/page-container.component';
import { SimulationService } from '../../simulations/services/api/simulation.service';

@Component({
  selector: 'app-simulations-list',
  standalone: true,
  imports: [FormsModule, RouterLink, DecimalPipe, PageContainerComponent],
  template: `
    <app-page-container>
    <section class="simulations-page">
      <div class="page-header">
        <div><h1>Simulaciones guardadas</h1></div>
        <a routerLink="/simulation/new" class="primary-action">
          <span>+</span>
          Nueva simulación
        </a>
      </div>

      <section class="filters-card">
        <label class="search-field">
          <span>Buscar por cliente o código de simulación ⓘ</span>
          <input [(ngModel)]="query" placeholder="Nombre o Código..." />
        </label>
        <label>
          <span>Entidad financiera ⓘ</span>
          <select [(ngModel)]="institutionFilter">
            <option value="">Todas</option>
            @for (institution of institutionSvc.institutions(); track institution.id) {
              <option [value]="institution.id">{{ institution.shortName || institution.name }}</option>
            }
          </select>
        </label>
        <button type="button" class="filter-btn" (click)="simSvc.refresh()">
          <svg viewBox="0 0 24 24"><path d="M3 5h18l-7 8v5l-4 2v-7L3 5Z"/></svg>
          Filtrar
        </button>
      </section>

      <section class="table-card">
        <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Cliente</th>
              <th>Entidad</th>
              <th>Capital<br />financiado</th>
              <th>TEA</th>
              <th>TCEA</th>
              <th>Cuota<br />mensual</th>
              <th>Plazo</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            @for (simulation of filtered(); track simulation.id) {
              <tr>
                <td class="code">{{ simulation.code }}</td>
                <td class="client">{{ clientName(simulation.clientId) }}</td>
                <td>{{ institutionName(simulation.financialProductId) }}</td>
                <td>{{ simulation.currency }} {{ simulation.financedAmount | number:'1.2-2' }}</td>
                <td>{{ simulation.teaPercent | number:'1.2-2' }}%</td>
                <td class="tcea">{{ simulation.tceaPercent | number:'1.2-2' }}%</td>
                <td>{{ simulation.currency }} {{ simulation.monthlyPayment | number:'1.2-2' }}</td>
                <td class="grace">{{ simulation.termMonths }} meses</td>
                <td class="actions">
                  <a [routerLink]="['/results', simulation.id]" title="Ver detalle">
                    <svg viewBox="0 0 24 24"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z"/><circle cx="12" cy="12" r="2.7"/></svg>
                  </a>
                  <button type="button" title="Eliminar" (click)="deleteSimulation(simulation.id)">
                    <svg viewBox="0 0 24 24"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="m19 6-1 14H6L5 6"/></svg>
                  </button>
                </td>
              </tr>
            }
          </tbody>
        </table>
        </div>
        <footer>
          <span>Mostrando 1-{{ filtered().length }} de {{ simSvc.simulations().length }} simulaciones</span>
        </footer>
      </section>
    </section>
    </app-page-container>
  `,
  styles: [`
    .primary-action { display:inline-flex; align-items:center; gap:8px; height:38px; padding:0 20px; border-radius:7px; background:#0036a3; color:#fff; font-weight:900; box-shadow:0 6px 14px rgba(0,54,163,.16); }
    .primary-action span { font-size:20px; line-height:1; }
    .filters-card { display:grid; grid-template-columns:1fr 270px 190px; gap:24px; align-items:end; padding:26px; margin-bottom:32px; background:#fff; border:1px solid #d9e1ee; border-radius:8px; }
    label span { display:block; margin-bottom:8px; color:#6b7280; font-size:11px; font-weight:900; text-transform:uppercase; letter-spacing:.08em; }
    input, select { width:100%; height:42px; border:1px solid #d9e1ee; border-radius:4px; background:#f8fafc; color:#334155; padding:0 14px; }
    .filter-btn { width:116px; height:42px; display:inline-flex; align-items:center; justify-content:center; gap:8px; border:0; border-radius:4px; background:#0036a3; color:#fff; font-weight:900; cursor:pointer; }
    .filter-btn svg, .actions svg { width:18px; height:18px; fill:none; stroke:currentColor; stroke-width:2; stroke-linecap:round; stroke-linejoin:round; }
    .table-card { overflow:hidden; background:#fff; border:1px solid #d9e1ee; border-radius:8px; box-shadow:0 1px 2px rgba(15,23,42,.03); }
    .table-scroll { overflow-x:auto; }
    table { width:100%; min-width:900px; border-collapse:collapse; }
    th { padding:20px 18px; background:#f8fafc; color:#6b7280; font-size:11px; font-weight:900; letter-spacing:.08em; text-align:left; text-transform:uppercase; white-space:nowrap; }
    td { padding:19px 18px; border-top:1px solid #edf1f6; color:#475569; vertical-align:middle; white-space:nowrap; }
    tr:hover td { background:#fff; }
    .code { color:#003b9d; font-weight:900; }
    .client { color:#111827; font-weight:900; line-height:1.15; }
    .tcea { color:#087a3d; font-weight:900; }
    .grace { color:#64748b; font-size:12px; line-height:1.25; }
    .actions { display:flex; gap:14px; }
    .actions a, .actions button { color:#8aa0bf; display:inline-flex; border:0; background:transparent; cursor:pointer; padding:0; }
    footer { display:flex; justify-content:space-between; align-items:center; padding:18px 24px; border-top:1px solid #edf1f6; color:#64748b; font-size:12px; }
    @media (max-width: 900px) {
      .page-header, footer { flex-direction:column; gap:16px; align-items:flex-start; }
      .filters-card { grid-template-columns:1fr; }
    }
  `],
})
export class SimulationsListComponent {
  simSvc = inject(SimulationService);
  clientSvc = inject(CustomerService);
  productSvc = inject(FinancialProductService);
  institutionSvc = inject(FinancialInstitutionService);
  query = '';
  institutionFilter = '';

  filtered() {
    const query = this.query.trim().toLowerCase();
    return this.simSvc.simulations().filter((simulation) => {
      const matchesQuery = !query
        || simulation.code.toLowerCase().includes(query)
        || this.clientName(simulation.clientId).toLowerCase().includes(query);
      const matchesInstitution = !this.institutionFilter
        || String(this.productSvc.getById(simulation.financialProductId)?.financialInstitutionId ?? '') === this.institutionFilter;
      return matchesQuery && matchesInstitution;
    });
  }

  clientName(id: number) {
    const client = this.clientSvc.getById(id);
    return client ? `${client.names} ${client.surnames}` : '—';
  }

  institutionName(financialProductId: number) {
    const product = this.productSvc.getById(financialProductId);
    if (!product) return '—';
    const institution = this.institutionSvc.getById(product.financialInstitutionId);
    return institution?.shortName || institution?.name || '—';
  }

  deleteSimulation(id: number) {
    this.simSvc.delete(id).subscribe();
  }
}
