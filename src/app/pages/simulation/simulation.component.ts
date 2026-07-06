import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CustomerDto } from '../../customers/models/dtos/customer.dto';
import { CustomerService } from '../../customers/services/api/customer.service';
import { FinancialInstitutionDto } from '../../financial-institutions/models/dtos/financial-institution.dto';
import { FinancialInstitutionService } from '../../financial-institutions/services/api/financial-institution.service';
import { FinancialProductDto } from '../../financial-products/models/dtos/financial-product.dto';
import { FinancialProductService } from '../../financial-products/services/api/financial-product.service';
import { GraceType, SimulationRequestDto } from '../../simulations/models/dtos/simulation-request.dto';
import { SimulationService } from '../../simulations/services/api/simulation.service';
import { PageContainerComponent } from '../../shared/components/page-container/page-container.component';
import { VehicleDto } from '../../vehicles/models/dtos/vehicle.dto';
import { VehicleCatalogService } from '../../vehicles/services/api/vehicle-catalog.service';

@Component({
  selector: 'app-simulation',
  standalone: true,
  imports: [FormsModule, RouterLink, DecimalPipe, PageContainerComponent],
  template: `
    <app-page-container>
    <section class="simulation-page">
      <div class="crumb">Simulaciones › <strong>Nueva simulación</strong></div>

      @if (step() === 1) {
        <header class="step-head">
          <h1>Paso 1: Cliente, vehículo y producto</h1>
          <p>Seleccione el solicitante, registre el vehículo de interés y elija el producto financiero para iniciar el cálculo.</p>
        </header>
      }
      @if (step() === 2) {
        <header class="step-head">
          <h1>Paso 2: Condiciones del crédito</h1>
          <p>Defina la cuota inicial, plazo y periodo de gracia para calcular el cronograma.</p>
        </header>
      }
      @if (step() === 3) {
        <header class="step-head">
          <h1>Paso 3: Compra inteligente y confirmación</h1>
          <p>Revise las condiciones del producto antes de generar el cronograma de pagos.</p>
        </header>
      }

      <div class="stepper">
        <div class="step-item" [class.active]="step() === 1" [class.done]="step() > 1">
          <span>{{ step() > 1 ? '✓' : '01' }}</span>
          <strong>Cliente, vehículo<br />y producto</strong>
        </div>
        <div class="line" [class.done]="step() > 1"></div>
        <div class="step-item" [class.active]="step() === 2" [class.done]="step() > 2">
          <span>{{ step() > 2 ? '✓' : '02' }}</span>
          <strong>Condiciones<br />del crédito</strong>
        </div>
        <div class="line" [class.done]="step() > 2"></div>
        <div class="step-item" [class.active]="step() === 3">
          <span>03</span>
          <strong>Compra inteligente<br />y confirmación</strong>
        </div>
      </div>

      @if (step() === 1) {
        <section class="step-body">
          <div class="section-title">
            <h2>
              <svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-8 0v2"/><circle cx="12" cy="7" r="4"/></svg>
              Información del Cliente
            </h2>
          </div>
          <div class="panel">
            <div class="search-row">
              <input [(ngModel)]="clientQuery" placeholder="Buscar por DNI, CE o nombre..." />
              <span>ⓘ</span>
            </div>
            <table class="mini-table">
              <thead><tr><th>Documento</th><th>Nombre completo</th><th>Acción</th></tr></thead>
              <tbody>
                @for (client of filteredClients(); track client.id ?? client.docNumber) {
                  <tr>
                    <td>{{ client.docNumber }}</td>
                    <td>{{ client.names }} {{ client.surnames }}</td>
                    <td><button type="button" (click)="selectClient(client)">Seleccionar</button></td>
                  </tr>
                }
              </tbody>
            </table>
            @if (selectedClient(); as client) {
              <div class="selected-card">
                <div class="person-icon">
                  <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-8 0v2"/><circle cx="16" cy="7" r="4"/></svg>
                </div>
                <div>
                  <h3>{{ client.names }} {{ client.surnames }}</h3>
                  <p>DNI {{ client.docNumber }} &nbsp; {{ client.email }} &nbsp; {{ client.phone }}</p>
                </div>
                <div class="card-note">ⓘ Los datos del cliente se usarán para guardar y consultar la simulación.</div>
              </div>
            }
          </div>

          <div class="section-title spaced">
            <h2>
              <svg viewBox="0 0 24 24"><path d="M5 17h14l-1.5-5h-11L5 17Z"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>
              Vehículo referencial
            </h2>
            <a routerLink="/vehicles" class="link-button">Ver catálogo de vehículos ↗</a>
          </div>
          <div class="panel">
            <label class="label">Seleccionar vehículo</label>
            <select [(ngModel)]="request.vehicleId" (ngModelChange)="onVehicleChange()">
              <option [ngValue]="0">Buscar por marca, modelo, versión o año...</option>
              @for (vehicle of vehicles(); track vehicle.id) {
                <option [ngValue]="vehicle.id">{{ vehicle.brand }} {{ vehicle.model }} {{ vehicle.year }}</option>
              }
            </select>
            @if (selectedVehicle(); as vehicle) {
              <div class="vehicle-picked">
                <div class="image-placeholder">
                  @if (vehicle.imageUrl) {
                    <img [src]="vehicle.imageUrl" alt="" />
                  } @else {
                    <svg viewBox="0 0 24 24"><path d="M3 17h18l-2-6H5l-2 6Z"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>
                  }
                </div>
                <div>
                  <h3>{{ vehicle.brand }} {{ vehicle.model }} {{ vehicle.year }}</h3>
                  <small>Concesionario</small>
                  <strong>{{ vehicle.dealer }}</strong>
                </div>
                <div class="amount">
                  <small>Valor referencial</small>
                  <strong>{{ vehicle.currency }} {{ vehicle.price | number:'1.2-2' }}</strong>
                </div>
              </div>
            }
          </div>

          <div class="section-title spaced">
            <h2>
              <svg viewBox="0 0 24 24"><path d="M3 21h18"/><path d="M5 21V10h14v11"/><path d="M2 10l10-7 10 7"/></svg>
              Producto financiero
            </h2>
          </div>
          <div class="entity-panel">
            <div>
              <label class="label">Producto financiero</label>
              <select [(ngModel)]="request.financialProductId" (ngModelChange)="onProductChange()">
                <option [ngValue]="0">Seleccione producto</option>
                @for (product of products(); track product.id) {
                  <option [ngValue]="product.id">{{ institutionName(product.financialInstitutionId) }} — {{ product.productName }}</option>
                }
              </select>
              <div class="warning">△ Las condiciones se toman del producto financiero vigente y pueden variar según evaluación crediticia.</div>
            </div>
            @if (selectedProduct(); as product) {
              <aside class="conditions">
                <h4>Condiciones del producto (lectura)</h4>
                <dl>
                  <dt>TEA:</dt><dd>{{ product.teaPercent | number:'1.2-2' }}%</dd>
                  <dt>Inicial mínima:</dt><dd>{{ product.minDownPaymentPercent | number:'1.0-0' }}%</dd>
                  <dt>Financiamiento máx:</dt><dd>{{ product.maxDownPaymentPercent | number:'1.0-0' }}%</dd>
                  <dt>Plazo permitido:</dt><dd>{{ product.minTermMonths }} - {{ product.maxTermMonths }} meses</dd>
                  <dt>Compra inteligente:</dt><dd>{{ product.balloonAllowed ? ('Hasta ' + product.maxBalloonPercent + '%') : 'No permitida' }}</dd>
                </dl>
              </aside>
            }
          </div>
        </section>

        <div class="actions-row">
          <button type="button" class="ghost" routerLink="/simulations">Cancelar</button>
          <button type="button" class="primary wide" (click)="goStep2()">Siguiente paso: Condiciones del crédito →</button>
        </div>
      }

      @if (step() === 2) {
        <section class="credit-stack">
          <article class="form-card">
            <h2><span>$</span> Capital del crédito</h2>
            <div class="form-grid">
              <label>
                <span>Valor del vehículo ⓘ</span>
                <input type="number" [(ngModel)]="vehiclePrice" (ngModelChange)="recalculateDownPayment()" />
              </label>
              <label>
                <span>Cuota inicial (%) ⓘ</span>
                <input type="number" [(ngModel)]="request.downPaymentPercent" (ngModelChange)="recalculateDownPayment()" />
              </label>
            </div>
          </article>

          <article class="form-card">
            <h2><span>▦</span> Plazo y desembolso</h2>
            <div class="form-grid">
              <label><span>Producto financiero</span><input [value]="productLabel()" disabled /></label>
              <label><span>TEA del producto (%)</span><input [value]="(selectedProduct()?.teaPercent | number:'1.2-2') || '-'" disabled /></label>
              <label><span>Plazo del crédito (meses) ⓘ</span><input type="number" [(ngModel)]="request.termMonths" /></label>
              <label><span>Fecha de primer pago ⓘ</span><input type="date" [(ngModel)]="request.firstPaymentDate" /></label>
              <label><span>Día de pago (1-28) ⓘ</span><input type="number" min="1" max="28" [(ngModel)]="request.paymentDay" /></label>
            </div>
          </article>

          <article class="form-card cok-card">
            <h2><span>◇</span> Costo de oportunidad (COK)</h2>
            <div class="form-grid">
              <label>
                <span>COK (%) ⓘ</span>
                <input type="number" min="0" step="0.0001" [(ngModel)]="request.cokTeaPercent" (ngModelChange)="validateCok()" />
              </label>
              <label>
                <span>COK mensual (%)</span>
                <input [value]="cokMonthlyPercent() | number:'1.4-4'" disabled />
              </label>
            </div>
            <p class="note">El COK debe ser mayor o igual a la TEA del producto. Para el VAN se usa (1 + COK)^(1/12) - 1.</p>
            @if (cokError()) {
              <p class="error">{{ cokError() }}</p>
            }
          </article>

          <article class="form-card">
            <h2><span>⌛</span> Periodo de gracia</h2>
            <div class="grace-grid">
              <button type="button" [class.selected]="request.graceType === 'NONE'" (click)="setGrace('NONE')"><strong>Sin gracia</strong><small>Sin diferimiento</small></button>
              <button type="button" [class.selected]="request.graceType === 'PARTIAL'" (click)="setGrace('PARTIAL')"><strong>Gracia parcial</strong><small>Solo intereses</small></button>
              <button type="button" [class.selected]="request.graceType === 'TOTAL'" (click)="setGrace('TOTAL')"><strong>Gracia total</strong><small>Difiere todo</small></button>
            </div>
            <label class="full">
              <span>Duración de gracia (meses) ⓘ</span>
              <input type="number" min="0" max="6" [(ngModel)]="request.graceMonths" [disabled]="request.graceType === 'NONE'" />
            </label>
          </article>
        </section>
        <div class="actions-row">
          <button type="button" class="ghost" (click)="step.set(1)">← Atrás</button>
          <button type="button" class="primary wide" (click)="goStep3()">Siguiente paso: Compra inteligente →</button>
        </div>
      }

      @if (step() === 3) {
        <section class="confirm-layout">
          <div>
            <article class="form-card">
              <h2><span>✪</span> Compra Inteligente <small>Permite definir una cuota final mayor al cierre del crédito para reducir la cuota mensual.</small></h2>
              <div class="balloon-row">
                <div><strong>¿Aplicar Compra Inteligente?</strong><p>Disponible solo si el producto financiero lo permite.</p></div>
                <label class="switch"><input type="checkbox" [(ngModel)]="balloonEnabled" [disabled]="!selectedProduct()?.balloonAllowed" (ngModelChange)="validateBalloon()" /><i></i></label>
              </div>
              <label class="full">
                <span>Cuota final / balón (% del valor del vehículo) ⓘ</span>
                <input type="number" [(ngModel)]="request.balloonPercent" [disabled]="!balloonEnabled" (ngModelChange)="validateBalloon()" />
              </label>
              <p class="note">ⓘ Nota: La cuota final no reemplaza las cuotas mensuales. Se considera como un pago residual al final del préstamo.</p>
              @if (balloonError()) {
                <p class="error">{{ balloonError() }}</p>
              }
            </article>

            <article class="form-card">
              <h2><span>◈</span> Seguros y cargos referenciales del producto</h2>
              @if (selectedProduct(); as product) {
                <div class="cost-row">
                  <label><strong>Seguro de desgravamen</strong><small>Protección obligatoria sobre deuda.</small></label>
                  <strong>{{ product.creditLifeInsuranceMonthlyPercent | number:'1.3-3' }}% mensual</strong>
                </div>
                <div class="cost-row">
                  <label><strong>Seguro vehicular</strong><small>Cobertura integral del vehículo.</small></label>
                  <strong>{{ product.vehicleInsuranceAnnualPercent | number:'1.2-2' }}% anual</strong>
                </div>
                <div class="cost-row">
                  <label><strong>Portes / mora</strong><small>Cargo administrativo mensual.</small></label>
                  <strong>{{ product.currency }} {{ product.monthlyFee | number:'1.2-2' }}</strong>
                </div>
              }
            </article>
            <p class="legal">Los seguros y cargos mostrados corresponden a las condiciones vigentes del producto financiero seleccionado.</p>
          </div>

          <aside class="summary-card">
            <h3>▣ Resumen final</h3>
            <dl class="summary-main">
              <dt>Cliente</dt><dd>{{ selectedClientName() }}</dd>
              <dt>Vehículo</dt><dd>{{ selectedVehicleName() }}</dd>
              <dt>Producto financiero</dt><dd>{{ productLabel() }}</dd>
            </dl>
            <dl class="summary-money">
              <dt>Valor del vehículo</dt><dd>{{ vehiclePrice | number:'1.2-2' }}</dd>
              <dt>Cuota inicial</dt><dd>{{ downPaymentAmount() | number:'1.2-2' }} ({{ request.downPaymentPercent | number:'1.0-0' }}%)</dd>
              <dt>Capital financiado (estimado)</dt><dd>{{ financedAmount() | number:'1.2-2' }}</dd>
            </dl>
            <div class="summary-columns">
              <div><small>Tasas</small><strong>TEA: {{ (selectedProduct()?.teaPercent | number:'1.2-2') || '-' }}%</strong></div>
              <div><small>COK</small><strong>COK: {{ request.cokTeaPercent | number:'1.2-2' }}%</strong><strong>Mensual: {{ cokMonthlyPercent() | number:'1.4-4' }}%</strong></div>
              <div><small>Plazo y gracia</small><strong>Plazo: {{ request.termMonths }} meses</strong><strong>Gracia: {{ request.graceMonths }}m</strong></div>
              <div><small>Compra inteligente</small><strong>Balón: {{ balloonEnabled ? (request.balloonPercent + '%') : 'No aplica' }}</strong></div>
            </div>
          </aside>
        </section>
        <div class="actions-row">
          <button type="button" class="ghost" (click)="step.set(2)">← Atrás</button>
          <button type="button" class="primary wide" [disabled]="calculating()" (click)="calculate()">Calcular simulación ▣</button>
        </div>
        @if (submitError()) {
          <p class="error">{{ submitError() }}</p>
        }
      }
    </section>
    </app-page-container>
  `,
  styles: [`
    .crumb { margin:-18px 0 28px; color:#8aa0bf; font-size:13px; }
    .crumb strong { color:#111827; }
    .step-head h1 { color:#00318f; font-size:32px; line-height:1; letter-spacing:-.03em; margin:0 0 10px; font-weight:900; }
    .step-head p { color:#4b5563; font-size:16px; margin:0; }
    .stepper { display:grid; grid-template-columns:120px 1fr 120px 1fr 120px; align-items:center; gap:18px; margin:42px 28px 46px; }
    .step-item { display:grid; place-items:center; gap:10px; color:#374151; text-align:center; }
    .step-item span { width:42px; height:42px; display:grid; place-items:center; border-radius:10px; background:#e7ebfb; color:#374151; font-weight:900; box-shadow:0 0 0 4px rgba(0,54,163,.05); }
    .step-item strong { font-size:14px; line-height:1.25; }
    .step-item.active span { background:#0036a3; color:#fff; }
    .step-item.active strong { color:#0036a3; }
    .step-item.done span { background:#087a3d; color:#fff; }
    .step-item.done strong { color:#087a3d; }
    .line { height:4px; background:#cdd4e2; }
    .line.done { background:#087a3d; }
    .section-title { display:flex; align-items:center; justify-content:space-between; margin-bottom:18px; }
    .section-title.spaced { margin-top:46px; }
    .section-title h2, .form-card h2 { display:flex; align-items:center; gap:8px; margin:0; color:#111827; font-size:18px; font-weight:900; }
    .section-title svg { width:20px; height:20px; fill:none; stroke:#0036a3; stroke-width:2; stroke-linecap:round; stroke-linejoin:round; }
    .link-button { border:0; background:transparent; color:#0036a3; font-weight:900; cursor:pointer; }
    .panel, .entity-panel, .form-card { background:#fff; border:1px solid #e1e7f0; border-radius:8px; padding:26px; }
    .search-row { height:44px; display:flex; align-items:center; gap:12px; border:1px solid #e1e7f0; padding:0 12px; margin-bottom:28px; }
    .search-row input { border:0; outline:0; flex:1; color:#475569; }
    .mini-table th { background:#faf7ff; font-size:11px; color:#6b7280; }
    .mini-table td { background:#fff; }
    .mini-table button { border:0; background:transparent; color:#0036a3; font-weight:900; cursor:pointer; }
    .selected-card { display:grid; grid-template-columns:56px 1fr; gap:18px; margin-top:26px; padding:20px; border:1px solid #b9c8e8; border-radius:8px; background:#f4f7ff; }
    .selected-card h3 { margin:0 0 6px; font-size:17px; }
    .selected-card p, .card-note { color:#64748b; font-size:12px; }
    .card-note { grid-column:1 / -1; border-top:1px solid #dbe4f2; padding-top:14px; }
    .person-icon { width:50px; height:50px; display:grid; place-items:center; background:#0036a3; color:#fff; border-radius:10px; }
    .person-icon svg { width:24px; height:24px; fill:none; stroke:currentColor; stroke-width:2; }
    .label, label > span { display:block; margin-bottom:8px; color:#6b7280; font-size:11px; font-weight:900; letter-spacing:.08em; text-transform:uppercase; }
    select, input { width:100%; min-height:42px; border:1px solid #e1e7f0; border-radius:4px; background:#fff; color:#334155; padding:0 14px; }
    input:disabled { background:#f8fafc; color:#64748b; }
    .vehicle-picked { display:grid; grid-template-columns:80px 1fr 220px; align-items:center; gap:24px; margin-top:24px; padding:20px; background:#f8fafc; border-radius:8px; }
    .vehicle-picked h3 { margin:0 0 10px; font-size:16px; }
    small { display:block; color:#6b7280; font-size:10px; text-transform:uppercase; }
    .image-placeholder { width:66px; height:48px; display:grid; place-items:center; color:#8aa0bf; }
    .image-placeholder img { width:100%; height:100%; object-fit:cover; border-radius:4px; }
    .amount strong { color:#0036a3; font-size:17px; }
    .entity-panel { display:grid; grid-template-columns:1fr 420px; gap:34px; }
    .warning { margin-top:18px; padding:14px; border:1px solid #fed78a; border-radius:4px; color:#b45309; background:#fff9e8; font-size:12px; }
    .conditions { background:#f1f5f9; border-radius:8px; overflow:hidden; }
    .conditions h4 { margin:0; padding:15px 18px; color:#111827; font-size:12px; font-weight:900; text-transform:uppercase; letter-spacing:.08em; }
    .conditions dl { display:grid; grid-template-columns:1fr 1fr; gap:12px; padding:18px; }
    .conditions dt { color:#7b8798; } .conditions dd { margin:0; text-align:right; font-weight:900; color:#0f172a; }
    .credit-stack { display:grid; gap:24px; }
    .form-card { padding:0; overflow:hidden; }
    .form-card h2 { padding:20px 26px; border-bottom:1px solid #edf1f6; color:#0036a3; font-size:18px; }
    .form-card h2 span { width:26px; height:26px; display:grid; place-items:center; background:#dbe5ff; border-radius:4px; color:#0036a3; }
    .form-card h2 small { margin-left:4px; color:#64748b; text-transform:none; font-weight:500; font-size:11px; }
    .form-grid { display:grid; grid-template-columns:1fr 1fr; gap:24px; padding:26px; }
    .full { display:block; padding:0 26px 22px; }
    .toggle-row, .balloon-row { display:flex; justify-content:space-between; align-items:center; margin:0 26px 24px; padding:18px; background:#f3f5ff; }
    .switch input { display:none; }
    .switch i { width:48px; height:24px; display:block; position:relative; border-radius:999px; background:#cbd5e1; cursor:pointer; }
    .switch i::after { content:''; width:20px; height:20px; position:absolute; top:2px; left:2px; border-radius:50%; background:#fff; transition:.15s; }
    .switch input:checked + i { background:#0036a3; }
    .switch input:checked + i::after { left:26px; }
    .grace-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; padding:26px; }
    .grace-grid button { min-height:72px; text-align:left; border:1px solid #e1e7f0; background:#fff; border-radius:6px; padding:16px; cursor:pointer; }
    .grace-grid button.selected { border:2px solid #0036a3; background:#f8fbff; }
    .note { margin:0 26px 24px; padding:14px; background:#f3f5ff; border:1px solid #dbe5ff; color:#0f172a; font-size:12px; font-weight:800; }
    .error { margin:0 26px 20px; color:#c01818; font-weight:800; }
    .confirm-layout { display:grid; grid-template-columns:1fr 300px; gap:34px; align-items:start; }
    .cost-row { display:flex; justify-content:space-between; align-items:center; margin:24px 26px; padding:16px; background:#f8fafc; border-radius:4px; }
    .cost-row label { display:flex; flex-direction:column; align-items:flex-start; gap:2px; margin:0; color:#111827; }
    .cost-row strong:last-child { color:#0036a3; }
    .legal { margin:20px 8px 0; color:#4b5563; font-style:italic; line-height:1.5; }
    .summary-card { background:#121d31; color:#fff; border-radius:7px; overflow:hidden; box-shadow:0 12px 24px rgba(15,23,42,.18); }
    .summary-card h3 { margin:0; padding:22px; background:#1b263a; font-size:17px; }
    .summary-card dl { margin:0 22px; padding:20px 0; border-bottom:1px solid rgba(255,255,255,.1); }
    .summary-card dt { color:#8fa2bd; text-transform:uppercase; font-size:10px; margin-top:8px; }
    .summary-card dd { margin:2px 0 0; color:#fff; font-weight:800; }
    .summary-money { display:grid; grid-template-columns:1fr auto; gap:10px; }
    .summary-money dt { margin:0; text-transform:none; font-size:12px; }
    .summary-money dd { margin:0; color:#69a6ff; }
    .summary-columns { display:grid; grid-template-columns:1fr 1fr; gap:18px; padding:20px 22px; }
    .summary-columns small { color:#8fa2bd; margin-bottom:6px; }
    .summary-columns strong { display:block; font-size:11px; margin-bottom:4px; }
    .actions-row { display:flex; justify-content:space-between; align-items:center; margin-top:52px; padding-top:26px; border-top:1px solid #e4e9f1; }
    .ghost, .primary { min-height:48px; border-radius:4px; padding:0 28px; font-weight:900; cursor:pointer; }
    .ghost { border:1px solid #d9e1ee; background:#fff; color:#374151; }
    .primary { border:0; background:#0036a3; color:#fff; box-shadow:0 6px 14px rgba(0,54,163,.18); }
    .primary:disabled { opacity:.6; cursor:not-allowed; }
    .wide { min-width:360px; }
    @media (max-width: 920px) {
      .stepper, .entity-panel, .confirm-layout, .form-grid, .grace-grid, .vehicle-picked { grid-template-columns:1fr; }
      .line { display:none; }
      .wide { min-width:auto; width:100%; }
      .actions-row { flex-direction:column-reverse; gap:16px; align-items:stretch; }
    }
  `],
})
export class SimulationComponent {
  private router = inject(Router);
  private clientSvc = inject(CustomerService);
  private vehicleSvc = inject(VehicleCatalogService);
  private institutionSvc = inject(FinancialInstitutionService);
  private productSvc = inject(FinancialProductService);
  private simSvc = inject(SimulationService);

