import { Injectable } from "@angular/core";
import { GuardResult, MaybeAsync, Route, Router, UrlSegment } from "@angular/router";
import { Store } from "@ngrx/store";
import { take } from "rxjs";

import { AuthService } from "./auth.service";
import * as fromApp from '../app.reducer';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard {
    constructor(private authService: AuthService, private router: Router, private store: Store<fromApp.State>) { }

    //canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult>: deprecated interface CanActivate
    canActivate(): MaybeAsync<GuardResult> {
        // if (!this.authService.isAuth()) {
        //     return this.router.navigate(['/login'])
        // }  
        return this.store.select(fromApp.getIsAuth).pipe(take(1));
    }

    canLoad(route: Route, segments: UrlSegment[]): MaybeAsync<GuardResult> {
        // if (!this.authService.isAuth()) {
        //     return this.router.navigate(['/login'])
        // }     
        return this.store.select(fromApp.getIsAuth).pipe(take(1));
    }
}