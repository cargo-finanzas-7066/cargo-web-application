import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { EntityService } from '../../services/entity.service';
import { FinancialEntity } from '../../models';

@Component({
  selector: 'app-entity-form',
  standalone: true,
  imports: [FormsModule, RouterModule],
  template: `
    <div class="page-header"><div><h1>{{ isNew ? 'Nueva' : 'Editar' }} entidad financiera</h1></div></div>
    <div class="card" style="max-width:720px">
      <form (ngSubmit)="save()">
        <div class="grid-2">
          <div class="form-group"><label>Nombre de entidad</label><input class="form-control" [(ngModel)]="entity.name" name="name" required></div>
          <div class="form-group">
            <label>Tipo</label>
            <select class="form-control" [(ngModel)]="entity.type" name="type">
              <option value="Banco">Banco</option><option value="Caja">Caja</option><option value="Financiera">Financiera</option><option value="Concesionario">Concesionario</option>
            </select>
          </div>
          <div class="form-group"><label>Producto financiero</label><input class="form-control" [(ngModel)]="entity.product" name="product"></div>
          <div class="form-group"><label>TEA base (%)</label><input type="number" step="0.01" class="form-control" [(ngModel)]="entity.tea" name="tea" required></div>
          <div class="form-group"><label>Plazo mínimo (meses)</label><input type="number" class="form-control" [(ngModel)]="entity.minTerm" name="minTerm"></div>
          <div class="form-group"><label>Plazo máximo (meses)</label><input type="number" class="form-control" [(ngModel)]="entity.maxTerm" name="maxTerm"></div>
          <div class="form-group"><label>Cuota inicial mínima (%)</label><input type="number" class="form-control" [(ngModel)]="entity.minDownPayment" name="minDownPayment"></div>
          <div class="form-group"><label>Seguro desgravamen (% mensual)</label><input type="number" step="0.01" class="form-control" [(ngModel)]="entity.insuranceDisbursement" name="insuranceDisbursement"></div>
          <div class="form-group"><label>Seguro vehicular (% anual)</label><input type="number" step="0.01" class="form-control" [(ngModel)]="entity.insuranceVehicle" name="insuranceVehicle"></div>
          <div class="form-group"><label>Comisión mensual (S/)</label><input type="number" class="form-control" [(ngModel)]="entity.monthlyFee" name="monthlyFee"></div>
          <div class="form-group"><label>Gastos administrativos (S/)</label><input type="number" class="form-control" [(ngModel)]="entity.adminCost" name="adminCost"></div>
          <div class="form-group">
            <label>Estado</label>
            <select class="form-control" [(ngModel)]="entity.status" name="status">
              <option value="Activo">Activo</option><option value="Inactivo">Inactivo</option>
            </select>
          </div>
        </div>
        <div class="form-group"><label>Penalidades / Observaciones</label><textarea class="form-control" [(ngModel)]="entity.penalties" name="penalties" rows="2"></textarea></div>
        <div style="display:flex;gap:8px;margin-top:16px">
          <button type="submit" class="btn btn-primary">{{ isNew ? 'Guardar entidad' : 'Actualizar entidad' }}</button>
          <a routerLink="/entities" class="btn btn-outline">Cancelar</a>
        </div>
      </form>
    </div>
  `
})
export class EntityFormComponent {
  svc = inject(EntityService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  isNew = true;
  entity: FinancialEntity = { id: 0, name: '', type: 'Banco', product: 'Crédito vehicular', tea: 0, minTerm: 12, maxTerm: 60, minDownPayment: 20, insuranceDisbursement: 0.05, insuranceVehicle: 3.5, monthlyFee: 0, adminCost: 0, status: 'Activo' };

  constructor() {
    const id = this.route.snapshot.params['id'];
    if (id) {
      const existing = this.svc.getById(+id);
      if (existing) { this.entity = { ...existing }; this.isNew = false; }
    }
  }

  save() {
    this.svc.save(this.entity).subscribe(() => this.router.navigate(['/entities']));
  }
}
