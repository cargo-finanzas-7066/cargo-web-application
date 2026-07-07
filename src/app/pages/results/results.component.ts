import { DecimalPipe, SlicePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomerDto } from '../../customers/models/dtos/customer.dto';
import { CustomerService } from '../../customers/services/api/customer.service';
import { PageContainerComponent } from '../../shared/components/page-container/page-container.component';
import { SimulationDto } from '../../simulations/models/dtos/simulation.dto';
import { SimulationService } from '../../simulations/services/api/simulation.service';
import { VehicleDto } from '../../vehicles/models/dtos/vehicle.dto';
import { VehicleCatalogService } from '../../vehicles/services/api/vehicle-catalog.service';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [DecimalPipe, SlicePipe, PageContainerComponent],
  template: `
    <app-page-container>
    @if (result(); as r) {
      <section class="results-page">
        <div class="crumb">Simulaciones › <strong>Resultado de Simulación {{ r.code || ('#' + simId) }}</strong></div>
        <div class="page-header">
          <div><h1>Resultados de simulación</h1></div>
          <span class="saved">✓ Simulación guardada automáticamente</span>
        </div>

        <section class="metrics">
          <article class="metric featured"><small>Cuota mensual</small><strong><span class="cur">{{ r.currency }}</span>{{ r.monthlyPayment | number:'1.2-2' }}</strong></article>
          <article class="metric featured"><small>Cuota final mensual</small><strong><span class="cur">{{ r.currency }}</span>{{ regularFinalPayment() | number:'1.2-2' }}</strong></article>
          <article class="metric"><small>Capital financiado</small><strong><span class="cur">{{ r.currency }}</span>{{ r.financedAmount | number:'1.2-2' }}</strong></article>
          <article class="metric"><small>TEA ⓘ</small><strong>{{ r.teaPercent | number:'1.2-2' }}%</strong></article>
          <article class="metric"><small>TEM ⓘ</small><strong>{{ r.temPercent | number:'1.2-2' }}%</strong></article>
          <article class="metric"><small>COK anual efectivo ⓘ</small><strong>{{ r.cokTeaPercent | number:'1.2-2' }}%</strong></article>
          <article class="metric"><small>COK mensual ⓘ</small><strong>{{ r.cokTemPercent | number:'1.4-4' }}%</strong></article>
          <article class="metric"><small>TCEA ⓘ</small><strong class="green">{{ r.tceaPercent | number:'1.2-2' }}%</strong></article>
          <article class="metric"><small>VAN ⓘ</small><strong><span class="cur">{{ r.currency }}</span>{{ r.van | number:'1.2-2' }}</strong></article>
          <article class="metric"><small>TIR mensual ⓘ</small><strong>{{ r.tirPercent | number:'1.2-2' }}%</strong></article>
          <article class="metric"><small>Cuota balón ⓘ</small><strong class="blue"><span class="cur">{{ r.currency }}</span>{{ balloonAmount() | number:'1.2-2' }}</strong></article>
          <article class="metric"><small>Interés total</small><strong><span class="cur">{{ r.currency }}</span>{{ r.totalInterest | number:'1.2-2' }}</strong></article>
          <article class="metric total"><small>Total a pagar</small><strong><span class="cur">{{ r.currency }}</span>{{ r.totalPayment | number:'1.2-2' }}</strong></article>
        </section>

        <section class="schedule-card">
          <header>
            <h2>▣ Cronograma de pagos</h2>
            <span>{{ r.currency }}</span>
          </header>
          <div class="schedule-scroll">
            <table>
              <thead>
                <tr>
                  <th>N°</th>
                  <th>F. Pago</th>
                  <th>Saldo capital</th>
                  <th>Cuota</th>
                  <th>Cuota balón</th>
                  <th>Interés</th>
                  <th>Amortización</th>
                  <th>Desgravamen</th>
                  <th>Seguro vehicular</th>
                  <th>Pago total ⓘ</th>
                  <th>Flujo final</th>
                  <th>Flujo base</th>
                  <th>Saldo final ⓘ</th>
                </tr>
              </thead>
              <tbody>
                @for (row of r.schedule; track row.period) {
                  <tr>
                    <td>{{ row.period }}</td>
                    <td>{{ row.date | slice:0:10 }}</td>
                    <td>{{ r.currency }} {{ row.initialBalance | number:'1.2-2' }}</td>
                    <td>{{ r.currency }} {{ row.payment | number:'1.2-2' }}</td>
                    <td>{{ r.currency }} {{ row.balloonPayment | number:'1.2-2' }}</td>
                    <td>{{ r.currency }} {{ row.interest | number:'1.2-2' }}</td>
                    <td>{{ r.currency }} {{ row.amortization | number:'1.2-2' }}</td>
                    <td>{{ r.currency }} {{ row.creditLifeInsurance | number:'1.2-2' }}</td>
                    <td>{{ r.currency }} {{ row.vehicleInsurance | number:'1.2-2' }}</td>
                    <td class="blue">{{ r.currency }} {{ row.totalPayment | number:'1.2-2' }}</td>
                    <td>{{ r.currency }} {{ row.finalFlow | number:'1.2-2' }}</td>
                    <td>{{ r.currency }} {{ row.baseFlow | number:'1.2-2' }}</td>
                    <td>{{ r.currency }} {{ row.finalBalance | number:'1.2-2' }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </section>

        <section class="conditions-card">
          <header><h2>▣ Ficha de Condiciones</h2></header>
          <div class="conditions-grid">
            <dl>
              <dt>Cliente y documento</dt>
              <dd><span>Cliente:</span><strong>{{ clientName() }}</strong></dd>
              <dd><span>Documento:</span><strong>{{ client()?.docType || 'DNI' }} {{ client()?.docNumber || '—' }}</strong></dd>
            </dl>
            <dl>
              <dt>Vehículo</dt>
              <dd><span>Vehículo:</span><strong>{{ vehicleName() }}</strong></dd>
            </dl>
            <dl>
              <dt>Financiamiento</dt>
              <dd><span>Entidad:</span><strong class="badge">{{ institutionName() }}</strong></dd>
              <dd><span>Cap. financiado:</span><strong class="blue">{{ r.currency }} {{ r.financedAmount | number:'1.2-2' }}</strong></dd>
              <dd><span>Cuota balón:</span><strong class="blue">{{ r.currency }} {{ balloonAmount() | number:'1.2-2' }}</strong></dd>
              <dd><span>Moneda:</span><strong>{{ r.currency }}</strong></dd>
            </dl>
            <dl>
              <dt>Plazo y método</dt>
              <dd><span>TEA:</span><strong>{{ r.teaPercent | number:'1.2-2' }}%</strong></dd>
              <dd><span>TEM:</span><strong>{{ r.temPercent | number:'1.2-2' }}%</strong></dd>
              <dd><span>COK:</span><strong>{{ r.cokTeaPercent | number:'1.2-2' }}%</strong></dd>
              <dd><span>COK mensual:</span><strong>{{ r.cokTemPercent | number:'1.4-4' }}%</strong></dd>
              <dd><span>Plazo:</span><strong>{{ r.termMonths }} meses</strong></dd>
              <dd><span>Tipo gracia:</span><strong>{{ graceLabel() }}</strong></dd>
              <dd><span>Método:</span><strong>Francés vencido ordinario</strong></dd>
              <dd><span>Base:</span><strong>30 días</strong></dd>
            </dl>
          </div>
          <footer>Cálculos financieros bajo normativa vigente SBS &nbsp;&nbsp; Ficha generada el {{ today }}</footer>
        </section>
      </section>
    } @else {
      <section class="results-page"><div class="loading">Calculando resultados...</div></section>
    }
    </app-page-container>
  `,
  styles: [`
    .crumb { margin:-18px 0 32px; color:#8aa0bf; font-size:13px; }
    .crumb strong { color:#111827; }
    .saved { align-self:center; padding:5px 10px; border-radius:999px; background:#eaf8ef; color:#087a3d; font-size:11px; font-weight:900; text-transform:uppercase; }
    .metrics { display:grid; grid-template-columns:repeat(auto-fit, minmax(160px, 1fr)); gap:14px; margin-bottom:34px; }
    .metric { min-height:86px; padding:18px; background:#fff; border:1px solid #d9e1ee; border-radius:7px; box-shadow:0 1px 2px rgba(15,23,42,.05); overflow:hidden; }
    .metric small { display:block; min-height:24px; margin-bottom:8px; color:#6b7280; font-size:10px; font-weight:900; line-height:1.2; letter-spacing:.06em; text-transform:uppercase; white-space:normal; overflow:visible; }
    .metric strong { display:block; color:#111827; font-size:19px; line-height:1.25; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .metric strong .cur { margin-right:4px; font-size:11px; font-weight:800; opacity:.6; }
    .metric.featured { background:#0036a3; color:#fff; }
    .metric.featured small, .metric.featured strong, .metric.total small, .metric.total strong { color:#fff; }
    .metric.total { grid-column:span 2; background:#1b263a; }
    .green { color:#087a3d !important; }
    .blue { color:#0036a3 !important; font-weight:900; }
    .schedule-card, .conditions-card { overflow:hidden; border:1px solid #d9e1ee; border-radius:7px; background:#fff; margin-bottom:36px; }
    .schedule-card > header { height:58px; display:flex; align-items:center; justify-content:space-between; padding:0 26px; background:#111827; color:#fff; }
    .schedule-card h2, .conditions-card h2 { margin:0; font-size:18px; font-weight:900; }
    .schedule-card header span { color:#d7deea; font-size:11px; font-weight:900; letter-spacing:.1em; text-transform:uppercase; }
    .schedule-scroll { overflow:auto; }
    table { min-width:1060px; width:100%; border-collapse:collapse; }
    th { padding:12px 10px; background:#182235; color:#fff; font-size:9px; text-align:left; text-transform:uppercase; }
    td { padding:11px 10px; border-top:1px solid #e8edf5; color:#1f2937; font-size:10px; white-space:nowrap; }
    tr:hover td { background:#fff; }
    tfoot td { background:#111827; color:#fff; border-color:#111827; font-weight:900; text-transform:uppercase; }
    tfoot .blue { color:#fff !important; }
    .conditions-card header { padding:18px 24px; border-bottom:1px solid #e8edf5; color:#111827; }
    .conditions-grid { display:grid; grid-template-columns:repeat(4, 1fr); gap:34px; padding:26px 28px 46px; }
    dl { margin:0; }
    dt { margin-bottom:16px; color:#6b7280; font-size:11px; font-weight:900; letter-spacing:.08em; text-transform:uppercase; }
    dd { display:flex; justify-content:space-between; gap:12px; margin:0 0 10px; color:#6b7280; font-size:13px; }
    dd strong { color:#111827; text-align:right; }
    .badge { padding:2px 8px; background:#dbe7ff; color:#0036a3; border-radius:2px; }
    .conditions-card footer { padding:18px 28px; border-top:1px solid #edf1f6; color:#6b7280; font-size:11px; }
    .loading { padding:60px; text-align:center; background:#fff; border:1px solid #d9e1ee; border-radius:8px; color:#64748b; }
    @media (max-width: 960px) {
      .page-header { flex-direction:column; gap:12px; }
      .metrics { grid-template-columns:repeat(2, 1fr); }
      .conditions-grid { grid-template-columns:1fr; }
    }
  `],
})
export class ResultsComponent {
  private route = inject(ActivatedRoute);
  private simSvc = inject(SimulationService);
  private clientSvc = inject(CustomerService);
  private vehicleSvc = inject(VehicleCatalogService);

