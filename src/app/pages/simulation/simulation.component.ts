import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { VehicleService } from '../../services/vehicle.service';
import { EntityService } from '../../services/entity.service';
import { SimulationService } from '../../services/simulation.service';
import { Simulation } from '../../models';

@Component({
  selector: 'app-simulation',
  standalone: true,
  imports: [FormsModule, RouterModule],
  template: `
    <div class="page-header"><div><h1>Nueva simulación</h1><p>Completa los 4 pasos para generar el plan de pagos</p></div></div>

    <div class="steps">
      @for (s of steps; track $index) {
        <div class="step" [class.active]="step() === $index" [class.done]="step() > $index">
          <div class="step-num">{{ $index + 1 }}</div>
          <div class="step-label">{{ s }}</div>
        </div>
      }
    </div>

    <div class="card" style="margin-top:24px">
      @if (step() === 0) {
        <h3 style="margin-bottom:16px">Paso 1: Cliente y vehículo</h3>
        <div class="grid-2">
          <div class="form-group">
            <label>Cliente</label>
            <select class="form-control" [(ngModel)]="simulation.clientId">
              <option [value]="0">Seleccione un cliente</option>
              @for (c of clients(); track c.id) { <option [value]="c.id">{{ c.names }} {{ c.surnames }} — {{ c.docNumber }}</option> }
            </select>
          </div>
          <div class="form-group">
            <label>Vehículo</label>
            <select class="form-control" [(ngModel)]="simulation.vehicleId" (ngModelChange)="onVehicleChange()">
              <option [value]="0">Seleccione un vehículo</option>
              @for (v of vehicles(); track v.id) { <option [value]="v.id">{{ v.brand }} {{ v.model }} ({{ v.year }})</option> }
            </select>
          </div>
          <div class="form-group">
            <label>Precio de venta (PEN)</label>
            <input type="number" class="form-control" [(ngModel)]="simulation.vehiclePrice" name="vehiclePrice">
          </div>
          <div class="form-group">
            <label>Concesionario</label>
            <input class="form-control" [value]="selectedVehicle()?.dealer || ''" disabled>
          </div>
        </div>
        <button class="btn btn-primary" style="margin-top:16px" (click)="step.set(1)">Siguiente →</button>
      }
      @if (step() === 1) {
        <h3 style="margin-bottom:16px">Paso 2: Condiciones del crédito</h3>
        <div class="grid-2">
          <div class="form-group">
            <label>Entidad financiera</label>
            <select class="form-control" [(ngModel)]="simulation.entityId" (ngModelChange)="onEntityChange()">
              <option [value]="0">Seleccione entidad</option>
              @for (e of entities(); track e.id) { <option [value]="e.id">{{ e.name }} — {{ e.tea }}% TEA</option> }
            </select>
          </div>
          <div class="form-group">
            <label>Moneda</label>
            <input class="form-control" value="Soles (PEN)" disabled>
          </div>
          <div class="form-group">
            <label>Cuota inicial (PEN)</label>
            <input type="number" class="form-control" [(ngModel)]="simulation.downPayment" name="downPayment" (ngModelChange)="updateFinanced()">
          </div>
          <div class="form-group">
            <label>Monto financiado</label>
            <input class="form-control" [value]="simulation.financedAmount" disabled>
          </div>
          <div class="form-group">
            <label>Plazo (meses)</label>
            <select class="form-control" [(ngModel)]="simulation.term">
              @for (t of [12,24,36,48,60]; track t) { <option [value]="t">{{ t }} meses</option> }
            </select>
          </div>
          <div class="form-group">
            <label>TEA (%)</label>
            <input type="number" step="0.01" class="form-control" [(ngModel)]="simulation.tea" name="tea">
          </div>
          <div class="form-group">
            <label>Fecha de desembolso</label>
            <input type="date" class="form-control" [(ngModel)]="simulation.disbursementDate" name="disbursementDate">
          </div>
          <div class="form-group">
            <label>Día de pago</label>
            <select class="form-control" [(ngModel)]="simulation.paymentDay">
              @for (d of [1,2,3,4,5,10,15,20,25,30]; track d) { <option [value]="d">{{ d }}</option> }
            </select>
          </div>
        </div>
        <div style="display:flex;gap:8px;margin-top:16px">
          <button class="btn btn-outline" (click)="step.set(0)">← Anterior</button>
          <button class="btn btn-primary" (click)="step.set(2)">Siguiente →</button>
        </div>
      }
      @if (step() === 2) {
        <h3 style="margin-bottom:16px">Paso 3: Periodo de gracia</h3>
        <div class="grid-3" style="margin-bottom:16px">
          <label class="radio-card" [class.selected]="simulation.graceType==='none'" (click)="simulation.graceType='none'; simulation.graceMonths=0">
            <input type="radio" name="grace" value="none" [(ngModel)]="simulation.graceType"> Sin gracia
            <small>El cliente paga cuotas completas desde el primer periodo</small>
          </label>
          <label class="radio-card" [class.selected]="simulation.graceType==='total'" (click)="simulation.graceType='total'">
            <input type="radio" name="grace" value="total" [(ngModel)]="simulation.graceType"> Gracia total
            <small>No se paga capital ni intereses durante el periodo de gracia</small>
          </label>
          <label class="radio-card" [class.selected]="simulation.graceType==='partial'" (click)="simulation.graceType='partial'">
            <input type="radio" name="grace" value="partial" [(ngModel)]="simulation.graceType"> Gracia parcial
            <small>Se pagan solo intereses durante el periodo de gracia</small>
          </label>
        </div>
        @if (simulation.graceType !== 'none') {
          <div class="form-group">
            <label>Duración del periodo de gracia (meses)</label>
            <input type="number" class="form-control" [(ngModel)]="simulation.graceMonths" name="graceMonths" min="1" max="6">
          </div>
        }
        <div style="display:flex;gap:8px;margin-top:16px">
          <button class="btn btn-outline" (click)="step.set(1)">← Anterior</button>
          <button class="btn btn-primary" (click)="step.set(3)">Siguiente →</button>
        </div>
      }
      @if (step() === 3) {
        <h3 style="margin-bottom:16px">Paso 4: Costos adicionales</h3>
        <div class="grid-2">
          <div class="form-group">
            <label>Seguro desgravamen (% mensual)</label>
            <input type="number" step="0.001" class="form-control" [(ngModel)]="simulation.insuranceDisbursement" name="insuranceDisbursement">
            <div class="form-hint">Porcentaje sobre el saldo deudor</div>
          </div>
          <div class="form-group">
            <label>Seguro vehicular (% anual)</label>
            <input type="number" step="0.01" class="form-control" [(ngModel)]="simulation.insuranceVehicle" name="insuranceVehicle">
          </div>
          <div class="form-group">
            <label>Comisión mensual (S/)</label>
            <input type="number" class="form-control" [(ngModel)]="simulation.monthlyFee" name="monthlyFee">
          </div>
          <div class="form-group">
            <label>Gastos administrativos (S/)</label>
            <input type="number" class="form-control" [(ngModel)]="simulation.adminCost" name="adminCost">
          </div>
          <div class="form-group">
            <label>Gastos notariales/registrales (S/)</label>
            <input type="number" class="form-control" [(ngModel)]="simulation.notaryCost" name="notaryCost">
          </div>
          <div class="form-group">
            <label>Otros cargos (S/)</label>
            <input type="number" class="form-control" [(ngModel)]="simulation.otherCharges" name="otherCharges">
          </div>
        </div>
        <div style="display:flex;gap:8px;margin-top:16px">
          <button class="btn btn-outline" (click)="step.set(2)">← Anterior</button>
          <button class="btn btn-success" (click)="calculate()">Generar simulación</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .steps { display: flex; gap: 8px; }
    .step { display: flex; align-items: center; gap: 8px; padding: 8px 16px; border-radius: 6px; background: var(--bg); border: 1.5px solid var(--border); font-size: 13px; }
    .step.active { border-color: var(--primary); background: var(--primary-light); color: var(--primary); }
    .step.done { border-color: var(--success); color: var(--success); }
    .step-num { width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 12px; background: var(--border); }
    .step.active .step-num { background: var(--primary); color: #fff; }
    .step.done .step-num { background: var(--success); color: #fff; }
    .step-label { font-weight: 500; white-space: nowrap; }
    .radio-card { display: flex; flex-direction: column; gap: 4px; padding: 16px; border: 2px solid var(--border); border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px; transition: all .15s; }
    .radio-card:hover { border-color: var(--primary); }
    .radio-card.selected { border-color: var(--primary); background: var(--primary-light); }
    .radio-card small { font-weight: 400; font-size: 12px; color: var(--text-muted); }
    .radio-card input { display: none; }
  `]
})
export class SimulationComponent {
  router = inject(Router);
  clientSvc = inject(ClientService);
  vehicleSvc = inject(VehicleService);
  entitySvc = inject(EntityService);
  simSvc = inject(SimulationService);
  step = signal(0);
  steps = ['Cliente y vehículo', 'Condiciones del crédito', 'Periodo de gracia', 'Costos adicionales'];

