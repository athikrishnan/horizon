import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as Faker from 'faker';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ProductUnit } from 'src/app/enums/product-unit.enum';
import { Company } from 'src/app/models/company.model';
import { Customer } from 'src/app/models/customer.model';
import { ProductVariant } from 'src/app/models/product-variant.model';
import { Product } from 'src/app/models/product.model';
import { Slab } from 'src/app/models/slab.model';
import { Supplier } from 'src/app/models/supplier.model';
import { KeywordService } from 'src/app/services/keyword.service';

@Injectable()
export class MockDataService {
  private companyCollection: AngularFirestoreCollection<Company>;
  private supplierCollection: AngularFirestoreCollection<Supplier>;
  suppliers$: Observable<Supplier[]>;
  private suppliers: Supplier[] = [];
  private customerCollection: AngularFirestoreCollection<Customer>;
  customers$: Observable<Customer[]>;
  private slabCollection: AngularFirestoreCollection<Slab>;
  slabs$: Observable<Slab[]>;
  private productCollection: AngularFirestoreCollection<Product>;
  products$: Observable<Product[]>;

  constructor(
    private store: AngularFirestore,
    private keywordService: KeywordService) {
    this.companyCollection = this.store.collection<Company>('companies');
    this.supplierCollection = this.store.collection<Supplier>('suppliers');
    this.suppliers$ = this.supplierCollection.valueChanges().pipe(tap(all => this.suppliers = all));
    this.customerCollection = this.store.collection<Customer>('customers');
    this.customers$ = this.customerCollection.valueChanges();
    this.slabCollection = this.store.collection<Slab>('slabs');
    this.slabs$ = this.slabCollection.valueChanges();
    this.productCollection = this.store.collection<Product>('products');
    this.products$ = this.productCollection.valueChanges();
  }

  generateCompanyDetails(): void {
    const company: Company = {
      id: '1',
      name: 'RVS Enterprises',
      phone: Faker.phone.phoneNumber(),
      email: 'admin@rvs.in',
      pan: Faker.finance.routingNumber(),
      gstin: Faker.finance.account(),
      currency: 'INR',
      address: {
        street: 'North Street',
        city: 'Nagercoil',
        state: 'Tamilnadu',
        zip: '629004',
        country: 'India'
      }
    };

    this.companyCollection.doc(company.id).set(company);
  }

  generateSupplier(): void {
    const name = Faker.name.firstName();
    const supplier: Supplier = {
      id: Faker.random.uuid(),
      name,
      code: 0,
      location: Faker.address.city(),
      gstin: Faker.random.uuid(),
      phone: Faker.phone.phoneNumber(),
      email: Faker.internet.email(),
      keywords: this.keywordService.generateKeywords(name),
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    this.supplierCollection.doc(supplier.id).set(supplier);
  }

  generateCustomer(): void {
    const name = Faker.name.firstName();
    const storeName = Faker.name.brand();
    const customer: Customer = {
      id: Faker.random.uuid(),
      name,
      storeName,
      gstin: Faker.random.uuid(),
      code: 0,
      address: {
        street: Faker.address.streetName(),
        locality: Faker.address.secondaryAddress(),
        city: Faker.address.city(),
        state: '33-Tamilnadu',
        zip: Faker.address.zipCode()
      },
      phone: Faker.phone.phoneNumber(),
      email: Faker.internet.email(),
      keywords: this.keywordService.generateKeywords(name),
      account: { balance: 0, received: 0 },
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    this.customerCollection.doc(customer.id).set(customer);
  }

  generateSlabs(): void {
    const slabs: Slab[] = [
      { id: Faker.random.uuid(), name: 'High', hsn: '1234365', cgst: 9, sgst: 9,
        createdAt: Date.now(), updatedAt: Date.now() },
      { id: Faker.random.uuid(), name: 'Medium', hsn: '9875465', cgst: 8, sgst: 8,
        createdAt: Date.now(), updatedAt: Date.now() },
      { id: Faker.random.uuid(), name: 'Low', hsn: '9893434', cgst: 6, sgst: 6,
        createdAt: Date.now(), updatedAt: Date.now() }
    ];

    slabs.forEach(slab => this.slabCollection.doc(slab.id).set(slab));
  }

  generateProduct(slabs: Slab[]): void {
    const name = Faker.commerce.productName();
    const product: Product = {
      id: Faker.random.uuid(),
      name,
      slab: this.getRandom<Slab>(slabs),
      unit: this.getRandom<ProductUnit>([ProductUnit.Grams, ProductUnit.Litre, ProductUnit.Each]),
      keywords: this.keywordService.generateKeywords(name),
      variants: [],
      updatedAt: Date.now(),
      createdAt: Date.now()
    } as Product;

    for (let i = 0; i < 3; i++) {
      const variant: ProductVariant = {
        id: Faker.random.uuid(),
        size: Faker.random.number({ min: 1, max: 100}),
        price: Faker.random.number({ min: 1, max: 100}),
        quantity: 0,
        updatedAt: Date.now(),
        createdAt: Date.now()
      } as ProductVariant;
      product.variants.push(variant);
    }

    this.productCollection.doc(product.id).set(product);
  }

  private getRandom<T>(collection: T[]): T | null {
    if (!collection.length) {
      return null;
    }

    const random: T = collection[Faker.random.number({ min: 0, max: (collection.length - 1) })];
    return (random !== undefined) ? random : null;
  }
}
