import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import { Auth, authState } from '@angular/fire/auth';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { Store } from "@ngrx/store";

import * as fromApp from '../app.reducer';
import * as UI from '../shared/ui.actions';
import * as AUTH from './auth.actions';
import { AuthData } from "./auth-data.model";
import { TrainingService } from "../training/training.service";
import { UIService } from "../shared/ui.service";


@Injectable()
export class AuthService {

    constructor(
        private router: Router,
        private auth: Auth = inject(Auth),
        private trainingService: TrainingService,
        private uiService: UIService,
        private store: Store<fromApp.State>,
    ) { }

    initAuthListener() {
        authState(this.auth).subscribe(user => {
            if (user) {                
                this.store.dispatch(new AUTH.SetAuthenticated())
                this.router.navigate(['/training'])
            } else {
                this.trainingService.cancelFbSubscriptions();       
                this.store.dispatch(new AUTH.SetUnauthenticated())
                this.router.navigate(['/login']);
            }
        })
    }

    registerUser(authData: AuthData) {       
        this.store.dispatch(new UI.StartLoading());
        this.auth = getAuth();
        createUserWithEmailAndPassword(this.auth, authData.email, authData.password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user);                
                this.store.dispatch(new UI.StopLoading());
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                this.uiService.showSnackBar(errorCode, null, 3000);               
                this.store.dispatch(new UI.StopLoading());
            });
    }

    loginUser(authData: AuthData) {        
        this.store.dispatch(new UI.StartLoading());
        this.auth = getAuth();
        signInWithEmailAndPassword(this.auth, authData.email, authData.password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user);               
                this.store.dispatch(new UI.StopLoading());
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                this.uiService.showSnackBar(errorCode, null, 3000);              
                this.store.dispatch(new UI.StopLoading());
            });
    }

    logoutUser() {
        this.auth = getAuth();
        signOut(this.auth);
    }
}