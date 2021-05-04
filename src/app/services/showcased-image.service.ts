import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { ProductImage } from '../models/product-image.model';
import { ShowcasedImage } from '../models/showcased-image.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ShowcasedImageService {
  private showcasedImageCollection: AngularFirestoreCollection<ShowcasedImage>;

  constructor(
    private store: AngularFirestore,
    private authService: AuthService) {
    this.showcasedImageCollection = this.store.collection<ShowcasedImage>('showcasedImages');
  }

  async addFromProductImage(name: string, image: ProductImage): Promise<void> {
    const showcasedImage: ShowcasedImage = {
      id: image.id,
      name,
      downloadURL: image.downloadURL,
      path: image.path,
      addedBy: this.authService.authUser,
      updatedAt: Date.now(),
      createdat: Date.now()
    } as ShowcasedImage;

    return this.showcasedImageCollection.doc(showcasedImage.id).set(showcasedImage);
  }

  async removeProductImage(image: ProductImage): Promise<void> {
    return this.showcasedImageCollection.doc(image.id).delete();
  }
}
