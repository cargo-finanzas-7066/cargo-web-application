import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/api/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <section class="auth-shell register-shell">
      <div class="auth-panel">
        <div class="brand">
          <span class="brand-mark">▣</span>
          <h1>CarGo</h1>
        </div>
        <p class="intro">Acceso a la plataforma de gestión crediticia vehicular institucional.</p>
        <h2>Crear cuenta institucional</h2>

        @if (error) {
          <div class="auth-alert">{{ error }}</div>
        }

        <form class="auth-form" (ngSubmit)="onRegister()">
          <label>
            <span>Nombres y apellidos</span>
            <input name="name" [(ngModel)]="name" placeholder="Ej. Juan Pérez García" autocomplete="name" required>
          </label>

          <label>
            <span>Correo electrónico</span>
            <input type="email" name="email" [(ngModel)]="email" placeholder="usuario@entidad.com.pe" autocomplete="email" required>
          </label>

          <div class="password-grid">
            <label>
              <span>Contraseña</span>
              <input type="password" name="password" [(ngModel)]="password" placeholder="••••••••" autocomplete="new-password" required>
            </label>
            <label>
              <span>Confirmación</span>
              <input type="password" name="confirmation" [(ngModel)]="confirmation" placeholder="••••••••" autocomplete="new-password" required>
            </label>
          </div>

          <button class="primary-action" type="submit" [disabled]="loading">
            {{ loading ? 'Creando cuenta...' : 'Registrarse →' }}
          </button>
        </form>

        <div class="divider"></div>
        <p class="switch-auth">¿Ya tienes una cuenta? <a routerLink="/login">Iniciar sesión</a></p>
      </div>

      <aside class="register-showcase">
        <div class="building-silhouette"></div>
        <div class="showcase-message">
          <h2>Optimice sus procesos de simulación crediticia.</h2>
          <p>Nuestra plataforma está diseñada para ofrecer precisión técnica y seguridad en cada cálculo de crédito vehicular.</p>
          <div class="glass-card">
            <span>▣</span>
            <div>
              <strong>Cálculos Avanzados</strong>
              <p>Algoritmos financieros ajustados a la normativa peruana vigente.</p>
            </div>
          </div>
        </div>
      </aside>
    </section>
  `,
  styles: [`
    .auth-shell { min-height: 100vh; display: grid; grid-template-columns: minmax(460px, 1fr) minmax(500px, 1fr); background: #fff; }
    .auth-panel { display: flex; flex-direction: column; justify-content: center; width: min(100%, 520px); padding: 56px 72px; margin: 0 auto; }
    .brand { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
    .brand-mark { width: 40px; height: 40px; display: grid; place-items: center; border-radius: 4px; background: #2948bd; color: #fff; }
    .brand h1 { font-size: 25px; line-height: 1; }
    .intro { max-width: 360px; color: #4b5563; font-size: 16px; line-height: 1.5; margin-bottom: 42px; }
    .auth-panel h2 { font-size: 18px; font-weight: 500; margin-bottom: 26px; }
    .auth-alert { background: #fee2e2; color: #b91c1c; padding: 10px 12px; border-radius: 6px; margin-bottom: 16px; }
    .auth-form { display: grid; gap: 22px; }
    label span { display: block; color: #4b5563; font-size: 14px; font-weight: 500; text-transform: uppercase; margin-bottom: 10px; }
    input { width: 100%; height: 50px; border: 1px solid #c9cfe1; border-radius: 6px; padding: 0 16px; color: #111827; background: #fff; }
    input:focus { outline: none; border-color: #2948bd; box-shadow: 0 0 0 3px rgba(41,72,189,.12); }
    .password-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
    .primary-action { height: 56px; border: 0; border-radius: 5px; background: #0036ad; color: #fff; font-size: 16px; font-weight: 600; box-shadow: 0 12px 18px rgba(0,54,173,.18); cursor: pointer; }
    .primary-action:disabled { opacity: .65; cursor: not-allowed; }
    .divider { height: 1px; background: #e5e7eb; margin: 32px 0; }
    .switch-auth { text-align: center; color: #4b5563; }
    .switch-auth a { font-weight: 700; }
    .register-showcase { position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 72px; background: #dfe7f6; }
    .building-silhouette { position: absolute; inset: 0; opacity: .42; background: linear-gradient(66deg, transparent 0 45%, rgba(255,255,255,.88) 45% 54%, transparent 54%), repeating-linear-gradient(88deg, transparent 0 14px, rgba(255,255,255,.62) 14px 18px); clip-path: polygon(50% 2%, 100% 100%, 0 100%); transform: scale(1.15); }
    .showcase-message { position: relative; max-width: 520px; color: #374151; }
    .showcase-message h2 { color: #1243c0; font-size: 17px; font-weight: 500; margin-bottom: 26px; }
    .showcase-message > p { font-size: 17px; line-height: 1.55; margin-bottom: 48px; }
    .glass-card { display: flex; align-items: center; gap: 18px; padding: 26px; border: 1px solid rgba(255,255,255,.8); border-radius: 14px; background: rgba(255,255,255,.58); box-shadow: 0 16px 34px rgba(31,41,55,.08); }
    .glass-card span { width: 42px; height: 42px; border-radius: 4px; display: grid; place-items: center; color: #1243c0; background: #cddcf8; }
    .glass-card strong { display: block; color: #1f2937; font-size: 17px; margin-bottom: 6px; }
    .glass-card p { line-height: 1.45; }
    @media (max-width: 900px) {
      .auth-shell { grid-template-columns: 1fr; }
      .auth-panel { padding: 40px 24px; }
      .register-showcase { min-height: 460px; padding: 40px 24px; }
      .password-grid { grid-template-columns: 1fr; }
    }
  `],
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  name = '';
  email = '';
  password = '';
  confirmation = '';
  loading = false;
  error = '';

  onRegister() {
    this.error = '';

    if (this.password !== this.confirmation) {
      this.error = 'La contraseña y su confirmación no coinciden.';
      return;
    }

    this.loading = true;
    this.auth.register({ name: this.name, email: this.email, password: this.password }).subscribe({
      next: (response) => {
        this.router.navigate(['/login'], { queryParams: { registered: response.user.email } });
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'No se pudo crear la cuenta institucional.';
        this.loading = false;
      },
    });
  }
}
