import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationComponent } from 'src/app/components/delete-confirmation/delete-confirmation.component';
import { ShowcasedImage } from 'src/app/models/showcased-image.model';
import { AlertService } from 'src/app/services/alert.service';
import { ShowcasedImageService } from 'src/app/services/showcased-image.service';

@Component({
  selector: 'app-showcase',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './showcase.component.html',
  styleUrls: ['./showcase.component.scss']
})
export class ShowcaseComponent implements OnInit {

  showSpinner = true;
  showcasedImages: ShowcasedImage[] = [];
  constructor(
    private ref: ChangeDetectorRef,
    private showcasedImageService: ShowcasedImageService,
    private dialog: MatDialog,
    private alertService: AlertService) { }

  ngOnInit(): void {
    this.showcasedImageService.getShowcase().subscribe((images: ShowcasedImage[]) => {
      this.showcasedImages = images;
      this.showSpinner = false;
      this.ref.detectChanges();
    });
  }

  onDelete(image: ShowcasedImage): void {
    this.dialog.open(DeleteConfirmationComponent).afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.showSpinner = true;
        this.ref.detectChanges();
        this.showcasedImageService.deleteImage(image).then(() => {
          this.alertService.alert('Image removed from showcase!');
          const index = this.showcasedImages.findIndex(i => i.id === image.id);
          this.showcasedImages.splice(index, 1);
          this.showSpinner = false;
          this.ref.detectChanges();
        });
      }
    });
  }
}
