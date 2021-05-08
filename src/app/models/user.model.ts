export interface User {
  uid: string;
  email?: string;
  phoneNumber?: string;
  displayName?: string;
  photoURL?: string;
  isActive?: boolean;
  isSuperuser?: boolean;
}
