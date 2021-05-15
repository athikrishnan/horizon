import firebase from "firebase/app";
import "firebase/auth";
import { environment } from '../../src/environments/environment';

Cypress.Commands.add('login', async () => {
  indexedDB.deleteDatabase('firebaseLocalStorageDb');
  firebase.initializeApp(environment.firebase);
  firebase.auth().useEmulator('http://localhost:5003');
  await firebase.auth().signInWithEmailAndPassword('cypress@test.dev', 'cypress');
})