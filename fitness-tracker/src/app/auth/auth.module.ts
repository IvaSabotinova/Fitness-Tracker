import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { getAuth, provideAuth } from "@angular/fire/auth";

import { SignupComponent } from "./signup/signup.component";
import { LoginComponent } from "./login/login.component";
import { SharedModule } from "../shared/shared.module";
import { AuthRoutingModule } from "./auth-routing.module";

@NgModule({
    declarations: [
        SignupComponent,
        LoginComponent
    ],
    imports: [      
         ReactiveFormsModule,        
         AngularFireAuthModule,
         provideAuth(() => getAuth()),
         SharedModule,
         AuthRoutingModule
    ],
})
export class AuthModule { }