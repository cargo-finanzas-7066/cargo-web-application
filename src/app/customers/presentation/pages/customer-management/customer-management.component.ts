import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageContainerComponent } from '../../../../shared/components/page-container/page-container.component';
import { CustomerDto } from '../../../models/dtos/customer.dto';
import { CustomerService } from '../../../services/api/customer.service';

@Component({
  selector: 'app-customer-management',
  standalone: true,
  imports: [FormsModule, PageContainerComponent],
  template: `
    <app-page-container>
    <section class="customers-page">
      <section class="search-card">
        <label>
          <span>Buscar cliente <small>ⓘ</small></span>
          <input [(ngModel)]="query" placeholder="Ingresa documento, nombre o correo...">
        </label>
      </section>

      <section class="master-card">
        <h2>Listado Maestro</h2>
        <table>
          <thead>
            <tr>
              <th>Documento</th>
              <th>Cliente</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th class="actions-head">Acciones</th>
            </tr>
          </thead>
          <tbody>
            @for (customer of visibleCustomers(); track customer.id) {
              <tr>
                <td>{{ customer.docType }} {{ customer.docNumber }}</td>
                <td class="customer-name">{{ fullName(customer) }}</td>
                <td>{{ customer.email }}</td>
                <td>{{ customer.phone }}</td>
                <td class="actions">
                  <button type="button" title="Editar cliente" (click)="openEditor(customer)" aria-label="Editar cliente">
                    <svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="m16.5 3.5 4 4L8 20l-5 1 1-5Z"/></svg>
                  </button>
                  <button type="button" title="Eliminar cliente" (click)="askDelete(customer)" aria-label="Eliminar cliente">
                    <svg viewBox="0 0 24 24"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="m19 6-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
                  </button>
                </td>
              </tr>
            }
          </tbody>
        </table>
        <footer class="table-footer">
          <span>Mostrando 1-{{ visibleCustomers().length }} de 1,284 clientes</span>
          <div class="pagination">
            <button disabled>‹</button>
            <button class="active">1</button>
            <button>2</button>
            <button>›</button>
          </div>
        </footer>
      </section>

      <button class="floating-action" type="button" (click)="openCreator()">+</button>

      @if (drawerOpen()) {
        <div class="drawer-layer">
          <div class="drawer-scrim" (click)="closeDrawer()"></div>
          <aside class="customer-drawer">
            <header>
              <div>
                <h2>{{ editingCustomer()?.id ? 'Editar cliente' : 'Nuevo cliente' }}</h2>
                <p>Registra los datos básicos del cliente para usarlo en una simulación de crédito vehicular.</p>
              </div>
              <button type="button" (click)="closeDrawer()">×</button>
            </header>

            <form (ngSubmit)="saveCustomer()">
              <label>
                <span>Tipo de documento <small>ⓘ</small></span>
                <select [(ngModel)]="form.docType" name="docType">
                  <option>DNI</option>
                  <option>CE</option>
                  <option>RUC</option>
                </select>
              </label>
              <label>
                <span>Número de documento <small>ⓘ</small></span>
                <input [(ngModel)]="form.docNumber" name="docNumber" placeholder="Ej. 45829103" required>
              </label>
              <label>
                <span>Nombres y apellidos <small>ⓘ</small></span>
                <input [(ngModel)]="form.fullName" name="fullName" placeholder="Ej. Carlos Eduardo Méndez" required>
              </label>
              <label>
                <span>Correo electrónico <small>ⓘ</small></span>
                <input type="email" [(ngModel)]="form.email" name="email" placeholder="Ej. cliente@correo.com" required>
              </label>
              <label>
                <span>Teléfono <small>ⓘ</small></span>
                <input [(ngModel)]="form.phone" name="phone" placeholder="Ej. +51 987 654 321" required>
              </label>

              @if (!editingCustomer()?.id) {
                <div class="info-note">
                  <span>ⓘ</span>
                  <p>Los datos del cliente se usarán únicamente para identificar al solicitante dentro de las simulaciones de crédito vehicular.</p>
                </div>
              }

              <footer>
                <button class="cancel-action" type="button" (click)="closeDrawer()">Cancelar</button>
                <button class="primary-action" type="submit">{{ editingCustomer()?.id ? 'Actualizar cliente' : 'Guardar cliente' }}</button>
              </footer>
            </form>
          </aside>
        </div>
      }

      @if (customerToDelete()) {
        <div class="modal-layer">
          <div class="modal-scrim"></div>
          <section class="delete-modal">
            <span class="warning-icon">△</span>
            <div>
              <h2>¿Eliminar cliente?</h2>
              <p>¿Estás seguro de que deseas eliminar a {{ fullName(customerToDelete()!) }}? Esta acción no se puede deshacer y el cliente ya no estará disponible para nuevas simulaciones.</p>
              <footer>
                <button type="button" (click)="customerToDelete.set(null)">Cancelar</button>
                <button class="danger-action" type="button" (click)="confirmDelete()">Eliminar</button>
              </footer>
            </div>
          </section>
        </div>
      }
    </section>
    </app-page-container>
  `,
  styles: [`
    .customers-page { position: relative; min-height: calc(100vh - 96px); }
    .search-card, .master-card { border: 1px solid #cfd6e4; border-radius: 8px; background: #fff; }
    .search-card { padding: 24px 26px; margin-bottom: 24px; }
    label span { display: block; color: #3f4759; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 8px; }
    small { color: #8aa0bf; font-size: 13px; }
    input, select { width: 100%; height: 42px; border: 1px solid #b9c2d1; border-radius: 3px; padding: 0 14px; color: #172033; background: #f8fafc; font-size: 16px; }
    .search-card input { max-width: 740px; }
    .master-card { overflow: hidden; }
    .master-card h2 { padding: 22px 26px; color: #111827; font-size: 18px; font-weight: 500; border-bottom: 1px solid #dce2ec; }
    table { width: 100%; border-collapse: collapse; }
    th { padding: 17px 26px; background: #f1f3ff; color: #42495a; font-size: 12px; font-weight: 800; text-align: left; text-transform: uppercase; letter-spacing: .06em; }
    td { padding: 24px 26px; border-top: 1px solid #cfd6e4; color: #41516a; font-size: 16px; }
    .customer-name { color: #111827; font-weight: 800; }
    .actions-head { text-align: right; }
    .actions { display: flex; justify-content: flex-end; gap: 12px; }
    .actions button { display: grid; place-items: center; width: 28px; height: 28px; border: 0; background: transparent; color: #8aa0bf; cursor: pointer; }
    .actions svg { width: 20px; height: 20px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
    .table-footer { display: flex; justify-content: space-between; align-items: center; padding: 16px 26px 24px; border-top: 1px solid #cfd6e4; color: #61708a; font-size: 12px; }
    .pagination { display: flex; gap: 8px; }
    .pagination button { width: 32px; height: 32px; border: 1px solid #c5ccda; border-radius: 2px; background: #fff; color: #0f172a; }
    .pagination .active { background: #0036ad; color: #fff; border-color: #0036ad; }
    .floating-action { position: fixed; right: 40px; bottom: 52px; width: 56px; height: 56px; border: 0; border-radius: 10px; background: #2948bd; color: #fff; font-size: 34px; line-height: 1; box-shadow: 0 14px 24px rgba(15,23,42,.18); cursor: pointer; }
    .drawer-layer, .modal-layer { position: fixed; inset: 0; z-index: 20; }
    .drawer-scrim, .modal-scrim { position: absolute; inset: 0; background: rgba(17,24,39,.46); }
    .customer-drawer { position: absolute; top: 0; right: 0; width: min(470px, 100vw); height: 100%; background: #fff; box-shadow: -18px 0 40px rgba(15,23,42,.22); display: flex; flex-direction: column; }
    .customer-drawer header { display: flex; justify-content: space-between; align-items: flex-start; padding: 28px 24px; border-bottom: 1px solid #d9e0ea; }
    .customer-drawer header h2 { font-size: 24px; margin-bottom: 6px; color: #111827; }
    .customer-drawer header p { color: #64748b; line-height: 1.45; }
    .customer-drawer header button { border: 0; background: transparent; color: #8aa0bf; font-size: 30px; cursor: pointer; }
    .customer-drawer form { flex: 1; display: flex; flex-direction: column; gap: 20px; padding: 24px; }
    .customer-drawer form footer { margin: auto -24px -24px; padding: 22px 24px; border-top: 1px solid #d9e0ea; display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .info-note { display: flex; gap: 12px; align-items: flex-start; padding: 14px; border: 1px solid #d8e0ff; border-radius: 7px; background: #f1f4ff; color: #1f3d95; font-size: 12px; line-height: 1.45; }
    .cancel-action, .primary-action, .danger-action, .delete-modal footer button { height: 44px; border-radius: 4px; font-weight: 800; cursor: pointer; }
    .cancel-action, .delete-modal footer button:first-child { border: 1px solid #d9e0ea; background: #fff; color: #475569; }
    .primary-action { border: 0; background: #2948bd; color: #fff; }
    .modal-layer { display: grid; place-items: center; }
    .delete-modal { position: relative; z-index: 1; display: grid; grid-template-columns: 44px 1fr; width: min(470px, calc(100vw - 32px)); padding: 24px; border-radius: 12px; background: #fff; box-shadow: 0 24px 60px rgba(15,23,42,.28); }
    .warning-icon { width: 36px; height: 36px; display: grid; place-items: center; border-radius: 8px; background: #fff0f0; color: #dc2626; font-size: 24px; }
    .delete-modal h2 { font-size: 22px; color: #111827; margin-bottom: 8px; }
    .delete-modal p { color: #475569; line-height: 1.5; margin-bottom: 24px; }
    .delete-modal footer { display: flex; justify-content: flex-end; gap: 14px; }
    .delete-modal footer button { min-width: 112px; padding: 0 18px; }
    .danger-action { border: 0; background: #c81e1e; color: #fff; }
    @media (max-width: 780px) {
      .master-card { overflow-x: auto; }
      .table-footer { align-items: flex-start; flex-direction: column; gap: 12px; }
    }
  `],
})
export class CustomerManagementComponent {
  private customerService = inject(CustomerService);
  query = '';
  drawerOpen = signal(false);
  editingCustomer = signal<CustomerDto | null>(null);
  customerToDelete = signal<CustomerDto | null>(null);
  form = this.emptyForm();

