import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';
import { UIService } from '../../shared/ui.service';
import * as fromTraining from '../training.reducer';
import * as fromApp from '../../app.reducer';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrl: './new-training.component.css'
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  // @Output() trainingStart = new EventEmitter<void>();
  //exercises: Exercise[] = [];
  exercises$: Observable<Exercise[]>;
  //exerciseSubscription: Subscription;
  //isLoading = true;
  isLoading$: Observable<boolean>;
  //loadingStatusSubscription: Subscription;

  constructor(private trainingService: TrainingService, private uiService: UIService, private store: Store<fromTraining.State>) { }

  ngOnInit(): void {
    // this.exercises = this.trainingService.getAvailableExercises();         
    this.fetchExercises();
    // this.exerciseSubscription = this.trainingService.availableExercisesChange.subscribe(result => {
    //   this.exercises = result;
    // });

    this.exercises$ = this.store.select(fromTraining.getAvailableExercises);

    // this.loadingStatusSubscription = this.uiService.loadingStatusChange.subscribe(status => {
    //   this.isLoading = status;
    //})
    this.isLoading$ = this.store.select(fromApp.getIsLoading)
  }

  fetchExercises() {
    this.trainingService.fetchAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    // this.trainingStart.emit();              
    this.trainingService.startExercise(form.value.exerciseId);
  }

  ngOnDestroy() {
    // if (this.exerciseSubscription) {
    //   this.exerciseSubscription.unsubscribe();
    // }
    // if (this.loadingStatusSubscription) {
    //   this.loadingStatusSubscription.unsubscribe();
    // }
  }
}
