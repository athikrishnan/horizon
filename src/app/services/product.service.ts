import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Product } from '../models/product.model';
import { KeywordService } from './keyword.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productCollection: AngularFirestoreCollection<Product>;

  constructor(
    private store: AngularFirestore,
    private keywordService: KeywordService) {
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

  getRecents(): Observable<Product[]> {
    return this.store.collection<Product>('products', ref => ref.orderBy('createdAt').limit(5))
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
}
