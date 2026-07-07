import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PageContainerComponent } from '../../../../shared/components/page-container/page-container.component';
import { FinancialInstitutionDto } from '../../../models/dtos/financial-institution.dto';
import { FinancialInstitutionService } from '../../../services/api/financial-institution.service';

type JsonItem = Record<string, any>;

@Component({
  selector: 'app-financial-institutions',
  standalone: true,
  imports: [FormsModule, RouterLink, PageContainerComponent],
  template: `
    <app-page-container>
      <section class="institutions-page">
        <div class="page-header">
          <div><h1>Entidades financieras y costos <small class="mode-badge">Modo lectura</small></h1></div>
        </div>

        <div class="notice">
          <span class="notice-icon">i</span>
          <p>Las condiciones mostradas han sido recopiladas de fuentes públicas de entidades financieras. Las condiciones finales pueden variar según evaluación crediticia, campañas vigentes y políticas internas de cada entidad.</p>
        </div>

        <section class="filters">
          <label class="search-field">
            <span>Buscar entidad</span>
            <div>
              <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
              <input [(ngModel)]="query" placeholder="Buscar banco o entidad...">
            </div>
          </label>
          <label>
            <span>Plazo máximo</span>
            <select [(ngModel)]="termFilter">
              <option value="">Cualquiera</option>
              <option value="36">Hasta 36 meses</option>
              <option value="60">Hasta 60 meses</option>
              <option value="72">Hasta 72 meses</option>
            </select>
          </label>
        </section>

        <section class="matrix-card">
          <div class="table-scroll">
            <table>
              <thead>
              <tr>
                <th>Entidad</th>
                <th>TEA<br>publicada <small>ⓘ</small></th>
                <th>Inicial<br>mín. <small>ⓘ</small></th>
                <th>Financ.<br>máx. <small>ⓘ</small></th>
                <th>Plazo</th>
                <th>Gracia <small>ⓘ</small></th>
                <th>Seguros <small>ⓘ</small></th>
              </tr>
              </thead>
              <tbody>
                @for (institution of pagedInstitutions(); track institution.id) {
                  <tr (click)="openDetail(institution)" tabindex="0" (keyup.enter)="openDetail(institution)">
                    <td class="entity-cell">
                      <span class="bank-logo" [class]="logoClass(institution)">{{ clean(institution.logoText) }}</span>
                      <strong>{{ clean(institution.shortName) }}</strong>
                    </td>
                    <td><strong class="blue">{{ clean(displayTea(institution)) }}</strong></td>
                    <td>{{ clean(displayInitial(institution)) }}</td>
                    <td>{{ clean(displayFinancing(institution)) }}</td>
                    <td>{{ clean(displayTerm(institution)) }}</td>
                    <td>{{ clean(displayGrace(institution)) }}</td>
                    <td>{{ clean(displayInsurance(institution)) }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
          <footer class="table-footer">
            <span>Mostrando 1 a {{ pagedInstitutions().length }} de {{ filteredInstitutions().length }} entidades</span>
            <div class="pagination">
              <button type="button">‹</button>
              <button type="button" class="active">1</button>
              <button type="button">2</button>
              <button type="button">3</button>
              <span>...</span>
              <button type="button">›</button>
            </div>
          </footer>
        </section>

        @if (selected()) {
          <div class="drawer-layer">
            <div class="drawer-scrim" (click)="closeDetail()"></div>
            <aside class="detail-drawer">
              <header>
                <span class="drawer-logo">{{ clean(selected()!.logoText) }}</span>
                <div>
                  <h2>{{ clean(selected()!.name) }}</h2>
                  <p>Condiciones publicadas para crédito vehicular</p>
                </div>
                <button class="close-button" type="button" (click)="closeDetail()" aria-label="Cerrar detalle">×</button>
              </header>

              <div class="drawer-content">
                <section class="detail-section">
                  <h3>Resumen general</h3>
                  <div class="summary-grid">
                    <div><span>Entidad</span><strong>{{ clean(selected()!.shortName) }}</strong></div>
                    <div><span>Tipo</span><strong>{{ clean(selected()!.type) }}</strong></div>
                    <div><span>Moneda</span><strong>Soles (PEN)</strong></div>
                    <div><span>Crédito</span><strong>Vehicular</strong></div>
                  </div>
                </section>

                <section class="detail-section">
                  <h3>Condiciones base</h3>
                  <div class="condition-grid">
                    <article><span>Inicial mín.</span><strong>{{ clean(percentOrLabel(selected()!.minDownPayment, selected()!.minimumInitialLabel)) }}</strong><small>ⓘ</small></article>
                    <article><span>Financ. máx.</span><strong>{{ clean(percentOrLabel(selected()!.maxFinancing, selected()!.maximumFinancingLabel)) }}</strong><small>ⓘ</small></article>
                    <article><span>Plazo</span><strong>{{ clean(displayTerm(selected()!)) }}</strong><small>ⓘ</small></article>
                    <article><span>Gracia</span><strong>{{ clean(displayGrace(selected()!)) }}</strong><small>ⓘ</small></article>
                  </div>
                </section>

                <section class="detail-section">
                  <h3>TEA por rango de capital</h3>
                  <div class="rates-table">
                    <div class="rates-head"><span>Rango de capital</span><span>TEA</span></div>
                    @for (rate of rateRows(selected()!); track rate.label) {
                      <div><span>{{ rate.label }}</span><strong>{{ clean(rate.value) }}</strong></div>
                    }
                  </div>
                </section>

                <section class="detail-section">
                  <h3>Seguros y cargos referenciales</h3>
                  @for (item of insuranceAndChargeRows(selected()!); track item.label) {
                    <div class="charge-row">
                      <span>{{ clean(item.label) }} <small>ⓘ</small></span>
                      <strong>{{ clean(item.value) }}</strong>
                    </div>
                  }
                </section>

                <section class="source-card">
                  <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/></svg>
                  <div>
                    <p><strong>Fuente:</strong> {{ clean(selected()!.sourceName) }}</p>
                    <p><strong>Fecha:</strong> {{ selected()!.sourceDate }}</p>
                    <p><strong>Vigencia:</strong> Según publicación vigente</p>
                  </div>
                </section>
              </div>

              <footer>
                <button type="button" class="secondary-action" (click)="closeDetail()">Cerrar</button>
                <a class="primary-action" [routerLink]="['/simulation/new']" [queryParams]="{ entityId: selected()!.id }">Usar en simulación</a>
              </footer>
            </aside>
          </div>
        }
      </section>
    </app-page-container>
  `,
  styles: [`
    .mode-badge { display: inline-block; margin-left: 10px; padding: 3px 7px; border-radius: 3px; background: #e9efff; color: #0036ad; font-size: 9px; font-weight: 900; text-transform: uppercase; letter-spacing: .08em; vertical-align: middle; }
    .notice { display: flex; gap: 18px; align-items: flex-start; padding: 18px 20px; border: 1px solid #cfe2ff; border-radius: 8px; background: #eef6ff; color: #003b9d; line-height: 1.55; margin-bottom: 26px; }
    .notice-icon { display: grid; place-items: center; width: 20px; height: 20px; border: 2px solid #0a50c8; border-radius: 50%; font-weight: 900; flex: 0 0 auto; }
    .filters { display: grid; grid-template-columns: 1fr 300px; gap: 28px; padding: 20px 24px; border: 1px solid #d7deea; border-radius: 8px; background: #fff; margin-bottom: 28px; }
    label span { display: block; color: #64748b; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: .08em; margin-bottom: 8px; }
    .search-field div { position: relative; }
    .search-field svg { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #8aa0bf; }
    input, select { width: 100%; height: 42px; border: 1px solid #d7deea; border-radius: 4px; background: #f8fafc; color: #172033; padding: 0 14px; font-size: 15px; }
    input { padding-left: 44px; }
    .matrix-card { overflow: hidden; border: 1px solid #d7deea; border-radius: 8px; background: #fff; }
    .table-scroll { overflow-x: auto; }
    table { width: 100%; min-width: 860px; border-collapse: collapse; }
    th { padding: 16px 18px; background: #101827; color: #d7deea; text-align: center; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: .08em; white-space: nowrap; }
    th:first-child, td:first-child { text-align: left; }
    td { padding: 18px; border-top: 1px solid #edf1f6; color: #475569; text-align: center; font-size: 15px; white-space: nowrap; }
    tbody tr { cursor: pointer; }
    tbody tr:hover td { background: #f8fbff; }
    tbody tr:focus-visible td { background: #eef4ff; }
    .entity-cell { display: grid; grid-template-columns: 26px 1fr; align-items: center; gap: 12px; }
    .bank-logo { display: grid; place-items: center; width: 26px; height: 26px; border-radius: 50%; background: #eef5ff; color: #1e48b8; font-size: 9px; font-weight: 900; }
    .bank-logo.bbva { background: #1d4aa4; color: #fff; }
    .bank-logo.interbank { background: #16a34a; color: #fff; }
    .bank-logo.scotiabank, .bank-logo.santander { background: #dc2626; color: #fff; }
    .bank-logo.banbif { background: #f97316; color: #fff; }
    .entity-cell strong { color: #111827; font-size: 16px; line-height: 1.15; }
    .blue { color: #003b9d; font-size: 16px; line-height: 1.2; }
    svg { width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
    .table-footer { display: flex; justify-content: space-between; align-items: center; padding: 18px 26px; border-top: 1px solid #edf1f6; color: #64748b; font-size: 14px; }
    .pagination { display: flex; align-items: center; gap: 14px; }
    .pagination button { min-width: 32px; height: 32px; border: 0; border-radius: 4px; background: transparent; color: #64748b; font-weight: 700; }
    .pagination .active { background: #0036ad; color: #fff; }
    .drawer-layer { position: fixed; inset: 0; z-index: 30; }
    .drawer-scrim { position: absolute; inset: 0; background: rgba(15,23,42,.58); backdrop-filter: blur(2px); }
    .detail-drawer { position: absolute; top: 0; right: 0; width: min(520px, 100vw); height: 100%; background: #fff; display: flex; flex-direction: column; box-shadow: -18px 0 38px rgba(15,23,42,.32); }
    .detail-drawer header { display: flex; align-items: center; gap: 16px; padding: 26px 24px; border-bottom: 1px solid #edf1f6; }
    .drawer-logo { display: grid; place-items: center; width: 58px; height: 58px; border-radius: 8px; border: 1px solid #d9e9ff; background: #eef5ff; color: #1e48b8; font-size: 18px; font-weight: 900; flex: 0 0 auto; }
    .detail-drawer h2 { color: #111827; font-size: 23px; font-weight: 500; margin-bottom: 4px; }
    .detail-drawer header p { color: #64748b; font-size: 13px; }
    .close-button { margin-left: auto; border: 0; background: transparent; color: #8aa0bf; font-size: 30px; cursor: pointer; }
    .drawer-content { overflow-y: auto; padding: 24px; }
    .detail-section { margin-bottom: 28px; }
    .detail-section h3 { position: relative; padding-left: 18px; color: #7b8191; font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: .14em; margin-bottom: 18px; }
    .detail-section h3::before { content: ''; position: absolute; left: 0; top: -2px; width: 6px; height: 24px; border-radius: 4px; background: #0036ad; }
    .summary-grid, .condition-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .summary-grid { padding: 18px; border-radius: 8px; background: #f8fafc; }
    .summary-grid span, .condition-grid span { display: block; color: #6b7280; font-size: 11px; font-weight: 900; text-transform: uppercase; margin-bottom: 6px; }
    .summary-grid strong, .condition-grid strong { color: #111827; font-size: 18px; }
    .condition-grid article { position: relative; padding: 18px; border: 1px solid #d7deea; border-radius: 8px; min-height: 76px; }
    .condition-grid small { position: absolute; top: 16px; right: 16px; color: #8aa0bf; }
    .rates-table { overflow: hidden; border: 1px solid #d7deea; border-radius: 8px; }
    .rates-table > div { display: grid; grid-template-columns: 1fr 160px; padding: 13px 24px; border-top: 1px solid #edf1f6; }
    .rates-table .rates-head { border-top: 0; background: #f8fafc; color: #6b7280; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: .08em; }
    .rates-table strong, .charge-row strong { color: #0036ad; text-align: right; }
    .charge-row { display: flex; justify-content: space-between; gap: 16px; padding: 16px; border: 1px solid #d7deea; border-radius: 5px; margin-bottom: 9px; }
    .source-card { display: flex; gap: 14px; padding: 18px; border-radius: 8px; background: #f8fafc; color: #64748b; font-size: 13px; line-height: 1.7; margin: 28px 0 112px; }
    .source-card svg { width: 20px; height: 20px; flex: 0 0 auto; }
    .detail-drawer footer { position: sticky; bottom: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 14px; padding: 20px 38px; border-top: 1px solid #edf1f6; background: #fff; }
    .secondary-action, .primary-action { display: grid; place-items: center; height: 44px; border-radius: 4px; font-weight: 900; }
    .secondary-action { border: 1px solid #d7deea; background: #fff; color: #334155; }
    .primary-action { border: 0; background: #0036ad; color: #fff; }
    @media (max-width: 900px) { .filters { grid-template-columns: 1fr; } }
  `],
})
export class FinancialInstitutionsComponent {
  service = inject(FinancialInstitutionService);
  query = '';
  termFilter = '';
  selected = signal<FinancialInstitutionDto | null>(null);

