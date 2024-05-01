import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';
import * as fromTraining from '../training.reducer';
import * as fromApp from '../../app.reducer';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrl: './new-training.component.css'
})
export class NewTrainingComponent implements OnInit { 
  exercises$: Observable<Exercise[]>;
  isLoading$: Observable<boolean>;

  constructor(private trainingService: TrainingService, private store: Store<fromTraining.State>) { }

  ngOnInit(): void {
    this.fetchExercises();    
    this.exercises$ = this.store.select(fromTraining.getAvailableExercises);
    this.isLoading$ = this.store.select(fromApp.getIsLoading)
  }

  fetchExercises() {
    this.trainingService.fetchAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exerciseId);
  }
}
