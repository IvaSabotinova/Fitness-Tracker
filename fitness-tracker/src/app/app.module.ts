import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { FirestoreModule, getFirestore, provideFirestore } from '@angular/fire/firestore';


import { AuthService } from './auth/auth.service';
import { TrainingService } from './training/training.service';
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material.module';
import { AppComponent } from './app.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { HeaderComponent } from './navigation/header/header.component';
import { SidenavListComponent } from './navigation/sidenav-list/sidenav-list.component';
import { environment } from '../environments/environment';
import { UIService } from './shared/ui.service';
import { AuthModule } from './auth/auth.module';
import { TrainingModule } from './training/training.module';


@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    HeaderComponent,
    SidenavListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    FirestoreModule,
    AngularFireModule,
    // AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,  
    AuthModule,
    TrainingModule
  ],
  providers: [AuthService, TrainingService, UIService],
  bootstrap: [AppComponent],
  // entryComponents: [StopTrainingComponent]
})
export class AppModule { }

