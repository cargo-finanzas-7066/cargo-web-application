import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../iam/services/api/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="layout">
      <aside class="sidebar">
        <div class="sidebar-logo">
          <span class="logo-icon">▣</span>
          <div>
            <span class="logo-text">CarGo</span>
            <span class="logo-subtitle">Crédito vehicular</span>
          </div>
        </div>
        <nav class="sidebar-nav">
          @for (item of menuItems; track item.path) {
            <a class="nav-item" [routerLink]="item.path" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: item.exact }">
              <span class="nav-icon">{{ item.icon }}</span>
              <span class="nav-label">{{ item.label }}</span>
            </a>
          }
        </nav>
      </aside>

      <div class="main">
        <header class="topbar">
          <span class="breadcrumb">Dashboard / Principal</span>
          <div class="topbar-right">
            <span class="user-name">{{ auth.currentUser()?.name || 'Mery Espinoza' }}</span>
            <span class="avatar"></span>
            <button class="logout-button" (click)="auth.logout()" title="Cerrar sesión">↪</button>
          </div>
        </header>

        <main class="content">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [`
    .layout { display: flex; min-height: 100vh; background: #f8fafc; }
    .sidebar { width: 244px; background: #101827; color: #fff; display: flex; flex-direction: column; flex-shrink: 0; }
    .sidebar-logo { height: 102px; padding: 24px 22px; display: flex; align-items: flex-start; gap: 12px; border-bottom: 1px solid rgba(255,255,255,.04); }
    .logo-icon { width: 36px; height: 36px; display: grid; place-items: center; border-radius: 3px; background: #2948bd; color: #fff; font-size: 16px; }
    .logo-text { display: block; font-size: 23px; font-weight: 800; line-height: 1; letter-spacing: -.4px; }
    .logo-subtitle { display: block; margin-top: 6px; color: #65a4ff; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .12em; }
    .sidebar-nav { padding-top: 22px; flex: 1; display: flex; flex-direction: column; gap: 4px; }
    .nav-item { position: relative; display: flex; align-items: center; gap: 12px; height: 44px; padding: 0 24px; color: #9aa7ba; transition: all .15s; font-size: 14px; font-weight: 500; }
    .nav-item:hover { color: #fff; background: rgba(255,255,255,.04); }
    .nav-item.active { color: #fff; background: #15223c; font-weight: 800; }
    .nav-item.active::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: #2948bd; }
    .nav-icon { width: 22px; color: inherit; font-size: 17px; text-align: center; }
    .main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
    .topbar { height: 60px; display: flex; align-items: center; justify-content: space-between; padding: 0 38px 0 32px; background: #fff; border: 1px solid #e4e9f1; border-left: 0; }
    .breadcrumb { color: #9aa7ba; font-size: 13px; }
    .topbar-right { height: 100%; display: flex; align-items: center; gap: 14px; padding-left: 66px; border-left: 1px solid #edf1f6; }
    .user-name { color: #0f172a; font-size: 13px; font-weight: 800; }
    .avatar { width: 34px; height: 34px; border-radius: 50%; background: linear-gradient(135deg, #1f2937, #d6b08c); box-shadow: inset 0 0 0 2px #fff; }
    .logout-button { border: 0; background: transparent; color: #6b7b93; font-size: 22px; cursor: pointer; }
    .content { flex: 1; padding: 36px 30px 0; overflow-y: auto; }
    .content::after { content: '© 2026 CarGo Perú. Todos los derechos reservados.'; display: block; margin-top: 70px; padding: 22px 0; color: #9aa3af; font-size: 11px; border-top: 1px solid #e5e7eb; }
    @media (max-width: 800px) {
      .layout { flex-direction: column; }
      .sidebar { width: 100%; }
      .sidebar-logo { height: auto; }
      .sidebar-nav { padding: 8px; }
      .topbar { padding: 0 18px; }
      .topbar-right { padding-left: 18px; }
      .content { padding: 24px 16px 0; }
    }
  `],
})
export class LayoutComponent {
  auth = inject(AuthService);
  menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '▦', exact: true },
    { path: '/simulations', label: 'Simulaciones', icon: '↶', exact: false },
    { path: '/vehicles', label: 'Vehículos', icon: '▱', exact: false },
    { path: '/clients', label: 'Clientes', icon: '♣', exact: false },
    { path: '/entities', label: 'Entidades y costos', icon: '▰', exact: false },
    { path: '/config', label: 'Configuración', icon: '⚙', exact: false },
  ];
}
