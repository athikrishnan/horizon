import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
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
  profileForm: FormGroup = this.fb.group({
    displayName: [null, Validators.required]
  });

  constructor(
    private ref: ChangeDetectorRef,
    private profileService: ProfileService,
    private fb: FormBuilder) { }

  async ngOnInit(): Promise<void> {
    await this.profileService.getProfile().then((user: User) => {
      this.user = user;
      this.profileForm.patchValue(this.user);
      this.showSpinner = false;
      this.ref.detectChanges();
    });
  }

  onSave(): void {
    this.showSpinner = true;
    let user: User = this.profileForm.getRawValue() as User;
    user = Object.assign(this.user, user);
    this.profileService.updateProfile(user).then(() => {
      this.showSpinner = false;
      this.ref.detectChanges();
    });
  }
}
