import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, ReplaySubject } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { Product } from '../models/product.model';
import { SearchResult } from '../models/search-result.model';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class ProductSearchService {
  private readonly PRODUCT_SEARCH_ARCHIVE_KEY = 'horizon.search.archive.product';
  private results = new ReplaySubject<Product[]>(1);
  results$ = this.results.asObservable();
  private archive: SearchResult<Product>[] = [];

  constructor(
    private store: AngularFirestore,
    private productService: ProductService) {
    const archivedItems = localStorage.getItem(this.PRODUCT_SEARCH_ARCHIVE_KEY);
    if (archivedItems) {
      this.archive = JSON.parse(archivedItems);
      this.publishResults();
    }
  }

  searchProductsByName(search: string): Observable<Product[]> {
    return this.store.collection<Product>(
      'products',
      ref => ref.where('keywords', 'array-contains', search.toLowerCase()).limit(5)
    ).valueChanges().pipe(take(1), tap((products) => this.processResults(products)));
  }

  private processResults(products: Product[]): void {
    products.forEach((product: Product) => {
      const archivedItem = this.archive.find(i => i.result.id === product.id);
      if (archivedItem) {
        archivedItem.result = product;
        archivedItem.hits++;
        this.archive.splice(this.archive.indexOf(archivedItem), 1, archivedItem);
      } else {
        this.archive.push({ result: product, hits: 0 });
      }
    });
    this.publishResults();
  }

  private publishResults(): void {
    this.archive = this.archive.sort((a, b) => b.hits - a.hits);
    if (this.archive.length > 15) {
      this.archive.length = 15;
    }
    localStorage.setItem(this.PRODUCT_SEARCH_ARCHIVE_KEY, JSON.stringify(this.archive));
    const products: Product[] = this.archive.map((result: SearchResult<Product>) => result.result);
    this.results.next(products);
  }

  upVote(product: Product): void {
    const archivedItem = this.archive.find(i => i.result.id === product.id);
    archivedItem.hits++;
    this.archive.splice(this.archive.indexOf(archivedItem), 1, archivedItem);
    this.publishResults();
  }

  async refreshRecent(product: Product): Promise<Product> {
    return await this.productService.getProduct(product.id).toPromise().then((refreshed) => {
      (refreshed) ? this.updateArchive(refreshed) : this.removeArchive(product);
      return refreshed;
    });
  }

  private updateArchive(product: Product): void {
    const archivedItem = this.archive.find(i => i.result.id === product.id);
    if (archivedItem) {
      archivedItem.result = product;
      this.archive.splice(this.archive.indexOf(archivedItem), 1, archivedItem);
    }
    this.publishResults();
  }

  private removeArchive(product: Product): void {
    const archivedItem = this.archive.find(i => i.result.id === product.id);
    this.archive.splice(this.archive.indexOf(archivedItem), 1);
    this.publishResults();
  }
}
