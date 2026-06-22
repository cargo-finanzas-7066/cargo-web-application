import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../iam/services/api/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="layout">
      <aside class="sidebar">
        <div class="sidebar-logo">
          <span class="logo-icon">
            <svg viewBox="0 0 24 24"><path d="M5 17h14l-1.4-6.2A3 3 0 0 0 14.7 8H9.3a3 3 0 0 0-2.9 2.8L5 17Z"/><circle cx="8" cy="17" r="1.3"/><circle cx="16" cy="17" r="1.3"/></svg>
          </span>
          <div>
            <span class="logo-text">CarGo</span>
            <span class="logo-subtitle">Crédito vehicular</span>
          </div>
        </div>
        <nav class="sidebar-nav">
          @for (item of menuItems; track item.path) {
            <a class="nav-item" [routerLink]="item.path" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: item.exact }">
              <span class="nav-icon" [innerHTML]="item.icon"></span>
              <span class="nav-label">{{ item.label }}</span>
            </a>
          }
        </nav>
      </aside>

      <div class="main">
        <header class="topbar">
          <span class="breadcrumb">{{ topbarTitle() }}</span>
          <div class="topbar-right">
            <span class="user-name">{{ auth.currentUser()?.name || 'Mery Espinoza' }}</span>
            <span class="avatar"></span>
            <button class="logout-button" (click)="auth.logout()" title="Cerrar sesión">
              <svg viewBox="0 0 24 24"><path d="M10 17l5-5-5-5"/><path d="M15 12H3"/><path d="M21 19V5"/></svg>
            </button>
          </div>
        </header>

        <main class="content">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [`
    .layout { display:flex; min-height:100vh; background:#f8fafc; }
    .sidebar { width:244px; flex-shrink:0; background:#101827; color:#fff; display:flex; flex-direction:column; }
    .sidebar-logo { height:102px; padding:24px 22px; display:flex; align-items:flex-start; gap:12px; border-bottom:1px solid rgba(255,255,255,.04); }
    .logo-icon { width:36px; height:36px; display:grid; place-items:center; border-radius:3px; background:#2948bd; color:#fff; }
    .logo-icon svg { width:20px; height:20px; fill:none; stroke:currentColor; stroke-width:2; stroke-linecap:round; stroke-linejoin:round; }
    .logo-text { display:block; font-size:23px; font-weight:900; line-height:1; letter-spacing:-.04em; }
    .logo-subtitle { display:block; margin-top:6px; color:#65a4ff; font-size:10px; font-weight:900; text-transform:uppercase; letter-spacing:.12em; }
    .sidebar-nav { padding-top:22px; flex:1; display:flex; flex-direction:column; gap:4px; }
    .nav-item { position:relative; display:flex; align-items:center; gap:12px; height:44px; padding:0 24px; color:#9aa7ba; transition:all .15s; font-size:14px; font-weight:500; }
    .nav-item:hover { color:#fff; background:rgba(255,255,255,.04); }
    .nav-item.active { color:#fff; background:#15223c; font-weight:900; }
    .nav-item.active::before { content:''; position:absolute; left:0; top:0; bottom:0; width:4px; background:#2948bd; }
    .nav-icon { width:22px; display:grid; place-items:center; color:inherit; }
    .nav-icon svg, .logout-button svg { width:18px; height:18px; fill:none; stroke:currentColor; stroke-width:2; stroke-linecap:round; stroke-linejoin:round; }
    .main { flex:1; display:flex; flex-direction:column; min-width:0; }
    .topbar { height:60px; display:flex; align-items:center; justify-content:space-between; padding:0 38px 0 32px; background:#fff; border:1px solid #e4e9f1; border-left:0; }
    .breadcrumb { color:#111827; font-size:16px; }
    .topbar-right { height:100%; display:flex; align-items:center; gap:14px; padding-left:66px; border-left:1px solid #edf1f6; }
    .user-name { color:#0f172a; font-size:13px; font-weight:900; }
    .avatar { width:34px; height:34px; border-radius:50%; background:linear-gradient(135deg, #1f2937, #d6b08c); box-shadow:inset 0 0 0 2px #fff; }
    .logout-button { border:0; background:transparent; color:#6b7b93; cursor:pointer; display:grid; place-items:center; }
    .content { flex:1; padding:36px 30px 0; overflow-y:auto; }
    .content::after { content:'© 2026 CarGo Perú. Todos los derechos reservados.'; display:block; margin-top:70px; padding:22px 0; color:#9aa3af; font-size:11px; border-top:1px solid #e5e7eb; }
    @media (max-width:800px) {
      .layout { flex-direction:column; }
      .sidebar { width:100%; }
      .sidebar-logo { height:auto; }
      .sidebar-nav { padding:8px; }
      .topbar { padding:0 18px; }
      .topbar-right { padding-left:18px; }
      .content { padding:24px 16px 0; }
    }
  `],
})
export class LayoutComponent {
  auth = inject(AuthService);
  private router = inject(Router);

  menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '<svg viewBox="0 0 24 24"><path d="M4 4h6v6H4z"/><path d="M14 4h6v6h-6z"/><path d="M4 14h6v6H4z"/><path d="M14 14h6v6h-6z"/></svg>', exact: true },
    { path: '/simulations', label: 'Simulaciones', icon: '<svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v6h6"/></svg>', exact: false },
    { path: '/vehicles', label: 'Vehículos', icon: '<svg viewBox="0 0 24 24"><path d="M5 17h14l-1.5-5h-11L5 17Z"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>', exact: false },
    { path: '/clients', label: 'Clientes', icon: '<svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-8 0v2"/><circle cx="12" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>', exact: false },
    { path: '/entities', label: 'Entidades y costos', icon: '<svg viewBox="0 0 24 24"><path d="M3 21h18"/><path d="M5 21V10h14v11"/><path d="M2 10l10-7 10 7"/></svg>', exact: false },
    { path: '/config', label: 'Configuración', icon: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21h-4v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3v-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1L7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V3h4v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.1v4H21a1.7 1.7 0 0 0-1.6 1Z"/></svg>', exact: false },
  ];

  topbarTitle() {
    const url = this.router.url;
    if (url.startsWith('/entities')) return 'Entidades y costos';
    if (url.startsWith('/clients')) return 'Gestión de Clientes';
    if (url.startsWith('/vehicles')) return 'Catálogo de vehículos';
    if (url.startsWith('/simulation/new')) return 'Simulaciones › Nueva simulación';
    if (url.startsWith('/results')) return 'Simulaciones › Resultado';
    if (url.startsWith('/simulations')) return 'Simulaciones guardadas';
    return 'Dashboard / Principal';
  }
}
