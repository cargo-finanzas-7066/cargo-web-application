import { DecimalPipe, SlicePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Simulation, SimulationResult } from '../../models';
import { CustomerDto } from '../../customers/models/dtos/customer.dto';
import { CustomerService } from '../../customers/services/api/customer.service';
import { FinancialInstitutionDto } from '../../financial-institutions/models/dtos/financial-institution.dto';
import { FinancialInstitutionService } from '../../financial-institutions/services/api/financial-institution.service';
import { SimulationService } from '../../services/simulation.service';
import { VehicleDto } from '../../vehicles/models/dtos/vehicle.dto';
import { VehicleCatalogService } from '../../vehicles/services/api/vehicle-catalog.service';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [DecimalPipe, SlicePipe],
  template: `
    @if (result(); as r) {
      <section class="results-page">
        <div class="crumb">Simulaciones › <strong>Resultado de Simulación {{ simulation()?.code || ('#' + simId) }}</strong></div>
        <header class="results-head">
          <div>
            <h1>Resultados de simulación</h1>
            <p>Simulación generada para {{ clientName() }} bajo el método francés vencido ordinario.</p>
          </div>
          <span class="saved">✓ Simulación guardada automáticamente</span>
        </header>

        <section class="metrics">
          <article class="metric featured"><small>Cuota mensual</small><strong>S/ {{ r.monthlyPayment | number:'1.2-2' }}</strong></article>
          <article class="metric"><small>Capital financiado</small><strong>S/ {{ r.financedAmount | number:'1.2-2' }}</strong></article>
          <article class="metric"><small>TEA ⓘ</small><strong>{{ r.tea | number:'1.2-2' }}%</strong></article>
          <article class="metric"><small>TEM ⓘ</small><strong>{{ r.tem | number:'1.2-2' }}%</strong></article>
          <article class="metric"><small>TCEA ⓘ</small><strong class="green">{{ r.tcea | number:'1.2-2' }}%</strong></article>
          <article class="metric"><small>VAN ⓘ</small><strong>S/ {{ r.van | number:'1.2-2' }}</strong></article>
          <article class="metric"><small>TIR ⓘ</small><strong>{{ r.tir | number:'1.2-2' }}%</strong></article>
          <article class="metric"><small>Cuota balón ⓘ</small><strong class="blue">S/ {{ r.balloonAmount | number:'1.2-2' }}</strong></article>
          <article class="metric"><small>Interés total</small><strong>S/ {{ r.totalInterest | number:'1.2-2' }}</strong></article>
          <article class="metric"><small>Costo total del crédito</small><strong>S/ {{ r.totalCreditCost | number:'1.2-2' }}</strong></article>
          <article class="metric total"><small>Total a pagar</small><strong>S/ {{ r.totalPayment | number:'1.2-2' }}</strong></article>
        </section>

        <section class="schedule-card">
          <header>
            <h2>▣ Cronograma de pagos</h2>
            <span>Soles (PEN)</span>
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
                  <th>Amortización</th>
                  <th>Seg. vehicular</th>
                  <th>Seg. desgrav.</th>
                  <th>Portes</th>
                  <th>Pago total ⓘ</th>
                  <th>Saldo final ⓘ</th>
                </tr>
              </thead>
              <tbody>
                @for (row of r.schedule; track row.period) {
                  <tr>
                    <td>{{ row.period }}</td>
                    <td>{{ row.date | slice:0:10 }}</td>
                    <td>S/ {{ row.initialBalance | number:'1.2-2' }}</td>
                    <td>S/ {{ row.payment | number:'1.2-2' }}</td>
                    <td>S/ {{ row.balloonPayment | number:'1.2-2' }}</td>
                    <td>S/ {{ row.amortization | number:'1.2-2' }}</td>
                    <td>S/ {{ vehicleInsurancePortion(row.insurance) | number:'1.2-2' }}</td>
                    <td>S/ {{ disbursementInsurancePortion(row.insurance) | number:'1.2-2' }}</td>
                    <td>S/ {{ row.commission | number:'1.2-2' }}</td>
                    <td class="blue">S/ {{ row.totalPayment | number:'1.2-2' }}</td>
                    <td>S/ {{ row.finalBalance | number:'1.2-2' }}</td>
                  </tr>
                }
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3">Totales</td>
                  <td>S/ {{ sum('payment') | number:'1.2-2' }}</td>
                  <td>S/ {{ r.balloonAmount | number:'1.2-2' }}</td>
                  <td>S/ {{ r.financedAmount | number:'1.2-2' }}</td>
                  <td>S/ {{ r.totalInsurance | number:'1.2-2' }}</td>
                  <td></td>
                  <td>S/ {{ r.totalCommissions | number:'1.2-2' }}</td>
                  <td>S/ {{ r.totalPayment | number:'1.2-2' }}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>

        <section class="conditions-card">
          <header><h2>▣ Ficha de Condiciones</h2></header>
          <div class="conditions-grid">
            <dl>
              <dt>Cliente y documento</dt>
              <dd><span>Cliente:</span><strong>{{ clientName() }}</strong></dd>
              <dd><span>Documento:</span><strong>{{ client()?.docType || 'DNI' }} {{ client()?.docNumber || '45829103' }}</strong></dd>
            </dl>
            <dl>
              <dt>Vehículo y valor</dt>
              <dd><span>Vehículo:</span><strong>{{ vehicleName() }}</strong></dd>
              <dd><span>Valor vehículo:</span><strong>S/ {{ (simulation()?.vehiclePrice || 0) | number:'1.2-2' }}</strong></dd>
              <dd><span>Cuota inicial:</span><strong>S/ {{ (simulation()?.downPayment || 0) | number:'1.2-2' }}</strong></dd>
            </dl>
            <dl>
              <dt>Financiamiento</dt>
              <dd><span>Entidad:</span><strong class="badge">{{ entity()?.shortName || entity()?.name || 'BCP' }}</strong></dd>
              <dd><span>Cap. financiado:</span><strong class="blue">S/ {{ r.financedAmount | number:'1.2-2' }}</strong></dd>
              <dd><span>Cuota balón:</span><strong class="blue">S/ {{ r.balloonAmount | number:'1.2-2' }}</strong></dd>
              <dd><span>Moneda:</span><strong>Soles (PEN)</strong></dd>
            </dl>
            <dl>
              <dt>Plazo y método</dt>
              <dd><span>TEA:</span><strong>{{ r.tea | number:'1.2-2' }}%</strong></dd>
              <dd><span>TEM:</span><strong>{{ r.tem | number:'1.2-2' }}%</strong></dd>
              <dd><span>Plazo:</span><strong>{{ simulation()?.term || 0 }} meses</strong></dd>
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
  `,
  styles: [`
    .results-page { max-width:1120px; margin:0 auto; }
    .crumb { margin:-18px 0 32px; color:#8aa0bf; font-size:13px; }
    .crumb strong { color:#111827; }
    .results-head { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:28px; }
    h1 { margin:0; font-size:32px; letter-spacing:-.03em; color:#111827; font-weight:900; }
    p { color:#6b7280; margin-top:8px; font-size:15px; }
    .saved { align-self:center; padding:5px 10px; border-radius:999px; background:#eaf8ef; color:#087a3d; font-size:11px; font-weight:900; text-transform:uppercase; }
    .metrics { display:grid; grid-template-columns:repeat(6, 1fr); gap:14px; margin-bottom:34px; }
    .metric { min-height:86px; padding:18px; background:#fff; border:1px solid #d9e1ee; border-radius:7px; box-shadow:0 1px 2px rgba(15,23,42,.05); }
    .metric small { display:block; margin-bottom:10px; color:#6b7280; font-size:10px; font-weight:900; letter-spacing:.08em; text-transform:uppercase; }
    .metric strong { color:#111827; font-size:22px; line-height:1.25; }
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
      .results-head { flex-direction:column; gap:12px; }
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
  private entitySvc = inject(FinancialInstitutionService);

  simId = +(this.route.snapshot.params['id'] || 0);
  today = new Date().toLocaleDateString('es-PE');
  result = signal<SimulationResult | null>(null);
  simulation = signal<Simulation | undefined>(undefined);
  client = signal<CustomerDto | undefined>(undefined);
  vehicle = signal<VehicleDto | undefined>(undefined);
  entity = signal<FinancialInstitutionDto | undefined>(undefined);

  constructor() {
    this.loadSimulation();
    this.simSvc.calculate(this.simId).subscribe((result) => {
      this.result.set(result);
      this.simSvc.refresh();
    });
  }

  loadSimulation() {
    const local = this.simSvc.getById(this.simId);
    if (local) {
      this.hydrate(local);
    }
    this.simSvc.getByIdRemote(this.simId).subscribe((simulation) => this.hydrate(simulation));
  }

  hydrate(simulation: Simulation) {
    this.simulation.set(simulation);
    this.client.set(this.clientSvc.getById(simulation.clientId));
    this.vehicle.set(this.vehicleSvc.getById(simulation.vehicleId));
    this.entity.set(this.entitySvc.getById(simulation.entityId));
  }

  clientName() {
    const client = this.client();
    return client ? `${client.names} ${client.surnames}` : 'Roberto Gómez Valdez';
  }

  vehicleName() {
    const vehicle = this.vehicle();
    return vehicle ? `${vehicle.brand} ${vehicle.model} ${vehicle.year}` : 'Toyota Corolla 2024';
  }

  graceLabel() {
    const type = this.simulation()?.graceType;
    if (type === 'P' || type === 'partial') return 'Gracia parcial';
    if (type === 'T' || type === 'total') return 'Gracia total';
    return 'Sin gracia';
  }

  vehicleInsurancePortion(totalInsurance: number) {
    const simulation = this.simulation();
    return simulation ? (simulation.vehiclePrice * (simulation.insuranceVehicle / 100)) / 12 : 80;
  }

  disbursementInsurancePortion(totalInsurance: number) {
    return Math.max(0, totalInsurance - this.vehicleInsurancePortion(totalInsurance));
  }

  sum(field: 'payment') {
    return this.result()?.schedule.reduce((total, row) => total + row[field], 0) || 0;
  }
}
