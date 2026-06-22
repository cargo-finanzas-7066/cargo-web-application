import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { VehicleService } from '../../services/vehicle.service';
import { Vehicle } from '../../models';

@Component({
  selector: 'app-vehicle-form',
  standalone: true,
  imports: [FormsModule, RouterModule],
  template: `
    <div class="page-header"><div><h1>{{ isNew ? 'Nuevo' : 'Editar' }} vehículo</h1></div></div>
    <div class="card" style="max-width:640px">
      <form (ngSubmit)="save()">
        <div class="grid-2">
          <div class="form-group"><label>Marca</label><input class="form-control" [(ngModel)]="vehicle.brand" name="brand" required></div>
          <div class="form-group"><label>Modelo</label><input class="form-control" [(ngModel)]="vehicle.model" name="model" required></div>
          <div class="form-group"><label>Año</label><input type="number" class="form-control" [(ngModel)]="vehicle.year" name="year" required></div>
          <div class="form-group">
            <label>Gama</label>
            <select class="form-control" [(ngModel)]="vehicle.category" name="category">
              <option value="Baja">Baja</option><option value="Media">Media</option><option value="Alta">Alta</option>
            </select>
          </div>
          <div class="form-group"><label>Precio de venta (PEN)</label><input type="number" class="form-control" [(ngModel)]="vehicle.price" name="price" required></div>
          <div class="form-group"><label>Concesionario / Empresa</label><input class="form-control" [(ngModel)]="vehicle.dealer" name="dealer"></div>
          <div class="form-group">
            <label>Estado</label>
            <select class="form-control" [(ngModel)]="vehicle.status" name="status">
              <option value="Disponible">Disponible</option><option value="No disponible">No disponible</option>
            </select>
          </div>
        </div>
        <div class="form-group"><label>Descripción</label><textarea class="form-control" [(ngModel)]="vehicle.description" name="description" rows="3"></textarea></div>
        <div style="display:flex;gap:8px;margin-top:16px">
          <button type="submit" class="btn btn-primary">{{ isNew ? 'Guardar vehículo' : 'Actualizar vehículo' }}</button>
          <a routerLink="/vehicles" class="btn btn-outline">Cancelar</a>
        </div>
      </form>
    </div>
  `
})
export class VehicleFormComponent {
  svc = inject(VehicleService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  isNew = true;
  vehicle: Vehicle = { id: 0, brand: '', model: '', year: 2025, category: 'Media', price: 0, currency: 'PEN', dealer: '', status: 'Disponible' };

  constructor() {
    const id = this.route.snapshot.params['id'];
    if (id) {
      const existing = this.svc.getById(+id);
      if (existing) { this.vehicle = { ...existing }; this.isNew = false; }
    }
  }

  save() {
    this.svc.save(this.vehicle).subscribe(() => this.router.navigate(['/vehicles']));
  }
}