  visibleCustomers = computed(() => {
    const text = this.query.trim().toLowerCase();
    return this.customerService.customers().filter((customer) => {
      const haystack = `${customer.docType} ${customer.docNumber} ${this.fullName(customer)} ${customer.email}`.toLowerCase();
      return !text || haystack.includes(text);
    }).slice(0, 3);
  });

  openCreator() {
    this.editingCustomer.set(null);
    this.form = this.emptyForm();
    this.drawerOpen.set(true);
  }

  openEditor(customer: CustomerDto) {
    this.editingCustomer.set(customer);
    this.form = {
      docType: customer.docType,
      docNumber: customer.docNumber,
      fullName: this.fullName(customer),
      email: customer.email,
      phone: customer.phone,
    };
    this.drawerOpen.set(true);
  }

  closeDrawer() {
    this.drawerOpen.set(false);
  }

  saveCustomer() {
    const current = this.editingCustomer();
    const names = this.form.fullName.trim().split(/\s+/);
    const customer: CustomerDto = {
      id: current?.id ?? 0,
      docType: this.form.docType,
      docNumber: this.form.docNumber,
      names: names.slice(0, Math.max(1, names.length - 1)).join(' '),
      surnames: names.length > 1 ? names.slice(-1).join(' ') : '',
      email: this.form.email,
      phone: this.form.phone,
      address: current?.address,
      monthlyIncome: current?.monthlyIncome ?? 0,
      occupation: current?.occupation ?? '',
      status: current?.status ?? 'Activo',
    };

    this.customerService.save(customer).subscribe(() => this.closeDrawer());
  }

  askDelete(customer: CustomerDto) {
    this.customerToDelete.set(customer);
  }

  confirmDelete() {
    const customer = this.customerToDelete();
    if (!customer) return;

    this.customerService.delete(customer.id).subscribe(() => {
      this.customerService.refresh();
      this.customerToDelete.set(null);
    });
  }

  fullName(customer: CustomerDto) {
    return `${customer.names} ${customer.surnames}`.trim();
  }

  private emptyForm() {
    return {
      docType: 'DNI',
      docNumber: '',
      fullName: '',
      email: '',
      phone: '',
    };
  }
}
