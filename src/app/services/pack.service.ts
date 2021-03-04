import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Pack } from 'src/app/models/pack.model';

@Injectable({
  providedIn: 'root'
})
export class PackService {
  private packCollection: AngularFirestoreCollection<Pack>;
  packs$: Observable<Pack[]>;

  constructor(private store: AngularFirestore) {
    this.packCollection = this.store.collection('packs');
    this.packs$ = this.packCollection.valueChanges();
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

  deletePack(pack: Pack): void {
    this.packCollection.doc(pack.id).delete();
  }
}