  filteredInstitutions = computed(() => {
    const query = this.query.trim().toLowerCase();
    return this.service.institutions().filter((institution) => {
      const allowed = ['BCP', 'BBVA', 'INTERBANK'].includes(institution.code);
      const text = `${this.clean(institution.name)} ${this.clean(institution.shortName)}`.toLowerCase();
      const maxTerm = institution.maxTerm ?? 999;
      return allowed && (!query || text.includes(query)) && (!this.termFilter || maxTerm <= Number(this.termFilter));
    });
  });

  pagedInstitutions = computed(() => this.filteredInstitutions().slice(0, 8));

  openDetail(institution: FinancialInstitutionDto) {
    this.selected.set(institution);
  }

  closeDetail() {
    this.selected.set(null);
  }

  logoClass(institution: FinancialInstitutionDto) {
    return this.clean(institution.shortName).toLowerCase().replace(/\s+/g, '-');
  }

  displayTea(institution: FinancialInstitutionDto) {
    return institution.teaPublishedLabel || `${institution.tea?.toFixed(2)}%`;
  }

  displayInitial(institution: FinancialInstitutionDto) {
    return this.percentOrLabel(institution.minDownPayment, institution.minimumInitialLabel);
  }

  displayFinancing(institution: FinancialInstitutionDto) {
    return this.percentOrLabel(institution.maxFinancing, institution.maximumFinancingLabel);
  }

