import { Component } from '@angular/core';
import { PageContainerComponent } from '../../shared/components/page-container/page-container.component';

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [PageContainerComponent],
  template: `
    <app-page-container>
    <div class="page-header"><div><h1>Configuración</h1></div></div>
    <div class="card" style="max-width:600px">
      <div class="grid-2">
        <div class="form-group">
          <label>Moneda base</label>
          <input class="form-control" value="Soles (PEN)" disabled>
        </div>
        <div class="form-group">
          <label>Tipo de tasa</label>
          <input class="form-control" value="Efectiva anual" disabled>
        </div>
        <div class="form-group">
          <label>Método de amortización</label>
          <input class="form-control" value="Francés vencido ordinario" disabled>
        </div>
        <div class="form-group">
          <label>Días por mes</label>
          <input class="form-control" value="30" disabled>
        </div>
        <div class="form-group">
          <label>Periodicidad</label>
          <input class="form-control" value="Mensual" disabled>
        </div>
        <div class="form-group">
          <label>Decimales</label>
          <input class="form-control" value="2" disabled>
        </div>
        <div class="form-group">
          <label>Rango de plazo</label>
          <input class="form-control" value="12 a 60 meses" disabled>
        </div>
        <div class="form-group">
          <label>Periodo de gracia máximo</label>
          <input class="form-control" value="6 meses" disabled>
        </div>
      </div>
      <p style="margin-top:16px;font-size:12px;color:var(--text-muted)">Estos parámetros están definidos por la configuración del sistema CarGo.</p>
    </div>
    </app-page-container>
  `
})
export class ConfigComponent {}
