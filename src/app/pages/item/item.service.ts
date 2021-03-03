import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Item } from 'src/app/models/item.model';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private itemCollection: AngularFirestoreCollection<Item>;
  items$: Observable<Item[]>;

  constructor(private store: AngularFirestore) {
    this.itemCollection = this.store.collection('items');
    this.items$ = this.itemCollection.valueChanges();
  }

  saveItem(item: Item): Promise<void> {
    const isNew: boolean = !item.id;

    if (isNew) {
      item.id = this.store.createId();
      item.createdAt = Date.now();
    }
    item.updatedAt = Date.now();

    return this.itemCollection.doc(item.id).set(item);
  }

  deleteItem(item: Item): void {
    this.itemCollection.doc(item.id).delete();
  }
}
