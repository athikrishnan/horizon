import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

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
    path: 'item',
    loadChildren: () => import('./pages/item/item.module').then(m => m.ItemModule)
  },
  {
    path: 'pack',
    loadChildren: () => import('./pages/pack/pack.module').then(m => m.PackModule)
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
