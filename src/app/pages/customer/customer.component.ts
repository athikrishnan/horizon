import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  showSpinner = true;

  constructor() { }

  ngOnInit(): void {
    this.showSpinner = false;
  }
}
