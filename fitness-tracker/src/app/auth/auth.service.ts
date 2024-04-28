import { Subject } from "rxjs";
import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import { Auth, authState } from '@angular/fire/auth';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

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
        private uiService: UIService
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
        this.uiService.loadingStatusChange.next(true);
        this.auth = getAuth();
        createUserWithEmailAndPassword(this.auth, authData.email, authData.password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user);
                this.uiService.loadingStatusChange.next(false);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;               
                this.uiService.showSnackBar(errorCode, null, 3000);
                this.uiService.loadingStatusChange.next(false);

            });
    }

    loginUser(authData: AuthData) {
        this.uiService.loadingStatusChange.next(true);
        this.auth = getAuth();
        signInWithEmailAndPassword(this.auth, authData.email, authData.password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user);
                this.uiService.loadingStatusChange.next(false);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;               
                this.uiService.showSnackBar(errorCode, null, 3000);
                this.uiService.loadingStatusChange.next(false);
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