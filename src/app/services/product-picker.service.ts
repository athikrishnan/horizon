import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ReplaySubject } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductPickerService {
  private products = new ReplaySubject<Product[]>(1);
  products$ = this.products.asObservable();

  constructor(private store: AngularFirestore) {
    this.store.collection<Product>('products').valueChanges().subscribe((products) => {
      this.products.next(products);
    });
  }
}
