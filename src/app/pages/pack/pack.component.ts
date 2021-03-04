import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pack',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pack.component.html',
  styleUrls: ['./pack.component.scss']
})
export class PackComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
