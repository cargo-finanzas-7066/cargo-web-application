import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="page-header">
      <div>
        <h1>Dashboard</h1>
        <p>Resumen del sistema CarGo</p>
      </div>
      <a routerLink="/simulation/new" class="btn btn-primary">+ Nueva simulación</a>
    </div>

    <div class="grid-4">
      <div class="card stats-card">
        <div class="stat-label">Simulaciones realizadas</div>
        <div class="stat-value">{{ stats().totalSimulations }}</div>
      </div>
      <div class="card stats-card">
        <div class="stat-label">Clientes registrados</div>
        <div class="stat-value">{{ stats().totalClients }}</div>
      </div>
      <div class="card stats-card">
        <div class="stat-label">Vehículos disponibles</div>
        <div class="stat-value">{{ stats().totalVehicles }}</div>
      </div>
      <div class="card stats-card">
        <div class="stat-label">Entidades financieras</div>
        <div class="stat-value">{{ stats().totalEntities }}</div>
      </div>
    </div>

    <div class="grid-2" style="margin-top: 24px">
      <div class="card">
        <h3 style="margin-bottom: 16px; font-size: 16px;">Accesos rápidos</h3>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <a routerLink="/simulation/new" class="btn btn-primary">Nueva simulación</a>
          <a routerLink="/clients" class="btn btn-outline">Registrar cliente</a>
          <a routerLink="/vehicles" class="btn btn-outline">Registrar vehículo</a>
          <a routerLink="/entities" class="btn btn-outline">Gestionar costos financieros</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stats-card { padding: 20px; }
    .stat-label { font-size: 13px; color: var(--text-muted); margin-bottom: 4px; }
    .stat-value { font-size: 28px; font-weight: 700; color: var(--text); }
  `]
})
export class DashboardComponent {
  svc = inject(DashboardService);
  stats = signal({ totalSimulations: 0, totalClients: 0, totalVehicles: 0, totalEntities: 0 });

  constructor() {
    this.svc.getStats().subscribe(data => this.stats.set(data));
  }
}
