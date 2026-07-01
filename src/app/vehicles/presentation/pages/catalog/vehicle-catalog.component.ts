import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PageContainerComponent } from '../../../../shared/components/page-container/page-container.component';
import { VehicleCatalogService } from '../../../services/api/vehicle-catalog.service';
import { VehicleDto } from '../../../models/dtos/vehicle.dto';

@Component({
  selector: 'app-vehicle-catalog',
  standalone: true,
  imports: [CurrencyPipe, FormsModule, RouterLink, PageContainerComponent],
  template: `
    <app-page-container>
    <section class="catalog-page">
      <div class="page-header">
        <div><h1>Catálogo de vehículos</h1></div>
      </div>

      <div class="notice">
        <span>ⓘ</span>
        <p>Los valores mostrados son referenciales y se utilizan como base para la simulación del crédito vehicular. La aprobación final dependerá de la entidad financiera seleccionada.</p>
      </div>

      <section class="filters">
        <label class="search-field">
          <span>Búsqueda</span>
          <input [(ngModel)]="query" placeholder="Buscar por marca, modelo o versión...">
        </label>
        <label>
          <span>Año</span>
          <select [(ngModel)]="year">
            <option value="">Todos</option>
            @for (item of years(); track item) {
              <option [value]="item">{{ item }}</option>
            }
          </select>
        </label>
        <label>
          <span>Concesionario</span>
          <select [(ngModel)]="dealer">
            <option value="">Todos</option>
            @for (item of dealers(); track item) {
              <option [value]="item">{{ item }}</option>
            }
          </select>
        </label>
      </section>

      <div class="vehicle-grid">
        @for (vehicle of filteredVehicles(); track vehicle.id) {
          <article class="vehicle-card">
            <img [src]="vehicle.imageUrl || fallbackImage" [alt]="vehicle.brand + ' ' + vehicle.model">
            <div class="vehicle-body">
              <p class="brand">{{ vehicle.brand }}</p>
              <h2>{{ vehicle.model }} {{ vehicle.year }}</h2>
              <dl>
                <div><dt>Año</dt><dd>{{ vehicle.year }}</dd></div>
                <div><dt>Concesionario</dt><dd>{{ vehicle.dealer }}</dd></div>
              </dl>
              <div class="price-row">
                <span>Valor<br>referencial</span>
                <strong>{{ vehicle.price | currency:'S/ ':'symbol':'1.2-2' }}</strong>
              </div>
              <a class="use-action" [routerLink]="['/simulation/new']" [queryParams]="{ vehicleId: vehicle.id }">Usar en simulación</a>
            </div>
          </article>
        }
      </div>
    </section>
    </app-page-container>
  `,
  styles: [`
    .notice { display: flex; gap: 16px; align-items: flex-start; padding: 18px 20px; border: 1px solid #dfe5ff; border-radius: 7px; background: #eef1ff; color: #0036ad; margin-bottom: 24px; }
    .notice span { font-size: 20px; }
    .notice p { line-height: 1.55; }
    .filters { display: grid; grid-template-columns: 1fr 132px 280px; gap: 24px; padding: 26px; border: 1px solid #d9e0ea; border-radius: 8px; background: #fff; margin-bottom: 30px; }
    label span { display: block; margin-bottom: 9px; color: #63728b; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; }
    input, select { width: 100%; height: 42px; border: 1px solid #d8e0eb; border-radius: 3px; background: #fff; padding: 0 14px; color: #111827; }
    .search-field input { padding-left: 18px; }
    .vehicle-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 32px; padding-bottom: 90px; }
    .vehicle-card { overflow: hidden; border: 1px solid #d9e0ea; border-radius: 7px; background: #fff; box-shadow: 0 1px 2px rgba(15,23,42,.03); }
    .vehicle-card img { width: 100%; height: 176px; object-fit: cover; display: block; background: #e5e7eb; }
    .vehicle-body { padding: 24px; }
    .brand { color: #64748b; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; margin-bottom: 4px; }
    .vehicle-body h2 { color: #172033; font-size: 21px; line-height: 1.18; min-height: 50px; margin-bottom: 18px; }
    dl { display: grid; gap: 12px; margin-bottom: 24px; }
    dl div { display: flex; justify-content: space-between; align-items: baseline; gap: 16px; }
    dt { color: #718096; font-size: 12px; }
    dd { color: #111827; font-size: 12px; font-weight: 800; text-align: right; }
    .price-row { display: flex; justify-content: space-between; align-items: center; padding-top: 24px; border-top: 1px solid #edf1f6; margin-bottom: 20px; }
    .price-row span { color: #64748b; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; }
    .price-row strong { color: #111827; font-size: 22px; line-height: 1.2; text-align: right; }
    .use-action { display: grid; place-items: center; height: 46px; border-radius: 2px; background: #2948bd; color: #fff; font-weight: 800; }
    @media (max-width: 1000px) {
      .vehicle-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .filters { grid-template-columns: 1fr; }
    }
    @media (max-width: 680px) {
      .vehicle-grid { grid-template-columns: 1fr; }
    }
  `],
})
export class VehicleCatalogComponent {
  private catalogService = inject(VehicleCatalogService);
  fallbackImage = 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80';
  vehicles = signal<VehicleDto[]>([]);
  query = '';
  year = '';
  dealer = '';

  years = computed(() => [...new Set(this.vehicles().map((vehicle) => vehicle.year))].sort((a, b) => b - a));
  dealers = computed(() => [...new Set(this.vehicles().map((vehicle) => vehicle.dealer))].sort());
  filteredVehicles = computed(() => {
    const query = this.query.trim().toLowerCase();
    return this.vehicles().filter((vehicle) => {
      const matchesQuery = !query || `${vehicle.brand} ${vehicle.model}`.toLowerCase().includes(query);
      const matchesYear = !this.year || vehicle.year === Number(this.year);
      const matchesDealer = !this.dealer || vehicle.dealer === this.dealer;
      return matchesQuery && matchesYear && matchesDealer;
    });
  });

  constructor() {
    this.catalogService.getAll().subscribe((vehicles) => this.vehicles.set(vehicles));
  }
}
