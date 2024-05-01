import { Injectable } from "@angular/core";
import { GuardResult, MaybeAsync} from "@angular/router";
import { Store } from "@ngrx/store";
import { take } from "rxjs";

import * as fromApp from '../app.reducer';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard {
    constructor(private store: Store<fromApp.State>) { }

    //canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult>: deprecated interface CanActivate
    canActivate(): MaybeAsync<GuardResult> {    
        return this.store.select(fromApp.getIsAuth).pipe(take(1));
    }

    // canLoad(route: Route, segments: UrlSegment[]): MaybeAsync<GuardResult>
    canLoad(): MaybeAsync<GuardResult> {       
        return this.store.select(fromApp.getIsAuth).pipe(take(1));
    }
}