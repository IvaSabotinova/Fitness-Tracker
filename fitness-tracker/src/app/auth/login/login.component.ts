import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs-compat';

import { AuthService } from '../auth.service';
import { UIService } from '../../shared/ui.service';
import * as fromApp from '../../app.reducer';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  // isLoading = false;
  isLoading$: Observable<boolean>;
 //private loadingStatusSubscription: Subscription

  constructor(
    private authService: AuthService,
    private uiService: UIService,
    private store: Store<fromApp.State>,
  ) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email]
      }),
      password: new FormControl('', {
        validators: [Validators.required]
      })
    });

    // this.loadingStatusSubscription = this.uiService.loadingStatusChange.subscribe(status => {
    //     this.isLoading = status;
    //   })

    //this.isLoading$ = this.store.pipe(map(state => state.ui.isLoading));
     this.isLoading$ = this.store.select(fromApp.getIsLoading);
  }

  onSubmit() {
    this.authService.loginUser({
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    });
  }

  ngOnDestroy() {
    // if (this.loadingStatusSubscription) {
    //   this.loadingStatusSubscription.unsubscribe();
    // }
  }
}