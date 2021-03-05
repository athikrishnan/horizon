import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataComponent } from './mock-data.component';
import { MockDataRoutingModule } from './mock-data-routing.module';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [MockDataComponent],
  imports: [
    CommonModule,
    MockDataRoutingModule,
    MatCardModule,
    MatButtonModule
  ]
})
export class MockDataModule { }
