import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { MaterialModule } from './material/material.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { DeleteConfirmationComponent } from './components/delete-confirmation/delete-confirmation.component';
import { USE_EMULATOR as FIRESTORE_EMULATOR } from '@angular/fire/firestore';
import { USE_EMULATOR as FUNCTIONS_EMULATOR } from '@angular/fire/functions';
import { AngularFireAuth, USE_EMULATOR as AUTH_EMULATOR } from '@angular/fire/auth';
import { LoginComponent } from './components/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    PageNotFoundComponent,
    DeleteConfirmationComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    AngularFireModule.initializeApp(environment.firebase),
  ],
  bootstrap: [AppComponent],
  exports: [
    ToolbarComponent
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [AngularFireAuth],
      useFactory: initializeAuthApp
    },
    {
      provide: AUTH_EMULATOR,
      useValue: environment.useEmulators ? ['localhost', 5003] : undefined,
    },
    {
      provide: FIRESTORE_EMULATOR,
      useValue: environment.useEmulators ? ['localhost', 5002] : undefined,
    },
    {
      provide: FUNCTIONS_EMULATOR,
      useValue: environment.useEmulators ? ['localhost', 5001] : undefined,
    }
  ]
})
export class AppModule { }

export function initializeAuthApp(afAuth: AngularFireAuth): () => Promise<null> {
  return () => {
    return new Promise<null>((resolve) => {
      if (!environment.useEmulators) {
        return resolve(null);
      } else {
        afAuth.useEmulator(`http://${location.hostname}:5003/`).then(() => {
          resolve(null);
        });
      }
    });
  };
}
