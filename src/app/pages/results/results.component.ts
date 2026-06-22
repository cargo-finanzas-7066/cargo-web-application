import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { SimulationService } from '../../services/simulation.service';
import { ClientService } from '../../services/client.service';
import { VehicleService } from '../../services/vehicle.service';
import { EntityService } from '../../services/entity.service';
import { SimulationResult } from '../../models';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CurrencyPipe, DecimalPipe, RouterModule],
  template: `
    @if (result(); as r) {
      <div class="page-header">
        <div><h1>Resultados de simulación</h1><p>{{ simCode }}</p></div>
        <div style="display:flex;gap:8px">
          <button class="btn btn-success" (click)="saveSim()">Guardar simulación</button>
          <a routerLink="/simulation/new" class="btn btn-primary">Nueva simulación</a>
        </div>
      </div>

      <div class="grid-4">
        <div class="card result-card"><div class="result-label">Cuota mensual</div><div class="result-value blue">{{ r.monthlyPayment | currency:'S/ ' }}</div></div>
        <div class="card result-card"><div class="result-label">VAN</div><div class="result-value" [class.green]="r.van > 0">{{ r.van | number:'1.2-2' }}</div></div>
        <div class="card result-card"><div class="result-label">TIR</div><div class="result-value blue">{{ r.tir | number:'1.2-2' }}%</div></div>
        <div class="card result-card"><div class="result-label">TCEA</div><div class="result-value dark">{{ r.tcea | number:'1.2-2' }}%</div></div>
      </div>

      <div class="card" style="margin-top:16px">
        <div class="grid-2">
          <div><strong>Monto financiado:</strong> {{ r.financedAmount | currency:'S/ ' }}</div>
          <div><strong>Total a pagar:</strong> {{ r.totalPayment | currency:'S/ ' }}</div>
          <div><strong>Cliente:</strong> {{ clientName() }}</div>
          <div><strong>Vehículo:</strong> {{ vehicleName() }}</div>
          <div><strong>Entidad:</strong> {{ entityName() }}</div>
          <div><strong>Plazo:</strong> {{ simTerm }} meses</div>
          <div><strong>Tipo de gracia:</strong> {{ graceLabel() }}</div>
        </div>
      </div>

      <div class="card" style="margin-top:16px;padding:0;overflow:auto">
        <table>
          <thead>
            <tr><th>N°</th><th>Fecha</th><th>Saldo inicial</th><th>Cuota</th><th>Interés</th><th>Amortización</th><th>Seguro</th><th>Comisión</th><th>Saldo final</th></tr>
          </thead>
          <tbody>
            @for (row of r.schedule; track row.period) {
              <tr [style.font-weight]="row.period === r.schedule.length ? 700 : 'normal'">
                <td>{{ row.period }}</td>
                <td>{{ row.date }}</td>
                <td>{{ row.initialBalance | number:'1.2-2' }}</td>
                <td>{{ row.payment | number:'1.2-2' }}</td>
                <td>{{ row.interest | number:'1.2-2' }}</td>
                <td>{{ row.amortization | number:'1.2-2' }}</td>
                <td>{{ row.insurance | number:'1.2-2' }}</td>
                <td>{{ row.commission | number:'1.2-2' }}</td>
                <td>{{ row.finalBalance | number:'1.2-2' }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    } @else {
      <div class="card"><p style="text-align:center;color:var(--text-muted)">Cargando resultados...</p></div>
    }
  `,
  styles: [`
    .result-card { text-align: center; }
    .result-label { font-size: 13px; color: var(--text-muted); margin-bottom: 4px; }
    .result-value { font-size: 24px; font-weight: 700; }
    .result-value.blue { color: var(--primary); }
    .result-value.green { color: var(--success); }
    .result-value.dark { color: var(--text); }
  `]
})
export class ResultsComponent {
  route = inject(ActivatedRoute);
  simSvc = inject(SimulationService);
  clientSvc = inject(ClientService);
  vehicleSvc = inject(VehicleService);
  entitySvc = inject(EntityService);
  simId = +(this.route.snapshot.params['id'] || 0);
  simCode = '';
  simTerm = 0;
  result = signal<SimulationResult | null>(null);
  clientName = signal('');
  vehicleName = signal('');
  entityName = signal('');
  graceLabel = signal('');

  constructor() {
    const sim = this.simSvc.getById(this.simId);
    if (sim) {
      this.simCode = sim.code;
      this.simTerm = sim.term;
      const c = this.clientSvc.getById(sim.clientId);
      if (c) this.clientName.set(`${c.names} ${c.surnames}`);
      const v = this.vehicleSvc.getById(sim.vehicleId);
      if (v) this.vehicleName.set(`${v.brand} ${v.model}`);
      const e = this.entitySvc.getById(sim.entityId);
      if (e) this.entityName.set(e.name);
      this.graceLabel.set(sim.graceType === 'none' ? 'Sin gracia' : sim.graceType === 'total' ? 'Gracia total' : 'Gracia parcial');
    }
    this.simSvc.calculate(this.simId).subscribe(r => this.result.set(r));
  }

  saveSim() {
    const sim = this.simSvc.getById(this.simId);
    if (sim) { sim.status = 'Guardado'; this.simSvc.save(sim); }
  }
}
