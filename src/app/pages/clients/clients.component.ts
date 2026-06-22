import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="page-header">
      <div>
        <h1>Clientes</h1>
        <p>Gestión de clientes registrados</p>
      </div>
      <a routerLink="/clients/new" class="btn btn-primary">+ Nuevo cliente</a>
    </div>
    <div class="card" style="padding:0;">
      <table>
        <thead>
          <tr><th>Tipo doc.</th><th>Nro. documento</th><th>Nombre completo</th><th>Teléfono</th><th>Correo</th><th>Ingreso mensual</th><th>Estado</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          @for (c of svc.clients(); track c.id) {
            <tr>
              <td>{{ c.docType }}</td><td>{{ c.docNumber }}</td>
              <td>{{ c.names }} {{ c.surnames }}</td>
              <td>{{ c.phone }}</td><td>{{ c.email }}</td>
              <td>S/ {{ c.monthlyIncome?.toLocaleString() }}</td>
              <td><span class="badge" [class.badge-green]="c.status==='Activo'" [class.badge-red]="c.status==='Inactivo'">{{ c.status }}</span></td>
              <td>
                <a [routerLink]="['/clients', c.id]" class="btn btn-sm btn-outline">Editar</a>
                <button class="btn btn-sm btn-outline" style="margin-left:4px;color:var(--danger)" (click)="svc.delete(c.id)">Eliminar</button>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `
})
export class ClientsComponent {
  svc = inject(ClientService);
}