  step = signal(1);
  clientQuery = '';
  balloonEnabled = false;
  balloonError = signal('');
  cokError = signal('');
  submitError = signal('');
  calculating = signal(false);
  selectedClient = signal<CustomerDto | undefined>(undefined);
  selectedVehicle = signal<VehicleDto | undefined>(undefined);
  selectedProduct = signal<FinancialProductDto | undefined>(undefined);

  clients = this.clientSvc.customers;
  vehicles = this.vehicleSvc.vehicles;
  products = this.productSvc.products;

  vehiclePrice = 0;

  request: SimulationRequestDto = {
    clientId: 0,
    vehicleId: 0,
    financialProductId: 0,
    downPaymentPercent: 20,
    termMonths: 36,
    cokTeaPercent: 0,
    firstPaymentDate: '',
    paymentDay: 5,
    graceType: 'NONE',
    graceMonths: 0,
    balloonPercent: 0,
  };

  filteredClients = computed(() => {
    const query = this.clientQuery.trim().toLowerCase();
    const rows = this.clients().filter((client) => !query
      || client.docNumber.toLowerCase().includes(query)
      || `${client.names} ${client.surnames}`.toLowerCase().includes(query));
    return rows.slice(0, 5);
  });

  selectClient(client: CustomerDto) {
    if (!client.id) return;

    this.selectedClient.set(client);
    this.request.clientId = client.id;
  }

