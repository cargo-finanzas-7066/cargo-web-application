import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PageContainerComponent } from '../../shared/components/page-container/page-container.component';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [PageContainerComponent, RouterModule, FormsModule],
  template: `
    <app-page-container>
      <section class="help-page">
        <header class="help-header">
          <div>
            <span class="eyebrow">Ayuda y asistencia técnica</span>
            <h1>Centro de Ayuda</h1>
            <p>
              Resuelve dudas, revisa conceptos financieros o reporta inconvenientes relacionados
              con la simulación de créditos vehiculares.
            </p>
          </div>
          <a routerLink="/simulation/new" class="back-link">
            <svg viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/><path d="M20 12H9"/></svg>
            Volver al simulador
          </a>
        </header>

        <div class="search-card">
          <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input
            type="search"
            [ngModel]="searchTerm()"
            (ngModelChange)="searchTerm.set($event)"
            placeholder="Buscar una pregunta o tema..."
          />
        </div>

        <div class="content-grid">
          <section class="faq-card">
            <div class="section-title">
              <span class="section-icon">
                <svg viewBox="0 0 24 24"><path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/></svg>
              </span>
              <div>
                <h2>Preguntas frecuentes</h2>
                <p>Consulta respuestas rápidas sobre el cálculo y lectura del cronograma.</p>
              </div>
            </div>

            <div class="accordion">
              @for (faq of filteredFaqs(); track faq.question; let index = $index) {
                <article class="faq-item" [class.open]="openFaq() === index">
                  <button type="button" class="faq-question" (click)="toggleFaq(index)">
                    <span>{{ faq.question }}</span>
                    <svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
                  </button>
                  @if (openFaq() === index) {
                    <p class="faq-answer">{{ faq.answer }}</p>
                  }
                </article>
              } @empty {
                <div class="empty-state">
                  <strong>No encontramos coincidencias</strong>
                  <span>Prueba con “cuota”, “COK”, “cronograma” o “cuota inicial”.</span>
                </div>
              }
            </div>
          </section>

          <aside class="side-stack">
            <article class="action-card manual-card">
              <span class="card-icon">
                <svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z"/></svg>
              </span>
              <h3>Manual de Usuario</h3>
              <p>
                Revisa la guía de uso del simulador, desde el registro de datos hasta la
                interpretación del VAN, TIR, TCEA y cronograma.
              </p>
              <button type="button" class="primary-action">Ver Manual</button>
            </article>

            <article class="action-card contact-card">
              <span class="card-icon">
                <svg viewBox="0 0 24 24"><path d="M22 16.9V19a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 3.2 2 2 0 0 1 4.1 1h2.1a2 2 0 0 1 2 1.7l.3 2a2 2 0 0 1-.6 1.8L6.9 7.6a16 16 0 0 0 6 6l1.1-1.1a2 2 0 0 1 1.8-.6l2 .3a2 2 0 0 1 1.7 2z"/></svg>
              </span>
              <h3>Contacto</h3>
              <dl>
                <div>
                  <dt>Correo de soporte</dt>
                  <dd>soporte&#64;cargo.pe</dd>
                </div>
                <div>
                  <dt>Horario de atención</dt>
                  <dd>Lunes a viernes, 9:00 a.m. - 6:00 p.m.</dd>
                </div>
              </dl>
              <button type="button" class="ghost-action">Contactar soporte</button>
            </article>
          </aside>
        </div>

        <section class="report-card">
          <div class="section-title">
            <span class="section-icon danger">
              <svg viewBox="0 0 24 24"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
            </span>
            <div>
              <h2>Reportar un problema</h2>
              <p>Cuéntanos qué ocurrió para revisar el caso y ayudarte con mayor precisión.</p>
            </div>
          </div>

          <form class="report-form">
            <div class="form-group">
              <label for="subject">Asunto</label>
              <input id="subject" type="text" placeholder="Ej. El cronograma no coincide con mi simulación" />
            </div>
            <div class="form-group">
              <label for="description">Descripción del problema</label>
              <textarea id="description" rows="5" placeholder="Describe el inconveniente, los datos usados y el resultado esperado..."></textarea>
            </div>
            <div class="form-row">
              <label class="file-upload">
                <svg viewBox="0 0 24 24"><path d="M21.4 11.6 12 21a6 6 0 0 1-8.5-8.5l9.4-9.4a4 4 0 0 1 5.7 5.7l-9.4 9.4a2 2 0 1 1-2.8-2.8l8.7-8.7"/></svg>
                <span>Adjuntar captura <small>(opcional)</small></span>
                <input type="file" accept="image/*" />
              </label>
              <button type="button" class="primary-action submit-action">Enviar reporte</button>
            </div>
          </form>
        </section>

        <div class="bottom-actions">
          <a routerLink="/simulation/new" class="secondary-action">Volver al simulador</a>
        </div>
      </section>
    </app-page-container>
  `,
  styles: [`
    .help-page { display:flex; flex-direction:column; gap:22px; padding-bottom:12px; }
    .help-header { display:flex; justify-content:space-between; align-items:flex-start; gap:24px; }
    .help-header h1 { margin:6px 0 8px; color:#0f172a; font-size:34px; line-height:1.05; letter-spacing:-.045em; }
    .help-header p { max-width:760px; margin:0; color:#64748b; font-size:14px; line-height:1.65; }
    .eyebrow { color:#2948bd; font-size:11px; font-weight:900; text-transform:uppercase; letter-spacing:.14em; }
    .back-link, .secondary-action { display:inline-flex; align-items:center; justify-content:center; gap:8px; height:42px; padding:0 15px; border-radius:12px; color:#2948bd; background:#eef4ff; border:1px solid #dbe7ff; font-size:13px; font-weight:900; text-decoration:none; white-space:nowrap; }
    .back-link svg { width:17px; height:17px; fill:none; stroke:currentColor; stroke-width:2; stroke-linecap:round; stroke-linejoin:round; }
    .search-card { height:64px; display:flex; align-items:center; gap:14px; padding:0 20px; border-radius:18px; background:#fff; border:1px solid #dfe7f3; box-shadow:0 12px 28px rgba(15,23,42,.06); }
    .search-card svg { width:22px; height:22px; color:#2948bd; fill:none; stroke:currentColor; stroke-width:2; stroke-linecap:round; stroke-linejoin:round; }
    .search-card input { width:100%; border:0; outline:0; color:#0f172a; font-size:15px; background:transparent; }
    .search-card input::placeholder { color:#94a3b8; }
    .content-grid { display:grid; grid-template-columns:minmax(0, 1.5fr) minmax(310px, .8fr); gap:18px; align-items:start; }
    .faq-card, .action-card, .report-card { background:#fff; border:1px solid #dfe7f3; border-radius:18px; box-shadow:0 10px 24px rgba(15,23,42,.05); }
    .faq-card { padding:24px; }
    .section-title { display:flex; gap:14px; align-items:flex-start; margin-bottom:18px; }
    .section-title h2 { margin:0 0 5px; color:#0f172a; font-size:22px; letter-spacing:-.035em; }
    .section-title p { margin:0; color:#64748b; font-size:13px; line-height:1.55; }
    .section-icon, .card-icon { display:grid; place-items:center; flex:0 0 auto; border-radius:13px; background:#eef4ff; color:#2948bd; }
    .section-icon { width:44px; height:44px; }
    .card-icon { width:46px; height:46px; margin-bottom:16px; }
    .section-icon.danger { color:#b45309; background:#fff7ed; }
    .section-icon svg, .card-icon svg, .file-upload svg { width:22px; height:22px; fill:none; stroke:currentColor; stroke-width:2; stroke-linecap:round; stroke-linejoin:round; }
    .accordion { display:flex; flex-direction:column; gap:10px; }
    .faq-item { overflow:hidden; border:1px solid #e5edf8; border-radius:14px; background:#f8fbff; transition:border-color .16s, background .16s; }
    .faq-item.open { background:#fff; border-color:#bcd0ff; }
    .faq-question { width:100%; min-height:56px; display:flex; align-items:center; justify-content:space-between; gap:16px; padding:0 16px; border:0; background:transparent; color:#0f172a; font-size:14px; font-weight:900; text-align:left; cursor:pointer; }
    .faq-question svg { width:18px; height:18px; flex:0 0 auto; fill:none; stroke:#2948bd; stroke-width:2; stroke-linecap:round; stroke-linejoin:round; transition:transform .16s; }
    .faq-item.open .faq-question svg { transform:rotate(180deg); }
    .faq-answer { margin:0; padding:0 16px 18px; color:#64748b; font-size:13px; line-height:1.65; }
    .empty-state { display:flex; flex-direction:column; gap:4px; padding:20px; border-radius:14px; color:#64748b; background:#f8fafc; }
    .empty-state strong { color:#0f172a; }
    .side-stack { display:flex; flex-direction:column; gap:18px; }
    .action-card { padding:22px; }
    .manual-card { background:linear-gradient(135deg, #ffffff 0%, #f4f7ff 100%); }
    .action-card h3 { margin:0 0 9px; color:#0f172a; font-size:18px; letter-spacing:-.025em; }
    .action-card p { margin:0 0 18px; color:#64748b; font-size:13px; line-height:1.65; }
    .primary-action, .ghost-action { height:42px; display:inline-flex; align-items:center; justify-content:center; padding:0 16px; border-radius:11px; border:0; font-size:13px; font-weight:900; text-decoration:none; cursor:pointer; }
    .primary-action { color:#fff; background:#2948bd; box-shadow:0 10px 18px rgba(41,72,189,.18); }
    .ghost-action { color:#2948bd; background:#eef4ff; border:1px solid #dbe7ff; }
    .contact-card dl { display:flex; flex-direction:column; gap:12px; margin:0 0 18px; }
    .contact-card dt { color:#64748b; font-size:11px; font-weight:900; text-transform:uppercase; letter-spacing:.08em; }
    .contact-card dd { margin:4px 0 0; color:#0f172a; font-size:13px; font-weight:800; }
    .report-card { padding:24px; }
    .report-form { display:flex; flex-direction:column; gap:16px; }
    .form-group { display:flex; flex-direction:column; gap:8px; }
    .form-group label { color:#334155; font-size:12px; font-weight:900; text-transform:uppercase; letter-spacing:.08em; }
    .form-group input, .form-group textarea { width:100%; border:1px solid #dbe4f0; border-radius:12px; background:#f8fbff; color:#0f172a; font:inherit; font-size:14px; outline:0; transition:border-color .16s, box-shadow .16s, background .16s; }
    .form-group input { height:44px; padding:0 14px; }
    .form-group textarea { padding:13px 14px; resize:vertical; min-height:124px; }
    .form-group input:focus, .form-group textarea:focus { border-color:#2948bd; box-shadow:0 0 0 3px rgba(41,72,189,.12); background:#fff; }
    .form-row { display:flex; justify-content:space-between; align-items:center; gap:14px; flex-wrap:wrap; }
    .file-upload { min-height:42px; display:inline-flex; align-items:center; gap:10px; padding:0 14px; border-radius:11px; color:#2948bd; background:#eef4ff; border:1px dashed #9db4ff; font-size:13px; font-weight:900; cursor:pointer; }
    .file-upload small { color:#64748b; font-weight:700; }
    .file-upload input { display:none; }
    .submit-action { min-width:148px; }
    .bottom-actions { display:flex; justify-content:center; padding-top:2px; }
    @media (max-width:980px) {
      .help-header { flex-direction:column; }
      .content-grid { grid-template-columns:1fr; }
      .side-stack { grid-row:auto; }
    }
    @media (max-width:640px) {
      .help-header h1 { font-size:28px; }
      .faq-card, .action-card, .report-card { padding:18px; }
      .search-card { height:58px; }
      .form-row { align-items:stretch; flex-direction:column; }
      .file-upload, .submit-action { width:100%; justify-content:center; }
    }
  `],
})
export class HelpComponent {
  searchTerm = signal('');
  openFaq = signal(0);

