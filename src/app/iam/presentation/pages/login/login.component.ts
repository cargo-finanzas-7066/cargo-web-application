import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/api/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <section class="auth-shell login-shell">
      <div class="auth-panel">
        <div class="brand">
          <span class="brand-mark">▣</span>
          <div>
            <h1>CarGo</h1>
            <p>Simulador de créditos vehiculares</p>
          </div>
        </div>

        @if (error) {
          <div class="auth-alert">Correo electrónico o contraseña incorrectos.</div>
        }

        <form class="auth-form" (ngSubmit)="onLogin()">
          <label>
            <span>Correo electrónico</span>
            <input type="email" name="email" [(ngModel)]="email" placeholder="ejemplo@cargo.com.pe" autocomplete="email" required>
          </label>

          <label>
            <span>Contraseña</span>
            <div class="password-field">
              <input [type]="showPassword ? 'text' : 'password'" name="password" [(ngModel)]="password" placeholder="••••••••" autocomplete="current-password" required>
              <button type="button" (click)="showPassword = !showPassword" aria-label="Mostrar u ocultar contraseña">◉</button>
            </div>
          </label>

          <button class="primary-action" type="submit" [disabled]="loading">
            {{ loading ? 'Ingresando...' : 'Ingresar' }}
          </button>
        </form>

        <p class="switch-auth">¿No tienes una cuenta? <a routerLink="/register">Regístrate aquí</a></p>
        <p class="legal">© 2026 CarGo Perú. Todos los derechos reservados.<br>Plataforma institucional para entidades financieras autorizadas.</p>
      </div>

      <aside class="auth-showcase login-showcase">
        <div class="vehicle-card">
          <div class="vehicle-image">
            <div class="vehicle-label">CarGo<br><small>crédito vehicular</small></div>
            <div class="vehicle-shape"></div>
          </div>
        </div>

        <div class="showcase-copy">
          <h2>Simula créditos vehiculares con claridad</h2>
          <p>Calcula cuotas, cronogramas, VAN, TIR y TCEA bajo el método francés.</p>

          <div class="feature-row">
            <strong>▦ Plan de pagos automático</strong>
            <span>Genera cronogramas bajo método francés vencido ordinario.</span>
          </div>
          <div class="feature-row">
            <strong class="green">▣ Indicadores financieros</strong>
            <span>Visualiza VAN, TIR, TCEA, TEA y TEM de cada simulación.</span>
          </div>
        </div>
      </aside>
    </section>
  `,
  styles: [`
    .auth-shell { min-height: 100vh; display: grid; grid-template-columns: minmax(420px, 1fr) minmax(520px, 1fr); background: #fff; }
    .auth-panel { display: flex; flex-direction: column; justify-content: center; width: min(100%, 500px); padding: 56px 72px; margin: 0 auto; }
    .brand { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
    .brand-mark { width: 36px; height: 36px; border-radius: 4px; display: grid; place-items: center; background: #2948bd; color: #fff; font-size: 17px; }
    .brand h1 { font-size: 28px; line-height: 1; margin-bottom: 8px; }
    .brand p { color: #4b5563; font-size: 15px; }
    .auth-alert { background: #fee2e2; color: #b91c1c; padding: 10px 12px; border-radius: 6px; margin: 8px 0 14px; }
    .auth-form { display: grid; gap: 16px; }
    label span { display: block; color: #4b5563; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .04em; margin-bottom: 7px; }
    input { width: 100%; height: 44px; border: 1px solid #c9cfe1; border-radius: 6px; padding: 0 14px; color: #111827; background: #f7f7ff; }
    input:focus { outline: none; border-color: #2948bd; box-shadow: 0 0 0 3px rgba(41,72,189,.12); }
    .password-field { position: relative; }
    .password-field input { padding-right: 46px; }
    .password-field button { position: absolute; right: 8px; top: 50%; transform: translateY(-50%); width: 32px; height: 32px; border: 0; background: transparent; color: #6b7280; cursor: pointer; }
    .primary-action { height: 48px; margin-top: 2px; border: 0; border-radius: 5px; background: #2948bd; color: #fff; font-weight: 700; box-shadow: 0 8px 16px rgba(41,72,189,.22); cursor: pointer; }
    .primary-action:disabled { opacity: .65; cursor: not-allowed; }
    .switch-auth { text-align: center; margin-top: 18px; color: #4b5563; }
    .switch-auth a { font-weight: 700; }
    .legal { margin-top: 56px; color: #7b8191; font-size: 11px; text-align: center; line-height: 1.5; }
    .auth-showcase { position: relative; overflow: hidden; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px 56px; background: #e4f5ff; }
    .auth-showcase::before, .auth-showcase::after { content: ''; position: absolute; border: 4px solid rgba(88,141,211,.22); border-radius: 9px; }
    .auth-showcase::before { width: 230px; height: 230px; top: 64px; right: 70px; }
    .auth-showcase::after { width: 340px; height: 340px; bottom: 70px; left: 36px; }
    .vehicle-card { position: relative; z-index: 1; width: 316px; padding: 24px; border-radius: 8px; background: rgba(255,255,255,.72); box-shadow: 0 16px 28px rgba(15,23,42,.18); }
    .vehicle-image { position: relative; height: 230px; border-radius: 8px; overflow: hidden; border: 4px solid #fff; background: linear-gradient(180deg, #173044 0%, #0f2434 45%, #222831 45%, #111827 100%); }
    .vehicle-label { position: absolute; top: 18px; left: 0; right: 0; color: #fff; text-align: center; font-weight: 800; font-size: 12px; }
    .vehicle-shape { position: absolute; left: 38px; right: 38px; bottom: 66px; height: 48px; border-radius: 56px 56px 14px 14px; background: linear-gradient(90deg, #cbd5e1, #f8fafc); box-shadow: 22px 38px 0 -26px #020617, 138px 38px 0 -26px #020617; }
    .showcase-copy { position: relative; z-index: 1; width: min(100%, 480px); margin-top: 42px; text-align: center; }
    .showcase-copy h2 { color: #003f9e; font-size: 30px; line-height: 1.2; margin-bottom: 18px; }
    .showcase-copy > p { color: #4b5563; line-height: 1.45; margin-bottom: 22px; }
    .feature-row { text-align: left; padding: 16px; border-radius: 7px; background: rgba(255,255,255,.86); margin-top: 16px; }
    .feature-row strong { display: block; color: #003f9e; font-size: 12px; text-transform: uppercase; letter-spacing: .04em; margin-bottom: 8px; }
    .feature-row .green { color: #047857; }
    .feature-row span { color: #1f2937; }
    @media (max-width: 900px) {
      .auth-shell { grid-template-columns: 1fr; }
      .auth-panel { padding: 40px 24px; }
      .auth-showcase { min-height: 520px; }
    }
  `],
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  showPassword = false;
  loading = false;
  error = false;

  onLogin() {
    this.error = false;
    this.loading = true;

    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        this.auth.setSession(response);
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.error = true;
        this.loading = false;
      },
    });
  }
}
