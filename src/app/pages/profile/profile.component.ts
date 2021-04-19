import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { ProfileService } from './profile.service';

@Component({
  selector: 'app-profile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  showSpinner = true;
  user: User;

  constructor(
    private ref: ChangeDetectorRef,
    private profileService: ProfileService) { }

  ngOnInit(): void {
    this.profileService.getProfile().subscribe((user: User) => {
      this.user = user;
      this.showSpinner = false;
      this.ref.detectChanges();
    });
  }
}
