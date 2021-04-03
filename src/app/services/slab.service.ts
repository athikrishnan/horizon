import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Slab } from 'src/app/models/slab.model';

@Injectable({
  providedIn: 'root'
})
export class SlabService {
  private slabCollection: AngularFirestoreCollection<Slab>;

  constructor(private store: AngularFirestore) {
    this.slabCollection = this.store.collection<Slab>('slabs');
  }

  getSlabs(): Observable<Slab[]> {
    return this.slabCollection.valueChanges().pipe(take(1));
  }

  getSlab(id: string): Observable<Slab> {
    return this.slabCollection.doc(id).valueChanges().pipe(take(1));
  }

  saveSlab(slab: Slab): Promise<void> {
    const isNew: boolean = !slab.id;

    if (isNew) {
      slab.id = this.store.createId();
      slab.createdAt = Date.now();
    }
    slab.updatedAt = Date.now();

    return this.slabCollection.doc(slab.id).set(slab);
  }

  deleteSlab(slab: Slab): Promise<void> {
    return this.slabCollection.doc(slab.id).delete();
  }
}
