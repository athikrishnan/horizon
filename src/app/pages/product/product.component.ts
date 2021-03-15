import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  showSpinner = true;
  searchForm: FormGroup = this.fb.group({
    search: null
  });
  recents: Product[] = [];
  results: Product[] = [];

  constructor(
    private productService: ProductService,
    private ref: ChangeDetectorRef,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.productService.getRecents().subscribe((recents: Product[]) => {
      this.recents = recents;
      this.showSpinner = false;
      this.ref.detectChanges();
    });

    this.searchForm.get('search').valueChanges.pipe(
      takeUntil(this.unsubscribe$),
      debounceTime(1000)
    ).subscribe((value: string) => {
      this.productService.searchProductsByName(value).subscribe((results: Product[]) => {
        this.results = results;
        this.ref.detectChanges();
      });
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
