import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { AuthService } from '../auth.service';
import { UIService } from '../../shared/ui.service';
import * as fromApp from '../../app.reducer';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit, OnDestroy {
  maxDate: Date;
  //isLoading = false;
  isLoading$: Observable<boolean>;
  //loadingStatusSubscription: Subscription

  constructor(private authService: AuthService, private uiService: UIService, private store: Store<fromApp.State>) { }

  ngOnInit(): void {
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
    // this.loadingStatusSubscription = this.uiService.loadingStatusChange.subscribe(status => {
    //   this.isLoading = status;
    // })
   this.isLoading$ = this.store.select(fromApp.getIsLoading);
  }

  onSubmit(form: NgForm) {
    this.authService.registerUser({
      email: form.value.email,
      password: form.value.password
    })
  }

  ngOnDestroy() {
    // if(this.loadingStatusSubscription){
    //   this.loadingStatusSubscription.unsubscribe();
    // }
  }
}
