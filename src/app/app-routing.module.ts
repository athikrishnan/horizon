import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { DevEnvGuard } from './dev/dev-env.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'company',
    loadChildren: () => import('./pages/company/company.module').then(m => m.CompanyModule)
  },
  {
    path: 'supplier',
    loadChildren: () => import('./pages/supplier/supplier.module').then(m => m.SupplierModule)
  },
  {
    path: 'invoice',
    loadChildren: () => import('./pages/invoice/invoice.module').then(m => m.InvoiceModule)
  },
  {
    path: 'customer',
    loadChildren: () => import('./pages/customer/customer.module').then(m => m.CustomerModule)
  },
  {
    path: 'mock-data',
    loadChildren: () => import('./dev/mock-data/mock-data.module').then(m => m.MockDataModule),
    canLoad: [DevEnvGuard]
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
