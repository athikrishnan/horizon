import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-supplier-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './supplier-form.component.html',
  styleUrls: ['./supplier-form.component.scss']
})
export class SupplierFormComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
