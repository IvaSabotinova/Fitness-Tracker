import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { AuthService } from '../../auth/auth.service';
import * as fromApp from '../../app.reducer';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrl: './sidenav-list.component.css'
})
export class SidenavListComponent implements OnInit, OnDestroy {
  @Output() sideNav = new EventEmitter<void>();
  //isAuth = false;
  isAuth$: Observable<boolean>;
  //authSubscription: Subscription

  constructor(private authService: AuthService, private store: Store<fromApp.State>) { }

  ngOnInit(): void {
    // this.authSubscription = this.authService.authChange.subscribe(authStatus => 
    //     this.isAuth = authStatus
    // );
    this.isAuth$ = this.store.select(fromApp.getIsAuth);
  }

  sideNavClose() {
    this.sideNav.emit();
  }

  onLogout() {
    this.sideNavClose();
    this.authService.logoutUser();
  }

  ngOnDestroy(): void {
    //this.authSubscription.unsubscribe();
  }
}
