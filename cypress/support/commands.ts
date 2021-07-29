declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * login to firebase emulator
       * @example cy.login()
       */
      login(): void;
    }
  }
}

import firebase from 'firebase/app';
import 'firebase/auth';
import { environment } from '../../src/environments/environment';
firebase.initializeApp(environment.firebase);

Cypress.Commands.add('login', async () => {
  indexedDB.deleteDatabase('firebaseLocalStorageDb');
  indexedDB.deleteDatabase('firebase-installations-database');
  firebase.auth().useEmulator('http://localhost:5003');
  await firebase.auth().signInWithEmailAndPassword('admin@cypress.dev', 'cypress');
});
