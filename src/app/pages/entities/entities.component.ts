import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EntityService } from '../../services/entity.service';

@Component({
  selector: 'app-entities',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="page-header">
      <div>
        <h1>Entidades financieras</h1>
        <p>Registro de bancos, financieras y matriz de costos</p>
      </div>
      <a routerLink="/entities/new" class="btn btn-primary">+ Nueva entidad</a>
    </div>
    <div class="card" style="padding:0;overflow:auto">
      <table>
        <thead>
          <tr><th>Entidad</th><th>Tipo</th><th>Producto</th><th>TEA</th><th>Seg. desgravamen</th><th>Seg. vehicular</th><th>Comisión</th><th>Gasto admin.</th><th>Estado</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          @for (e of svc.entities(); track e.id) {
            <tr>
              <td><strong>{{ e.name }}</strong></td>
              <td>{{ e.type }}</td><td>{{ e.product }}</td>
              <td>{{ e.tea }}%</td><td>{{ e.insuranceDisbursement }}%</td><td>{{ e.insuranceVehicle }}%</td>
              <td>S/ {{ e.monthlyFee }}</td><td>S/ {{ e.adminCost }}</td>
              <td><span class="badge" [class.badge-green]="e.status==='Activo'" [class.badge-red]="e.status==='Inactivo'">{{ e.status }}</span></td>
              <td>
                <a [routerLink]="['/entities', e.id]" class="btn btn-sm btn-outline">Editar</a>
                <button class="btn btn-sm btn-outline" style="margin-left:4px;color:var(--danger)" (click)="svc.delete(e.id)">Eliminar</button>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
    <div class="card" style="margin-top:24px">
      <h3 style="margin-bottom:16px;font-size:16px">Matriz de costos comparativa</h3>
      <div style="overflow:auto">
        <table>
          <thead>
            <tr><th>Entidad</th><th>TEA</th><th>Seg. desgravamen</th><th>Seg. vehicular</th><th>Comisión</th><th>Gasto admin.</th><th>TCEA estimada</th></tr>
          </thead>
          <tbody>
            @for (e of activeEntities(); track e.id) {
              <tr>
                <td><strong>{{ e.name }}</strong></td>
                <td>{{ e.tea }}%</td><td>{{ e.insuranceDisbursement }}%</td><td>{{ e.insuranceVehicle }}%</td>
                <td>S/ {{ e.monthlyFee }}</td><td>S/ {{ e.adminCost }}</td>
                <td><strong>{{ (e.tea + e.insuranceDisbursement * 12 + e.insuranceVehicle / 12 + e.monthlyFee * 12 / 50000 * 100).toFixed(1) }}%</strong></td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class EntitiesComponent {
  svc = inject(EntityService);
  activeEntities = () => this.svc.entities().filter(e => e.status === 'Activo');
}