  simulation: Simulation = {
    id: 0, code: '', clientId: 0, vehicleId: 0, entityId: 0,
    currency: 'PEN', vehiclePrice: 0, downPayment: 0, financedAmount: 0,
    term: 48, tea: 0, paymentDay: 5, disbursementDate: new Date().toISOString().slice(0, 10),
    graceType: 'none', graceMonths: 0,
    insuranceDisbursement: 0.05, insuranceVehicle: 3.5, monthlyFee: 10, adminCost: 150,
    notaryCost: 0, otherCharges: 0, status: 'Borrador', createdAt: ''
  };

  clients = this.clientSvc.clients;
  vehicles = this.vehicleSvc.vehicles;
  entities = this.entitySvc.entities;
  selectedVehicle = signal(this.vehicleSvc.getById(0));
  selectedEntity = signal(this.entitySvc.getById(0));

  onVehicleChange() {
    const v = this.vehicleSvc.getById(this.simulation.vehicleId);
    if (v) { this.selectedVehicle.set(v); this.simulation.vehiclePrice = v.price; this.updateFinanced(); }
  }

  onEntityChange() {
    const e = this.entitySvc.getById(this.simulation.entityId);
    if (e) {
      this.selectedEntity.set(e);
      this.simulation.tea = e.tea;
      this.simulation.insuranceDisbursement = e.insuranceDisbursement;
      this.simulation.insuranceVehicle = e.insuranceVehicle;
      this.simulation.monthlyFee = e.monthlyFee;
      this.simulation.adminCost = e.adminCost;
    }
  }

  updateFinanced() { this.simulation.financedAmount = this.simulation.vehiclePrice - this.simulation.downPayment; }

  calculate() {
    this.simulation.financedAmount = this.simulation.vehiclePrice - this.simulation.downPayment;
    this.simSvc.save(this.simulation).subscribe((saved) => {
      this.router.navigate(['/results', saved.id]);
    });
  }
}