  displayTerm(institution: FinancialInstitutionDto) {
    if (institution.minTerm && institution.maxTerm) return `${institution.minTerm} a ${institution.maxTerm} meses`;
    return institution.termLabel || 'Según evaluación';
  }

  displayGrace(institution: FinancialInstitutionDto) {
    return institution.graceLabel || 'Sin gracia';
  }

  displayInsurance(institution: FinancialInstitutionDto) {
    const value = institution.insuranceSummaryLabel || 'Desgrav. / Vehicular';
    return value.replace('Desgravamen', 'Desgrav.');
  }

  percentOrLabel(value: number | undefined, label: string) {
    if (value === undefined || value === null) return label;
    return value % 1 === 0 ? `${value.toFixed(0)}%` : `${value.toFixed(2)}%`;
  }

  rateRows(institution: FinancialInstitutionDto) {
    const rates = this.parseJson(institution.ratesJson);
    if (!rates.length) return [{ label: 'Rango referencial', value: institution.teaPublishedLabel }];
    return rates.slice(0, 4).map((rate, index) => ({ label: this.capitalLabel(index), value: this.rateValue(rate) }));
  }

  insuranceAndChargeRows(institution: FinancialInstitutionDto) {
    const insurances = this.parseJson(institution.insurancesJson).slice(0, 2).map((item) => ({
      label: item['label'],
      value: item['displayValue'],
    }));
    const charges = this.parseJson(institution.chargesJson)
      .filter((item) => item['type'] !== 'PORTES' || item['applies'] !== false)
      .slice(0, 2)
      .map((item) => ({ label: item['label'], value: item['displayValue'] }));
    return [...insurances, ...charges].slice(0, 4);
  }

