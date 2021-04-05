import {
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef,
  EventEmitter, OnDestroy, OnInit, Output, ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, take, takeUntil } from 'rxjs/operators';
import { Product } from 'src/app/models/product.model';
import { ProductSearchService } from 'src/app/services/product-search.service';

@Component({
  selector: 'app-product-search',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.scss']
})
export class ProductSearchComponent implements OnInit, AfterViewInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  @Output() cancel = new EventEmitter<boolean>();
  @Output() productSelect = new EventEmitter<Product>();
  @ViewChild('search') search: ElementRef;
  searchForm: FormGroup = this.fb.group({
    search: null
  });
  get timestamp(): number { return Date.now(); }
  results: Product[] = [];
  recents: Product[] = [];

  constructor(
    private fb: FormBuilder,
    private productSearchService: ProductSearchService,
    private ref: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.searchForm.get('search').valueChanges.pipe(
      takeUntil(this.unsubscribe$),
      debounceTime(1000)
    ).subscribe((value: string) => {
      this.productSearchService.searchProductsByName(value).subscribe((products: Product[]) => {
        this.results = products;
        this.ref.detectChanges();
      });
    });

    this.productSearchService.results$.pipe(take(1)).subscribe((products: Product[]) => {
      this.recents = products;
      this.ref.detectChanges();
    });
  }

  ngAfterViewInit(): void {
    this.search.nativeElement.focus();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onClose(): void {
    this.cancel.emit(true);
  }

  onSelectProduct(product: Product): void {
    this.productSelect.emit(product);
    this.productSearchService.upVote(product);
  }
}
