import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize, take, tap } from 'rxjs/operators';
import { ProductImage } from '../models/product-image.model';
import { ProductVariant } from '../models/product-variant.model';
import { Product } from '../models/product.model';
import { KeywordService } from './keyword.service';
import { ShowcasedImageService } from './showcased-image.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productCollection: AngularFirestoreCollection<Product>;

  constructor(
    private store: AngularFirestore,
    private storage: AngularFireStorage,
    private keywordService: KeywordService,
    private showcasedImageService: ShowcasedImageService) {
    this.productCollection = this.store.collection<Product>('products');
  }

  async saveProduct(product: Product): Promise<string> {
    const isNew: boolean = !product.id;

    if (isNew) {
      product.id = this.store.createId();
      product.createdAt = Date.now();
    }
    product.updatedAt = Date.now();
    product.keywords = this.keywordService.generateKeywords(product.name);

    return await this.productCollection.doc(product.id).set(product).then(() => {
      return product.id;
    });
  }

  getProduct(id: string): Observable<Product> {
    return this.productCollection.doc(id).valueChanges().pipe(take(1));
  }

  subscribeProduct(id: string): Observable<Product> {
    return this.productCollection.doc(id).valueChanges();
  }

  getRecents(): Observable<Product[]> {
    return this.store.collection<Product>('products', ref => ref.orderBy('createdAt', 'desc').limit(5))
      .valueChanges().pipe(take(1));
  }

  deleteProduct(product: Product): Promise<void> {
    return this.productCollection.doc(product.id).delete();
  }

  searchProductsByName(search: string): Observable<Product[]> {
    return this.store.collection<Product>(
      'products',
      ref => ref.where('keywords', 'array-contains', search.toLowerCase()).limit(5)
    ).valueChanges().pipe(take(1));
  }

  async saveVariant(product: Product, variant: ProductVariant): Promise<string> {
    if (!product.variants) {
      product.variants = [];
    }

    const isNew: boolean = !variant.id;

    variant.updatedAt = Date.now();
    if (isNew) {
      variant.id = this.store.createId();
      variant.createdAt = Date.now();
      product.variants.push(variant);
    } else {
      const index: number = product.variants.findIndex(i => i.id === variant.id);
      product.variants.splice(index, 1, variant);
    }

    return await this.saveProduct(product);
  }

  async deleteVariant(product: Product, variant: ProductVariant): Promise<string> {
    const index: number = product.variants.findIndex(i => i.id === variant.id);
    product.variants.splice(index, 1);

    return await this.saveProduct(product);
  }

  async uploadImageForProduct(product: Product, files: FileList): Promise<void> {
    for (let index = 0; index < files.length; index++) {
      const file = files.item(index);
      const path = `product/${product.id}/images/${Date.now()}_${file.name}`;
      const ref = this.storage.ref(path);
      await this.storage.upload(path, file).then(async () => {
        const downloadURL = await ref.getDownloadURL().toPromise();
        if (!product.images) { product.images = []; }
        product.images.push({
          id: this.store.createId(),
          downloadURL,
          path,
          isShowcased: false
        } as ProductImage);
        await this.saveProduct(product);
      });
    }
  }

  async removeImageForProduct(product: Product, image: ProductImage): Promise<string> {
    const ref = this.storage.ref(image.path);
    await ref.delete().toPromise();
    const index: number = product.images.findIndex(i => i.path === image.path);
    product.images.splice(index, 1);
    if (image.isShowcased) {
      await this.showcasedImageService.removeProductImage(image);
    }
    return await this.saveProduct(product);
  }

  async toggleImageShowcaseForProduct(product: Product, image: ProductImage): Promise<string> {
    const index: number = product.images.findIndex(i => i.path === image.path);
    product.images.splice(index, 1, image);
    if (image.isShowcased) {
      await this.showcasedImageService.addFromProductImage(product.name, image);
    } else {
      await this.showcasedImageService.removeProductImage(image);
    }
    return await this.saveProduct(product);
  }
}
