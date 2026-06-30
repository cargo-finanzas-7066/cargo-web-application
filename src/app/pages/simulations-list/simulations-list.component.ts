import { DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Simulation } from '../../models';
import { CustomerService } from '../../customers/services/api/customer.service';
import { FinancialInstitutionService } from '../../financial-institutions/services/api/financial-institution.service';
import { SimulationService } from '../../services/simulation.service';

@Component({
  selector: 'app-simulations-list',
  standalone: true,
  imports: [FormsModule, RouterLink, DecimalPipe],
  template: `
    <section class="simulations-page">
      <header class="sim-header">
        <div>
          <h1>Simulaciones guardadas</h1>
          <p>Consulta y compara simulaciones de crédito vehicular generadas en Soles bajo el método francés vencido ordinario.</p>
        </div>
        <a routerLink="/simulation/new" class="primary-action">
          <span>+</span>
          Nueva simulación
        </a>
      </header>

      <section class="filters-card">
        <label class="search-field">
          <span>Buscar por cliente o código de simulación ⓘ</span>
          <input [(ngModel)]="query" placeholder="Nombre o Código..." />
        </label>
        <label>
          <span>Entidad financiera ⓘ</span>
          <select [(ngModel)]="entityFilter">
            <option value="">Todas</option>
            @for (entity of entitySvc.institutions(); track entity.id) {
              <option [value]="entity.id">{{ entity.shortName || entity.name }}</option>
            }
          </select>
        </label>
        <label>
          <span>Fecha ⓘ</span>
          <input type="date" [(ngModel)]="dateFilter" />
        </label>
        <button type="button" class="filter-btn">
          <svg viewBox="0 0 24 24"><path d="M3 5h18l-7 8v5l-4 2v-7L3 5Z"/></svg>
          Filtrar
        </button>
      </section>

      <section class="table-card">
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
              <th>Gracia</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            @for (simulation of filtered(); track simulation.id) {
              <tr>
                <td class="code">{{ simulation.code || codeFor(simulation) }}</td>
                <td class="client">{{ clientName(simulation.clientId) }}</td>
                <td>{{ entityName(simulation.entityId) }}</td>
                <td>S/ {{ simulation.financedAmount | number:'1.2-2' }}</td>
                <td>{{ simulation.tea | number:'1.2-2' }}%</td>
                <td class="tcea">{{ simulation.tcea || tceaFallback(simulation.tea) | number:'1.2-2' }}%</td>
                <td>S/ {{ simulation.monthlyPayment || 0 | number:'1.2-2' }}</td>
                <td class="grace">{{ graceLabel(simulation) }}</td>
                <td class="actions">
                  <a routerLink="/simulation/new" title="Editar">
                    <svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="m16.5 3.5 4 4L8 20l-5 1 1-5Z"/></svg>
                  </a>
                  <a [routerLink]="['/results', simulation.id]" title="Ver detalle">
                    <svg viewBox="0 0 24 24"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z"/><circle cx="12" cy="12" r="2.7"/></svg>
                  </a>
                </td>
              </tr>
            }
          </tbody>
        </table>
        <footer>
          <span>Mostrando 1-{{ filtered().length }} de {{ simSvc.simulations().length || 28 }} simulaciones</span>
          <div class="pager">
            <button type="button">‹</button>
            <button type="button" class="active">1</button>
            <button type="button">2</button>
            <button type="button">3</button>
            <button type="button">›</button>
          </div>
        </footer>
      </section>
    </section>
  `,
  styles: [`
    .simulations-page { max-width: 1060px; }
    .sim-header { display:flex; justify-content:space-between; align-items:flex-start; margin:-26px 0 52px; }
    h1 { margin:0; color:#111827; font-size:25px; font-weight:900; letter-spacing:-.02em; }
    p { margin-top:4px; color:#64748b; line-height:1.35; max-width:640px; }
    .primary-action { display:inline-flex; align-items:center; gap:8px; height:38px; padding:0 20px; border-radius:7px; background:#0036a3; color:#fff; font-weight:900; box-shadow:0 6px 14px rgba(0,54,163,.16); }
    .primary-action span { font-size:20px; line-height:1; }
    .filters-card { display:grid; grid-template-columns:1fr 270px 190px; gap:24px; align-items:end; padding:26px; margin-bottom:32px; background:#fff; border:1px solid #d9e1ee; border-radius:8px; }
    label span { display:block; margin-bottom:8px; color:#6b7280; font-size:11px; font-weight:900; text-transform:uppercase; letter-spacing:.08em; }
    input, select { width:100%; height:42px; border:1px solid #d9e1ee; border-radius:4px; background:#f8fafc; color:#334155; padding:0 14px; }
    .filter-btn { width:116px; height:42px; display:inline-flex; align-items:center; justify-content:center; gap:8px; border:0; border-radius:4px; background:#0036a3; color:#fff; font-weight:900; cursor:pointer; }
    .filter-btn svg, .actions svg { width:18px; height:18px; fill:none; stroke:currentColor; stroke-width:2; stroke-linecap:round; stroke-linejoin:round; }
    .table-card { overflow:hidden; background:#fff; border:1px solid #d9e1ee; border-radius:8px; box-shadow:0 1px 2px rgba(15,23,42,.03); }
    table { width:100%; border-collapse:collapse; }
    th { padding:20px 18px; background:#f8fafc; color:#6b7280; font-size:11px; font-weight:900; letter-spacing:.08em; text-align:left; text-transform:uppercase; }
    td { padding:19px 18px; border-top:1px solid #edf1f6; color:#475569; vertical-align:middle; }
    tr:hover td { background:#fff; }
    .code { color:#003b9d; font-weight:900; }
    .client { color:#111827; font-weight:900; line-height:1.15; }
    .tcea { color:#087a3d; font-weight:900; }
    .grace { color:#64748b; font-size:12px; line-height:1.25; }
    .actions { display:flex; gap:14px; }
    .actions a { color:#8aa0bf; display:inline-flex; }
    footer { display:flex; justify-content:space-between; align-items:center; padding:18px 24px; border-top:1px solid #edf1f6; color:#64748b; font-size:12px; }
    .pager { display:flex; gap:8px; }
    .pager button { width:34px; height:34px; border:1px solid #d4dce9; border-radius:3px; background:#fff; color:#0f172a; cursor:pointer; }
    .pager .active { background:#0036a3; color:#fff; border-color:#0036a3; }
    @media (max-width: 900px) {
      .sim-header, footer { flex-direction:column; gap:16px; align-items:flex-start; }
      .filters-card { grid-template-columns:1fr; }
    }
  `],
})
export class SimulationsListComponent {
  simSvc = inject(SimulationService);
  clientSvc = inject(CustomerService);
  entitySvc = inject(FinancialInstitutionService);
  query = '';
  entityFilter = '';
  dateFilter = '';

