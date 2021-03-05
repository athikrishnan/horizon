import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as Faker from 'faker';
import { Observable } from 'rxjs';
import { CompanyAddress } from 'src/app/models/company-address.model';
import { Company } from 'src/app/models/company.model';
import { Item } from 'src/app/models/item.model';
import { Supplier } from 'src/app/models/supplier.model';

@Injectable()
export class MockDataService {
  private companyCollection: AngularFirestoreCollection<Company>;
  private supplierCollection: AngularFirestoreCollection<Supplier>;
  suppliers$: Observable<Supplier[]>;
  private itemCollection: AngularFirestoreCollection<Item>;
  items$: Observable<Item[]>;

  constructor(private store: AngularFirestore) {
    this.companyCollection = this.store.collection<Company>('companies');
    this.supplierCollection = this.store.collection<Supplier>('suppliers');
    this.suppliers$ =  this.supplierCollection.valueChanges();
    this.itemCollection = this.store.collection<Item>('items');
    this.items$ =  this.itemCollection.valueChanges();
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

  generateItem(supplier: Supplier): void {
    const item: Item = {
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

    this.itemCollection.doc(item.id).set(item);
  }
}
