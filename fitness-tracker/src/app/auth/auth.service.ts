import { Subject } from "rxjs";
import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import { Auth, authState } from '@angular/fire/auth';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { Store } from "@ngrx/store";

import * as fromApp from '../app.reducer';
import * as uiActions from '../shared/ui.actions';
import { AuthData } from "./auth-data.model";
import { TrainingService } from "../training/training.service";
import { UIService } from "../shared/ui.service";


@Injectable()
export class AuthService {
    authChange = new Subject<boolean>();
    private isAuthenticated = false;

    constructor(
        private router: Router,
        private auth: Auth = inject(Auth),
        private trainingService: TrainingService,
        private uiService: UIService,
        private store: Store<fromApp.State>
    ) { }

    initAuthListener() {
        authState(this.auth).subscribe(user => {
            if (user) {
                this.isAuthenticated = true;
                this.authChange.next(true);
                this.router.navigate(['/training'])
            } else {
                this.trainingService.cancelFbSubscriptions();
                this.authChange.next(false);
                this.router.navigate(['/login']);
                this.isAuthenticated = false;
            }
        })
    }

    registerUser(authData: AuthData) {
        // this.uiService.loadingStatusChange.next(true);
       // this.store.dispatch({ type: 'START_LOADING' });
        this.store.dispatch(new uiActions.StartLoading());
        this.auth = getAuth();
        createUserWithEmailAndPassword(this.auth, authData.email, authData.password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user);
                //this.uiService.loadingStatusChange.next(false);
               // this.store.dispatch({ type: 'STOP_LOADING' });
                this.store.dispatch(new uiActions.StopLoading());
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                this.uiService.showSnackBar(errorCode, null, 3000);
                // this.uiService.loadingStatusChange.next(false);
              //  this.store.dispatch({ type: 'STOP_LOADING' });
                this.store.dispatch(new uiActions.StopLoading());
            });
    }

    loginUser(authData: AuthData) {
        //this.uiService.loadingStatusChange.next(true);
       // this.store.dispatch({ type: 'START_LOADING' });
        this.store.dispatch(new uiActions.StartLoading());
        this.auth = getAuth();
        signInWithEmailAndPassword(this.auth, authData.email, authData.password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user);
                // this.uiService.loadingStatusChange.next(false);
               // this.store.dispatch({ type: 'STOP_LOADING' });
                this.store.dispatch(new uiActions.StopLoading());
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                this.uiService.showSnackBar(errorCode, null, 3000);
               //this.uiService.loadingStatusChange.next(false);
               //this.store.dispatch({ type: 'STOP_LOADING' });
               this.store.dispatch(new uiActions.StopLoading());
            });
    }

    logoutUser() {
        this.auth = getAuth();
        signOut(this.auth);
    }

    isAuth() {
        return this.isAuthenticated;
    }
}