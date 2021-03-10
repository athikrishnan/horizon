import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Customer } from 'src/app/models/customer.model';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-customer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  showSpinner = true;
  recents: Customer[] = [];

  constructor(
    private customerService: CustomerService,
    private ref: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.customerService.getRecents().subscribe((recents: Customer[]) => {
      this.recents = recents;
      this.showSpinner = false;
      this.ref.detectChanges();
    });
  }
}
