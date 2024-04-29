import { Injectable } from "@angular/core";
import { CanLoad, GuardResult, MaybeAsync, Route, Router, UrlSegment } from "@angular/router";

import { AuthService } from "./auth.service";

@Injectable({
    providedIn: 'root'
})
export class AuthGuard {
    constructor(private authService: AuthService, private router: Router) { }

    //canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult>: deprecated interface CanActivate
    canActivate(): MaybeAsync<GuardResult> {
        if (!this.authService.isAuth()) {
            return this.router.navigate(['/login'])
        }     
    }

    canLoad(route: Route, segments: UrlSegment[]): MaybeAsync<GuardResult> {
        if (!this.authService.isAuth()) {
            return this.router.navigate(['/login'])
        }     
    }
}