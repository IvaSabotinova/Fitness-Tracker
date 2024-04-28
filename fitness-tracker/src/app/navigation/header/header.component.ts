import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() sideNavEl = new EventEmitter<void>();
  isAuth = false;
  authSubscription: Subscription;

  constructor(private authService: AuthService) { }


  ngOnInit(): void {
   this.authSubscription = this.authService.authChange.subscribe(authStatus => {
      this.isAuth = authStatus
    });
  }

  sideNavToggle() {
    this.sideNavEl.emit();
  }

  onLogout(){    
    this.authService.logoutUser();
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }
}
