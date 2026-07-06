import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../iam/services/api/auth.service';
import { PageContainerComponent } from '../../../../shared/components/page-container/page-container.component';
import { AnalyticsService } from '../../../services/api/analytics.service';
import { DashboardResponseDto } from '../../../models/dtos/dashboard-response.dto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CurrencyPipe, DecimalPipe, RouterLink, PageContainerComponent],
  template: `
    <app-page-container>
    <section class="dashboard-page">
      <div class="page-header">
        <div><h1>Hola, {{ firstName() }}</h1></div>
      </div>

      <div class="stats-grid">
        <article class="stat-card">
          <span class="stat-icon blue">▣</span>
          <span class="info-dot">ⓘ</span>
          <p>Simulaciones generadas</p>
          <strong>{{ dashboard().totalSimulations | number }}</strong>
        </article>
        <article class="stat-card">
          <span class="stat-icon green">♣</span>
          <span class="info-dot">ⓘ</span>
          <p>Clientes registrados</p>
          <strong>{{ dashboard().totalClients | number }}</strong>
        </article>
      </div>

      <section class="activity-card">
        <div class="section-heading">
          <h2>Actividad Reciente <span>ⓘ</span></h2>
          <a routerLink="/simulations">Ver todo</a>
        </div>
        <table>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Vehículo</th>
              <th>Entidad</th>
              <th>Capital<br>financiado</th>
              <th>TEA</th>
              <th>TCEA</th>
              <th>Cuota<br>mensual</th>
            </tr>
          </thead>
          <tbody>
            @for (item of dashboard().recentActivities; track item.client) {
              <tr>
                <td class="client-name">{{ item.client }}</td>
                <td>{{ item.vehicle }}</td>
                <td>{{ item.financialInstitution }}</td>
                <td>{{ item.financedAmount | currency:'S/ ':'symbol':'1.2-2' }}</td>
                <td>{{ item.tea | number:'1.2-2' }}%</td>
                <td>{{ item.tcea | number:'1.2-2' }}%</td>
                <td>{{ item.monthlyPayment | currency:'S/ ':'symbol':'1.2-2' }}</td>
              </tr>
            }
          </tbody>
        </table>
      </section>

      <section class="vehicles-section">
        <div class="vehicles-heading">
          <h2>Vehículos referenciales recientes</h2>
          <div class="slider-actions"><button>‹</button><button>›</button></div>
        </div>
        <div class="vehicle-strip">
          @for (vehicle of dashboard().recentVehicles; track vehicle.id) {
            <article class="recent-vehicle">
              <img [src]="vehicle.imageUrl || fallbackImage" [alt]="vehicle.brand + ' ' + vehicle.model">
              <div>
                <h3>{{ vehicle.brand }} {{ vehicle.model }}</h3>
                <p>Valor referencial: {{ vehicle.price | currency:'S/ ':'symbol':'1.2-2' }}</p>
              </div>
            </article>
          }
        </div>
      </section>
    </section>
    </app-page-container>
  `,
  styles: [`
    .stats-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; margin-bottom: 24px; }
    .stat-card { position: relative; min-height: 150px; padding: 28px; border: 1px solid #d9e0ea; border-radius: 8px; background: #fff; box-shadow: 0 1px 2px rgba(15,23,42,.03); }
    .stat-icon { display: grid; place-items: center; width: 46px; height: 46px; border-radius: 5px; font-weight: 800; margin-bottom: 18px; }
    .stat-icon.blue { color: #2348c5; background: #eef4ff; }
    .stat-icon.green { color: #087a3d; background: #edfff6; }
    .info-dot { position: absolute; top: 24px; right: 22px; color: #7890b4; font-size: 14px; }
    .stat-card p { color: #6b7280; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; margin-bottom: 4px; }
    .stat-card strong { color: #111827; font-size: 32px; line-height: 1; }
    .activity-card { overflow: hidden; border: 1px solid #d9e0ea; border-radius: 8px; background: #fff; margin-bottom: 54px; }
    .section-heading { display: flex; justify-content: space-between; align-items: center; padding: 20px 26px; border-bottom: 1px solid #edf1f6; }
    .section-heading h2, .vehicles-heading h2 { font-size: 21px; color: #111827; }
    .section-heading h2 span { color: #8191aa; font-size: 14px; }
    .section-heading a { color: #0036ad; font-weight: 800; font-size: 13px; }
    table { width: 100%; border-collapse: collapse; }
    th { padding: 16px 26px; background: #f8fafc; color: #6b7280; font-size: 11px; text-align: left; text-transform: none; letter-spacing: .08em; }
    td { padding: 18px 26px; border-top: 1px solid #eef1f6; color: #6b7280; font-size: 15px; }
    .client-name { color: #111827; font-weight: 700; }
    .vehicles-heading { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }
    .slider-actions { display: flex; gap: 10px; }
    .slider-actions button { width: 38px; height: 38px; border: 1px solid #d8e0eb; border-radius: 8px; background: #fff; color: #0f172a; font-size: 24px; cursor: pointer; }
    .vehicle-strip { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; }
    .recent-vehicle { position: relative; overflow: hidden; height: 184px; border-radius: 8px; background: #0f172a; color: #fff; }
    .recent-vehicle img { width: 100%; height: 100%; object-fit: cover; opacity: .82; }
    .recent-vehicle::after { content: ''; position: absolute; inset: 45% 0 0; background: linear-gradient(transparent, rgba(0,0,0,.88)); }
    .recent-vehicle div { position: absolute; z-index: 1; left: 24px; right: 16px; bottom: 20px; }
    .recent-vehicle h3 { font-size: 17px; margin-bottom: 4px; }
    .recent-vehicle p { color: #dce6f5; font-size: 13px; }
    @media (max-width: 900px) {
      .stats-grid, .vehicle-strip { grid-template-columns: 1fr; }
      .activity-card { overflow-x: auto; }
    }
  `],
})
export class DashboardComponent {
  private analyticsService = inject(AnalyticsService);
  private auth = inject(AuthService);
  firstName = computed(() => this.auth.currentUser()?.name?.split(' ')[0] || 'Usuario');
  fallbackImage = 'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=900&q=80';
  dashboard = signal<DashboardResponseDto>({
    totalSimulations: 0,
    totalClients: 0,
    recentActivities: [],
    recentVehicles: [],
  });

  constructor() {
    this.analyticsService.getDashboard().subscribe((dashboard) => this.dashboard.set(dashboard));
  }
}
