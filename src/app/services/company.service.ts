import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Company } from 'src/app/models/company.model';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private companyCollection: AngularFirestoreCollection<Company>;
  companies$: Observable<Company[]>;

  constructor(private store: AngularFirestore) {
    this.companyCollection = this.store.collection<Company>('companies');
    this.companies$ = this.companyCollection.valueChanges();
  }

  saveCompany(company: Company): Promise<void> {
    return this.companyCollection.doc(company.id).set(company);
  }
}