  clean(value: string | undefined | null) {
    return (value ?? '')
      .replaceAll('Ã©', 'é')
      .replaceAll('Ãº', 'ú')
      .replaceAll('Ã³', 'ó')
      .replaceAll('Ã­', 'í')
      .replaceAll('Ã¡', 'á')
      .replaceAll('Ã±', 'ñ')
      .replaceAll('PerÃº', 'Perú')
      .replaceAll('CrÃ©dito', 'Crédito')
      .replaceAll('SegÃºn', 'Según')
      .replaceAll('mÃ¡x', 'máx')
      .replaceAll('fÃ­sico', 'físico');
  }

  private parseJson(value: string): JsonItem[] {
    try {
      const parsed = JSON.parse(value || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private rateValue(rate: JsonItem) {
    if (rate['fixedPercent'] !== undefined && rate['fixedPercent'] !== null) return `${rate['fixedPercent'].toFixed(2)}%`;
    const min = rate['minPercent'] ?? rate['tceaMinReferencePercent'];
    const max = rate['maxPercent'] ?? rate['tceaMaxPercent'];
    if (min !== undefined && max !== undefined && min !== null && max !== null) return `${min.toFixed(2)}% - ${max.toFixed(2)}%`;
    if (max !== undefined && max !== null) return `Hasta ${max.toFixed(2)}%`;
    if (min !== undefined && min !== null) return `Desde ${min.toFixed(2)}%`;
    return 'No publicado';
  }

  private capitalLabel(index: number) {
    return [
      'S/ 10,000.00 a S/ 49,999.99',
      'S/ 50,000.00 a S/ 99,999.99',
      'S/ 100,000.00 a S/ 150,000.00',
      'Más de S/ 150,000.00',
    ][index] ?? 'Rango referencial';
  }
}