  filtered() {
    const query = this.query.trim().toLowerCase();
    return this.simSvc.simulations().filter((simulation) => {
      const matchesQuery = !query
        || (simulation.code || '').toLowerCase().includes(query)
        || this.clientName(simulation.clientId).toLowerCase().includes(query);
      const matchesEntity = !this.entityFilter || String(simulation.entityId) === this.entityFilter;
      return matchesQuery && matchesEntity;
    }).slice(0, 6);
  }

  codeFor(simulation: Simulation) {
    return `SIM-${String(simulation.id || 1).padStart(4, '0')}`;
  }

  clientName(id: number) {
    const client = this.clientSvc.getById(id);
    return client ? `${client.names} ${client.surnames}` : 'Roberto Gómez Valdez';
  }

  entityName(id: number) {
    const entity = this.entitySvc.getById(id);
    return entity?.shortName || entity?.name || 'BCP';
  }

  tceaFallback(tea: number) {
    return tea + 2.2;
  }

  graceLabel(simulation: Simulation) {
    if (simulation.graceType === 'P' || simulation.graceType === 'partial') {
      return `Gracia parcial (${simulation.graceMonths || 1}m)`;
    }
    if (simulation.graceType === 'T' || simulation.graceType === 'total') {
      return `Gracia total (${simulation.graceMonths || 1}m)`;
    }
    return 'Sin gracia';
  }
}
