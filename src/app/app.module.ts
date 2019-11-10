import { ListaModalComponent } from './component/lista-modal/lista-modal.component';
import { firebaseConfig } from './../environments/environment';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//Importaciones de Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule, FirestoreSettingsToken } from '@Angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';

//Forms ngModel
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//Google

import { Geolocation } from '@ionic-native/geolocation/ngx';

//Permisos

import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

@NgModule({
  declarations: [AppComponent, ListaModalComponent],
  entryComponents: [ListaModalComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
  AngularFireModule.initializeApp(firebaseConfig), AngularFireAuthModule, FormsModule, AngularFirestoreModule,
  AngularFireStorageModule],
  providers: [
    StatusBar,
    Geolocation,
    SplashScreen,
    AndroidPermissions,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