  onVehicleChange() {
    const vehicle = this.vehicleSvc.getById(Number(this.request.vehicleId));
    this.selectedVehicle.set(vehicle);
    if (vehicle) {
      this.vehiclePrice = vehicle.price;
      this.recalculateDownPayment();
    }
  }

  onProductChange() {
    const product = this.productSvc.getById(Number(this.request.financialProductId));
    this.selectedProduct.set(product);
    if (product) {
      this.request.termMonths = Math.min(Math.max(this.request.termMonths, product.minTermMonths), product.maxTermMonths);
      this.request.downPaymentPercent = Math.min(Math.max(this.request.downPaymentPercent, product.minDownPaymentPercent), product.maxDownPaymentPercent);
      if (!this.request.cokTeaPercent || this.request.cokTeaPercent < product.teaPercent) {
        this.request.cokTeaPercent = product.teaPercent;
      }
      if (!product.balloonAllowed) {
        this.balloonEnabled = false;
        this.request.balloonPercent = 0;
      }
      this.validateCok();
    }
  }

  institutionName(institutionId: number) {
    const institution: FinancialInstitutionDto | undefined = this.institutionSvc.getById(institutionId);
    return institution?.shortName || institution?.name || 'Entidad';
  }

  goStep2() {
    if (!this.selectedClient() && this.clients()[0]) this.selectClient(this.clients()[0]);
    if (!this.selectedVehicle() && this.vehicles()[0]) {
      this.request.vehicleId = this.vehicles()[0].id;
      this.onVehicleChange();
    }
    if (!this.selectedProduct() && this.products()[0]) {
      this.request.financialProductId = this.products()[0].id;
      this.onProductChange();
    }
    this.step.set(2);
  }

