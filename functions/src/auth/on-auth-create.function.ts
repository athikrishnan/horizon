import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { UserRecord } from 'firebase-functions/lib/providers/auth';
import { UserDoc } from '../models/user-doc.model';

exports.onAuthCreate = functions.auth.user().onCreate(async (record: UserRecord) => {
  const userDoc: UserDoc = {
    uid: record.uid,
    email: record.email,
    phoneNumber: record.phoneNumber,
    displayName: record.displayName,
    photoURL: record.photoURL,
    isActive: false
  } as UserDoc;
  await admin.firestore().collection('users').doc(userDoc.uid).set(userDoc);
});