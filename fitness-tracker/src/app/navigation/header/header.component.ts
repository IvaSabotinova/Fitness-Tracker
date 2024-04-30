import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { AuthService } from '../../auth/auth.service';
import * as fromApp from '../../app.reducer';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() sideNavEl = new EventEmitter<void>();
  //isAuth = false;
  authSubscription: Subscription;
  isAuth$: Observable<boolean>;

  constructor(private authService: AuthService, private store: Store<fromApp.State>) { }


  ngOnInit(): void {
  //  this.authSubscription = this.authService.authChange.subscribe(authStatus => {
  //     this.isAuth = authStatus
  //   });
     this.isAuth$ = this.store.select(fromApp.getIsAuth);
  }

  sideNavToggle() {
    this.sideNavEl.emit();
  }

  onLogout(){    
    this.authService.logoutUser();
  }

  ngOnDestroy(): void {
   // this.authSubscription.unsubscribe();
  }
}