  goStep3() {
    if (!this.validateCok()) return;
    this.step.set(3);
  }

  setGrace(type: GraceType) {
    this.request.graceType = type;
    this.request.graceMonths = type === 'NONE' ? 0 : Math.max(1, this.request.graceMonths || 1);
  }

  recalculateDownPayment() {
    // downPaymentPercent is the source of truth sent to the backend; nothing else to sync here.
  }

  downPaymentAmount() {
    return Math.round((this.vehiclePrice * (this.request.downPaymentPercent || 0) / 100) * 100) / 100;
  }

  financedAmount() {
    return Math.max(0, this.vehiclePrice - this.downPaymentAmount());
  }

  validateBalloon() {
    const product = this.selectedProduct();
    if (this.balloonEnabled && product && this.request.balloonPercent > product.maxBalloonPercent) {
      this.balloonError.set(`La compra inteligente de este producto permite hasta ${product.maxBalloonPercent}% del valor del vehículo.`);
      return false;
    }
    this.balloonError.set('');
    return true;
  }

  validateCok() {
    const product = this.selectedProduct();
    if (!product) {
      this.cokError.set('');
      return true;
    }
    const value = Number(this.request.cokTeaPercent);
    if (!Number.isFinite(value)) {
      this.cokError.set('Ingresa el COK como porcentaje.');
      return false;
    }
    if (value < product.teaPercent) {
      this.cokError.set(`El COK no puede ser menor a la TEA del producto (${product.teaPercent.toFixed(2)}%).`);
      return false;
    }
    this.cokError.set('');
    return true;
  }

