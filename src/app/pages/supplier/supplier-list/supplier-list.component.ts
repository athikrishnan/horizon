import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-supplier-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.scss']
})
export class SupplierListComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
