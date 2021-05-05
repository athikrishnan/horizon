import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ShowcasedImage } from 'src/app/models/showcased-image.model';
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
    private showcasedImageService: ShowcasedImageService) { }

  ngOnInit(): void {
    this.showcasedImageService.getShowcase().subscribe((images: ShowcasedImage[]) => {
      this.showcasedImages = images;
      this.showSpinner = false;
      this.ref.detectChanges();
    });
  }

}