  cokMonthlyPercent() {
    const cok = (Number(this.request.cokTeaPercent) || 0) / 100;
    return Math.round((Math.pow(1 + cok, 1 / 12) - 1) * 1000000) / 10000;
  }

  calculate() {
    if (this.calculating() || !this.validateBalloon() || !this.validateCok()) return;
    this.submitError.set('');
    this.calculating.set(true);
    this.request.vehiclePrice = this.vehiclePrice;
    this.request.balloonPercent = this.balloonEnabled ? this.request.balloonPercent : 0;

    this.simSvc.create(this.request).subscribe({
      next: (simulation) => {
        this.router.navigate(['/results', simulation.id], { state: { result: simulation } });
      },
      error: (err) => {
        this.submitError.set(err?.error?.detail ?? 'No se pudo calcular la simulación.');
        this.calculating.set(false);
      },
    });
  }

  selectedClientName() {
    const client = this.selectedClient();
    return client ? `${client.names} ${client.surnames}` : '—';
  }

  selectedVehicleName() {
    const vehicle = this.selectedVehicle();
    return vehicle ? `${vehicle.brand} ${vehicle.model} ${vehicle.year}` : '—';
  }

  productLabel() {
    const product = this.selectedProduct();
    return product ? `${this.institutionName(product.financialInstitutionId)} — ${product.productName}` : '—';
  }
}
