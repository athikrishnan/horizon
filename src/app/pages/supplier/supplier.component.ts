import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-supplier',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.scss']
})
export class SupplierComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
