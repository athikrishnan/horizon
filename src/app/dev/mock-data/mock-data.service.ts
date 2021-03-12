import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as Faker from 'faker';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Company } from 'src/app/models/company.model';
import { Customer } from 'src/app/models/customer.model';
import { Item } from 'src/app/models/item.model';
import { Pack } from 'src/app/models/pack.model';
import { Supplier } from 'src/app/models/supplier.model';
import { KeywordService } from 'src/app/services/keyword.service';

@Injectable()
export class MockDataService {
  private companyCollection: AngularFirestoreCollection<Company>;
  private supplierCollection: AngularFirestoreCollection<Supplier>;
  suppliers$: Observable<Supplier[]>;
  private suppliers: Supplier[] = [];
  private itemCollection: AngularFirestoreCollection<Item>;
  items$: Observable<Item[]>;
  private items: Item[] = [];
  private packCollection: AngularFirestoreCollection<Pack>;
  packs$: Observable<Pack[]>;
  private packs: Pack[] = [];
  private customerCollection: AngularFirestoreCollection<Customer>;
  customers$: Observable<Customer[]>;

  constructor(
    private store: AngularFirestore,
    private keywordService: KeywordService) {
    this.companyCollection = this.store.collection<Company>('companies');
    this.supplierCollection = this.store.collection<Supplier>('suppliers');
    this.suppliers$ =  this.supplierCollection.valueChanges().pipe(tap(all => this.suppliers = all));
    this.itemCollection = this.store.collection<Item>('items');
    this.items$ =  this.itemCollection.valueChanges().pipe(tap(all => this.items = all));
    this.packCollection = this.store.collection<Pack>('packs');
    this.packs$ =  this.packCollection.valueChanges().pipe(tap(all => this.packs = all));
    this.customerCollection = this.store.collection<Customer>('customers');
    this.customers$ = this.customerCollection.valueChanges();
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
    const supplier: Supplier = {
      id: Faker.random.uuid(),
      name: Faker.company.companyName(),
      location: Faker.address.city(),
      phone: Faker.phone.phoneNumber(),
      email: Faker.internet.email(),
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    this.supplierCollection.doc(supplier.id).set(supplier);
  }

  generateItem(): void {
    const supplier: Supplier = this.getRandom<Supplier>(this.suppliers);
    const data: Item = {
      id: Faker.random.uuid(),
      supplier: {
        id: supplier.id,
        name: supplier.name,
      },
      name: Faker.commerce.productName(),
      quantity: Math.floor(Math.random() * 100) + 1  ,
      price: Faker.commerce.price(),
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    this.itemCollection.doc(data.id).set(data);
  }

  generatePack(): void {
    const supplier: Supplier = this.getRandom<Supplier>(this.suppliers);
    const isPack: boolean = this.getRandom<boolean>([true, false]);
    const contains = {
      isPack,
      id: null,
      name: null,
    };

    if (contains.isPack) {
      const pack: Pack = this.getRandom<Pack>(this.packs);
      contains.id = pack.id;
      contains.name = pack.name;
    } else {
      const item: Item = this.getRandom<Item>(this.items);
      contains.id = item.id;
      contains.name = item.name;
    }

    const data: Pack = {
      id: Faker.random.uuid(),
      supplier: {
        id: supplier.id,
        name: supplier.name,
      },
      name: Faker.commerce.productName(),
      quantity: Math.floor(Math.random() * 100) + 1  ,
      price: Faker.commerce.price(),
      contains: {
        isPack,
        id: contains.id,
        name: contains.name
      },
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    this.packCollection.doc(data.id).set(data);
  }

  generateCustomer(): void {
    const name = Faker.name.firstName();
    const customer: Customer = {
      id: Faker.random.uuid(),
      name,
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
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    this.customerCollection.doc(customer.id).set(customer);
  }

  private getRandom<T>(collection: T[]): T | null {
    if (!collection.length) {
      return null;
    }

    const random: T = collection[Faker.random.number({ min: 0, max: (collection.length - 1) })];
    return (random !== undefined) ? random : null;
  }
}
