import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VehicleService } from '../../services/vehicle.service';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [RouterModule, FormsModule],
  template: `
    <div class="page-header">
      <div>
        <h1>Vehículos</h1>
        <p>Catálogo de vehículos disponibles</p>
      </div>
      <a routerLink="/vehicles/new" class="btn btn-primary">+ Nuevo vehículo</a>
    </div>
    <div class="card" style="margin-bottom:16px">
      <div class="grid-4">
        <div class="form-group">
          <label>Marca</label>
          <select class="form-control" [(ngModel)]="filterBrand" (ngModelChange)="applyFilter()">
            <option value="">Todas</option>
            @for (b of brands; track b) { <option>{{ b }}</option> }
          </select>
        </div>
        <div class="form-group">
          <label>Gama</label>
          <select class="form-control" [(ngModel)]="filterCategory" (ngModelChange)="applyFilter()">
            <option value="">Todas</option>
            <option value="Baja">Baja</option><option value="Media">Media</option><option value="Alta">Alta</option>
          </select>
        </div>
        <div class="form-group">
          <label>Estado</label>
          <select class="form-control" [(ngModel)]="filterStatus" (ngModelChange)="applyFilter()">
            <option value="">Todos</option>
            <option value="Disponible">Disponible</option><option value="No disponible">No disponible</option>
          </select>
        </div>
      </div>
    </div>
    <div class="grid-3">
      @for (v of filtered(); track v.id) {
        <div class="card vehicle-card">
          <div class="vehicle-image">&#x1F698;</div>
          <div class="vehicle-info">
            <div class="vehicle-name">{{ v.brand }} {{ v.model }}</div>
            <div class="vehicle-detail">{{ v.year }} · {{ v.category }} · {{ v.dealer }}</div>
            <div class="vehicle-price">S/ {{ v.price.toLocaleString() }}</div>
          </div>
          <div style="display:flex;gap:6px;margin-top:12px">
            <span class="badge" [class.badge-green]="v.status==='Disponible'" [class.badge-red]="v.status==='No disponible'">{{ v.status }}</span>
            <a [routerLink]="['/vehicles', v.id]" class="btn btn-sm btn-outline" style="margin-left:auto">Editar</a>
            <button class="btn btn-sm btn-outline" style="color:var(--danger)" (click)="vsvc.delete(v.id); applyFilter()">Eliminar</button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .vehicle-card { display: flex; flex-direction: column; }
    .vehicle-image { font-size: 64px; text-align: center; padding: 16px 0; }
    .vehicle-name { font-weight: 600; font-size: 16px; }
    .vehicle-detail { color: var(--text-muted); font-size: 13px; margin: 4px 0; }
    .vehicle-price { font-size: 20px; font-weight: 700; color: var(--primary); }
  `]
})
export class VehiclesComponent {
  vsvc = inject(VehicleService);
  brands: string[] = [];
  filterBrand = '';
  filterCategory = '';
  filterStatus = '';
  filtered = signal<any[]>([]);

  constructor() {
    this.applyFilter();
  }

  applyFilter() {
    const all = this.vsvc.getAll();
    this.brands = [...new Set(all.map(v => v.brand))];
    this.filtered.set(all.filter(v =>
      (!this.filterBrand || v.brand === this.filterBrand) &&
      (!this.filterCategory || v.category === this.filterCategory) &&
      (!this.filterStatus || v.status === this.filterStatus)
    ));
  }
}
