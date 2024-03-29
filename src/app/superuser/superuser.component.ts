import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { User } from '../models/user.model';
import { SuperuserService } from './superuser.service';

@Component({
  selector: 'app-superuser',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './superuser.component.html',
  styleUrls: ['./superuser.component.scss']
})
export class SuperuserComponent implements OnInit {

  showSpinner = true;
  users: User[];
  @ViewChild('fileInput') fileInput: ElementRef;
  private srcResult: string;
  constructor(
    private ref: ChangeDetectorRef,
    private superuserService: SuperuserService) { }

  ngOnInit(): void {
    this.superuserService.getUsers().subscribe((users: User[]) => {
      this.users = users;
      this.showSpinner = false;
      this.ref.detectChanges();
    });
  }

  deactivate(user: User): void {
    this.showSpinner = true;
    this.superuserService.deactivateUser(user).then((response: User) => {
      const index: number = this.users.findIndex(u => u.uid === response.uid);
      this.users.splice(index, 1, response);
      this.showSpinner = false;
      this.ref.detectChanges();
    });
  }

  activate(user: User): void {
    this.showSpinner = true;
    this.superuserService.activateUser(user).then((response: User) => {
      const index: number = this.users.findIndex(u => u.uid === response.uid);
      this.users.splice(index, 1, response);
      this.showSpinner = false;
      this.ref.detectChanges();
    });
  }

  async onFileSelected(): Promise<void> {
    if (typeof (FileReader) !== 'undefined') {
      const reader = new FileReader();
      reader.onload = async (e: any) => {
        this.srcResult = e.target.result;
        await this.superuserService.uploadProducts(this.srcResult);
      };
      reader.readAsBinaryString(this.fileInput.nativeElement.files[0]);
    }
  }
}
