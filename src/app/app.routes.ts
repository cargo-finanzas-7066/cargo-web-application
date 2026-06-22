import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './iam/presentation/pages/login/login.component';
import { RegisterComponent } from './iam/presentation/pages/register/register.component';
import { authGuard } from './iam/services/guards/auth.guard';
import { DashboardComponent } from './analytics/presentation/pages/dashboard/dashboard.component';
import { CustomerManagementComponent } from './customers/presentation/pages/customer-management/customer-management.component';
import { VehicleCatalogComponent } from './vehicles/presentation/pages/catalog/vehicle-catalog.component';
import { VehicleFormComponent } from './pages/vehicle-form/vehicle-form.component';
import { FinancialInstitutionsComponent } from './financial-institutions/presentation/pages/financial-institutions/financial-institutions.component';
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
      { path: 'clients', component: CustomerManagementComponent },
      { path: 'vehicles', component: VehicleCatalogComponent },
      { path: 'vehicles/new', component: VehicleFormComponent },
      { path: 'vehicles/:id', component: VehicleFormComponent },
      { path: 'entities', component: FinancialInstitutionsComponent },
      { path: 'simulation/new', component: SimulationComponent },
      { path: 'results/:id', component: ResultsComponent },
      { path: 'simulations', component: SimulationsListComponent },
      { path: 'config', component: ConfigComponent },
    ],
  },
  { path: '**', redirectTo: '' },
];
