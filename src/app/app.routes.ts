import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './iam/presentation/pages/login/login.component';
import { RegisterComponent } from './iam/presentation/pages/register/register.component';
import { authGuard } from './iam/services/guards/auth.guard';
import { DashboardComponent } from './analytics/presentation/pages/dashboard/dashboard.component';
import { ClientsComponent } from './pages/clients/clients.component';
import { ClientFormComponent } from './pages/client-form/client-form.component';
import { VehicleCatalogComponent } from './vehicles/presentation/pages/catalog/vehicle-catalog.component';
import { VehicleFormComponent } from './pages/vehicle-form/vehicle-form.component';
import { EntitiesComponent } from './pages/entities/entities.component';
import { EntityFormComponent } from './pages/entity-form/entity-form.component';
import { SimulationComponent } from './pages/simulation/simulation.component';
import { ResultsComponent } from './pages/results/results.component';
import { SimulationsListComponent } from './pages/simulations-list/simulations-list.component';
import { ConfigComponent } from './pages/config/config.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivateChild: [() => authGuard()],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'clients', component: ClientsComponent },
      { path: 'clients/new', component: ClientFormComponent },
      { path: 'clients/:id', component: ClientFormComponent },
      { path: 'vehicles', component: VehicleCatalogComponent },
      { path: 'vehicles/new', component: VehicleFormComponent },
      { path: 'vehicles/:id', component: VehicleFormComponent },
      { path: 'entities', component: EntitiesComponent },
      { path: 'entities/new', component: EntityFormComponent },
      { path: 'entities/:id', component: EntityFormComponent },
      { path: 'simulation/new', component: SimulationComponent },
      { path: 'results/:id', component: ResultsComponent },
      { path: 'simulations', component: SimulationsListComponent },
      { path: 'config', component: ConfigComponent },
    ],
  },
  { path: '**', redirectTo: '' },
];
