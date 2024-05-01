import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { AuthService } from '../../auth/auth.service';
import * as fromApp from '../../app.reducer';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrl: './sidenav-list.component.css'
})
export class SidenavListComponent implements OnInit {
  @Output() sideNav = new EventEmitter<void>();
  isAuth$: Observable<boolean>;

  constructor(private authService: AuthService, private store: Store<fromApp.State>) { }

  ngOnInit(): void {   
    this.isAuth$ = this.store.select(fromApp.getIsAuth);
  }

  sideNavClose() {
    this.sideNav.emit();
  }

  onLogout() {
    this.sideNavClose();
    this.authService.logoutUser();
  }
}