  simId = +(this.route.snapshot.params['id'] || 0);
  today = new Date().toLocaleDateString('es-PE');
  result = signal<SimulationDto | null>(null);
  client = computed<CustomerDto | undefined>(() => {
    const simulation = this.result();
    return simulation ? this.clientSvc.getById(simulation.clientId) : undefined;
  });
  vehicle = computed<VehicleDto | undefined>(() => {
    const simulation = this.result();
    return simulation ? this.vehicleSvc.getById(simulation.vehicleId) : undefined;
  });

  constructor() {
    const navigationResult = history.state?.result as SimulationDto | undefined;
    if (navigationResult) {
      this.result.set(navigationResult);
    } else {
      this.simSvc.getByIdRemote(this.simId).subscribe((simulation) => this.result.set(simulation));
    }
  }

  clientName() {
    const client = this.client();
    return client ? `${client.names} ${client.surnames}` : '—';
  }

  vehicleName() {
    const vehicle = this.vehicle();
    return vehicle ? `${vehicle.brand} ${vehicle.model} ${vehicle.year}` : '—';
  }

  institutionName() {
    const snapshot = this.result()?.productSnapshot;
    const name = snapshot?.['institutionName'];
    return typeof name === 'string' && name ? name : '—';
  }

  balloonAmount() {
    const schedule = this.result()?.schedule ?? [];
    return schedule.reduce((total, row) => total + row.balloonPayment, 0);
  }

  graceLabel() {
    const simulation = this.result();
    if (!simulation || simulation.graceType === 'NONE') return 'Sin gracia';
    const label = simulation.graceType === 'TOTAL' ? 'Gracia total' : 'Gracia parcial';
    return `${label} (${simulation.graceMonths}m)`;
  }

  regularFinalPayment() {
    const schedule = this.result()?.schedule ?? [];
    const ordinaryRows = schedule.filter(row => row.graceType === 'NONE');
    if (!ordinaryRows.length) return 0;
    const regular = ordinaryRows.find(row => row.balloonPayment === 0);
    return (regular ?? ordinaryRows[0]).payment;
  }

}
