import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { BrandType } from '../enums/brand-type.enum';
import { ProductUnit } from '../enums/product-unit.enum';
import { ProductVariant } from '../models/product-variant.model';
import { Product } from '../models/product.model';
import { Slab } from '../models/slab.model';
import { UploadedProduct } from '../models/uploaded-product.model';
import { User } from '../models/user.model';

@Injectable()
export class SuperuserService {
  constructor(private store: AngularFirestore) { }

  getUsers(): Observable<User[]> {
    return this.store.collection<User>('users').valueChanges().pipe(
      map((response) => response.filter((user: User) => !user.isSuperuser)), take(5));
  }

  async deactivateUser(user: User): Promise<User> {
    user.isActive = false;
    await this.store.collection<User>('users').doc(user.uid).set(user);
    return new Promise(() => user);
  }

  async activateUser(user: User): Promise<User> {
    user.isActive = true;
    await this.store.collection<User>('users').doc(user.uid).set(user);
    return new Promise(() => user);
  }

  async uploadProducts(productString: string): Promise<void> {
    const uploadedProducts: UploadedProduct[] = this.parseUploadedProducts(productString);
    const mappedProducts: Product[] = this.mapToProducts(uploadedProducts);
    mappedProducts.forEach(product => {
      this.store.collection<Product>('products').doc(product.id).set(product);
    });
  }

  private parseUploadedProducts(productString: string): UploadedProduct[] {
    const arr = productString.split('\n');
    const jsonObj = [];
    const headers = arr[0].split(',');
    for (let i = 1; i < arr.length; i++) {
      const data = arr[i].split(',');
      const obj = {};
      for (let j = 0; j < data.length; j++) {
        obj[headers[j].trim()] = data[j].trim();
      }
      jsonObj.push(obj);
    }
    return jsonObj as UploadedProduct[];
  }

  private mapToProducts(uploadedProducts: UploadedProduct[]): Product[] {
    const products: Product[] = [];
    uploadedProducts.forEach(item => {
      let product = products.find((i) => i.id === item.productId);
      if (!product) {
        product = this.mapToProduct(item);
        product.variants.push(this.mapToVariant(item));
        products.push(product);
      } else {
        product.variants.push(this.mapToVariant(item));
        const index: number = products.findIndex(i => i.id === product.id);
        products.splice(index, 1, product);
      }
    });
    return products;
  }

  private mapToProduct(uploadedProduct: UploadedProduct): Product {
    return {
      id: uploadedProduct.productId,
      code: null,
      name: uploadedProduct.productName,
      keywords: [],
      brand: uploadedProduct.brand as BrandType,
      slab: { name: 'Ice Cream', hsn: '21050000', sgst: 9, cgst: 9 } as Slab,
      unit: ProductUnit.Litre,
      category: uploadedProduct.category,
      size: +uploadedProduct.productSize,
      images: [],
      variants: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    } as Product;
  }

  private mapToVariant(uploadedProduct: UploadedProduct): ProductVariant {
    return {
      id: uploadedProduct.itemId,
      name: uploadedProduct.itemName,
      size: +uploadedProduct.itemSize,
      price: +uploadedProduct.dealerPrice,
      buyingPrice: +uploadedProduct.buyingPrice,
      retailPrice: +uploadedProduct.unitPrice,
      quantity: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    } as ProductVariant;
  }
}
