import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataComponent } from './mock-data.component';
import { MockDataRoutingModule } from './mock-data-routing.module';

@NgModule({
  declarations: [MockDataComponent],
  imports: [
    CommonModule,
    MockDataRoutingModule
  ]
})
export class MockDataModule { }
