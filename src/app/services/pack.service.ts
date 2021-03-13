import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Pack } from 'src/app/models/pack.model';

@Injectable({
  providedIn: 'root'
})
export class PackService {
  private packCollection: AngularFirestoreCollection<Pack>;

  constructor(private store: AngularFirestore) {
    this.packCollection = this.store.collection<Pack>('packs');
  }

  getPacks(): Observable<Pack[]> {
    return this.packCollection.valueChanges().pipe(take(1));
  }

  getPack(id: string): Observable<Pack> {
    return this.packCollection.doc(id).valueChanges().pipe(take(1));
  }

  savePack(pack: Pack): Promise<void> {
    const isNew: boolean = !pack.id;

    if (isNew) {
      pack.id = this.store.createId();
      pack.createdAt = Date.now();
    }
    pack.updatedAt = Date.now();

    return this.packCollection.doc(pack.id).set(pack);
  }

  deletePack(pack: Pack): Promise<void> {
    return this.packCollection.doc(pack.id).delete();
  }
}
