import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [FormsModule, RouterModule],
  template: `
    <div class="page-header">
      <div><h1>{{ isNew ? 'Nuevo' : 'Editar' }} cliente</h1></div>
    </div>
    <div class="card" style="max-width:640px">
      <form (ngSubmit)="save()">
        <div class="grid-2">
          <div class="form-group">
            <label>Tipo de documento</label>
            <select class="form-control" [(ngModel)]="client.docType" name="docType" required>
              <option value="DNI">DNI</option>
              <option value="CE">CE</option>
              <option value="RUC">RUC</option>
            </select>
          </div>
          <div class="form-group">
            <label>Número de documento</label>
            <input class="form-control" [(ngModel)]="client.docNumber" name="docNumber" required maxlength="12">
          </div>
          <div class="form-group">
            <label>Nombres</label>
            <input class="form-control" [(ngModel)]="client.names" name="names" required>
          </div>
          <div class="form-group">
            <label>Apellidos</label>
            <input class="form-control" [(ngModel)]="client.surnames" name="surnames" required>
          </div>
          <div class="form-group">
            <label>Correo</label>
            <input type="email" class="form-control" [(ngModel)]="client.email" name="email" required>
          </div>
          <div class="form-group">
            <label>Celular</label>
            <input class="form-control" [(ngModel)]="client.phone" name="phone" required maxlength="9">
          </div>
          <div class="form-group">
            <label>Ingreso mensual</label>
            <input type="number" class="form-control" [(ngModel)]="client.monthlyIncome" name="monthlyIncome">
            <div class="form-hint">Referencia para evaluar capacidad de pago</div>
          </div>
          <div class="form-group">
            <label>Ocupación</label>
            <input class="form-control" [(ngModel)]="client.occupation" name="occupation">
          </div>
        </div>
        <div class="form-group">
          <label>Dirección</label>
          <input class="form-control" [(ngModel)]="client.address" name="address">
        </div>
        <div style="display:flex;gap:8px;margin-top:16px">
          <button type="submit" class="btn btn-primary">{{ isNew ? 'Guardar cliente' : 'Actualizar cliente' }}</button>
          <a routerLink="/clients" class="btn btn-outline">Cancelar</a>
        </div>
      </form>
    </div>
  `
})
export class ClientFormComponent {
  svc = inject(ClientService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  isNew = true;
  client: Client = { id: 0, docType: 'DNI', docNumber: '', names: '', surnames: '', email: '', phone: '', status: 'Activo' };

  constructor() {
    const id = this.route.snapshot.params['id'];
    if (id) {
      const existing = this.svc.getById(+id);
      if (existing) { this.client = { ...existing }; this.isNew = false; }
    }
  }

  save() {
    this.svc.save(this.client).subscribe(() => this.router.navigate(['/clients']));
  }
}
