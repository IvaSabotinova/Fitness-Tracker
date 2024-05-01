import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { TrainingService } from './training.service';
import * as fromTraining from './training.reducer';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrl: './training.component.css'
})
export class TrainingComponent implements OnInit, OnDestroy {
  //ongoingTraining = false;
  ongoingTraining$: Observable<boolean>;

 // exerciseSubscription: Subscription;

  constructor(private trainingService: TrainingService, private store: Store<fromTraining.State>) { }

  ngOnInit(): void {
    // this.exerciseSubscription = this.trainingService.runningExerciseChange.subscribe(exercise => {
    //   if (exercise) this.ongoingTraining = true;
    //   else this.ongoingTraining = false;
    // });
    this.ongoingTraining$ = this.store.select(fromTraining.hasRunningExercise)

  }

  ngOnDestroy(): void {
    // if(this.exerciseSubscription){
    //   this.exerciseSubscription.unsubscribe();
    // }
  }
}
