import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-client-selection',
  changeDetection:  ChangeDetectionStrategy.OnPush,
  templateUrl: './client-selection.component.html',
  styleUrls: ['./client-selection.component.scss']
})
export class ClientSelectionComponent implements OnInit {
  showSpinner = true;

  constructor(private ref: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.showSpinner = false;
  }

}
