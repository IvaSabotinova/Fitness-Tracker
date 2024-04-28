import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrl: './sidenav-list.component.css'
})
export class SidenavListComponent implements OnInit, OnDestroy{
  @Output() sideNav = new EventEmitter<void>();
  isAuth = false;
  authSubscription: Subscription

  constructor(private authService: AuthService) { } 

  ngOnInit(): void {
    this.authSubscription = this.authService.authChange.subscribe(authStatus => 
        this.isAuth = authStatus
    );
  }

  sideNavClose() {
    this.sideNav.emit();
  }

  onLogout(){
    this.sideNavClose();
    this.authService.logoutUser();
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }
}