  faqs = [
    {
      question: '¿Cómo se calcula la cuota mensual?',
      answer: 'La cuota mensual se obtiene con el método francés usando el capital financiado, la TEM derivada de la TEA, el plazo y las condiciones del crédito. Si existen seguros, se muestran aparte como parte de la cuota final.',
    },
    {
      question: '¿Qué es el COK?',
      answer: 'El COK es el costo de oportunidad del capital. En el simulador se usa como tasa de descuento para evaluar los flujos base y calcular indicadores como el VAN.',
    },
    {
      question: '¿Cómo interpretar el cronograma de pagos?',
      answer: 'El cronograma separa saldo inicial, interés, amortización, seguros, cuota final, flujo final, flujo base y saldo final. Así puedes ver qué parte del pago cubre intereses y qué parte reduce la deuda.',
    },
    {
      question: '¿Qué sucede si modifico la cuota inicial?',
      answer: 'Al aumentar la cuota inicial, disminuye el capital financiado. Esto suele reducir intereses, seguros asociados al saldo y el monto de las cuotas. Si la reduces, ocurre lo contrario.',
    },
  ];

  filteredFaqs = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) return this.faqs;

    return this.faqs.filter((faq) =>
      faq.question.toLowerCase().includes(term) || faq.answer.toLowerCase().includes(term)
    );
  });

  toggleFaq(index: number) {
    this.openFaq.update((current) => current === index ? -1 : index);
  }
}
