import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { AuthService } from '../../auth/auth.service';
import * as fromApp from '../../app.reducer';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  @Output() sideNavEl = new EventEmitter<void>();
  isAuth$: Observable<boolean>;

  constructor(private authService: AuthService, private store: Store<fromApp.State>) { }


  ngOnInit(): void {
     this.isAuth$ = this.store.select(fromApp.getIsAuth);
  }

  sideNavToggle() {
    this.sideNavEl.emit();
  }

  onLogout(){    
    this.authService.logoutUser();
  }
}
