import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SimulationService } from '../../services/simulation.service';
import { ClientService } from '../../services/client.service';
import { VehicleService } from '../../services/vehicle.service';
import { EntityService } from '../../services/entity.service';

@Component({
  selector: 'app-simulations-list',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="page-header">
      <div><h1>Simulaciones</h1><p>Historial de simulaciones guardadas</p></div>
    </div>
    <div class="card" style="padding:0;overflow:auto">
      <table>
        <thead>
          <tr><th>Código</th><th>Cliente</th><th>Vehículo</th><th>Entidad</th><th>Monto</th><th>Estado</th><th>Fecha</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          @for (s of simSvc.simulations(); track s.id) {
            <tr>
              <td><strong>{{ s.code }}</strong></td>
              <td>{{ getClient(s.clientId) }}</td>
              <td>{{ getVehicle(s.vehicleId) }}</td>
              <td>{{ getEntity(s.entityId) }}</td>
              <td>S/ {{ s.financedAmount.toLocaleString() }}</td>
              <td><span class="badge" [class.badge-blue]="s.status==='Simulado'" [class.badge-gray]="s.status==='Guardado'||s.status==='Borrador'" [class.badge-green]="s.status==='Aprobado'" [class.badge-yellow]="s.status==='Observado'">{{ s.status }}</span></td>
              <td>{{ s.createdAt }}</td>
              <td>
                <a [routerLink]="['/results', s.id]" class="btn btn-sm btn-outline">Ver</a>
                <button class="btn btn-sm btn-outline" style="margin-left:4px" (click)="duplicate(s)">Duplicar</button>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `
})
export class SimulationsListComponent {
  simSvc = inject(SimulationService);
  clientSvc = inject(ClientService);
  vehicleSvc = inject(VehicleService);
  entitySvc = inject(EntityService);

  getClient(id: number) { const c = this.clientSvc.getById(id); return c ? `${c.names} ${c.surnames}` : ''; }
  getVehicle(id: number) { const v = this.vehicleSvc.getById(id); return v ? `${v.brand} ${v.model}` : ''; }
  getEntity(id: number) { const e = this.entitySvc.getById(id); return e?.name || ''; }

  duplicate(s: any) {
    const copy = { ...s, id: 0, code: '', status: 'Borrador', createdAt: '' };
    this.simSvc.save(copy);
  }
}
