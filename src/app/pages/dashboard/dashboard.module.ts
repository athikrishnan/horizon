import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashbord-routing.module';
import { MaterialModule } from 'src/app/material/material.module';
import { DashboardService } from './dashboard.service';
import { AppPipeModule } from 'src/app/pipes/app-pipe.module';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MaterialModule,
    AppPipeModule
  ],
  providers: [
    DashboardService
  ]
})
export class DashboardModule { }
