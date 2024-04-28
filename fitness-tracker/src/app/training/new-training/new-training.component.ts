import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';


@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrl: './new-training.component.css'
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  // @Output() trainingStart = new EventEmitter<void>();
  exercises: Exercise[] = [];
  exerciseSubscription: Subscription

  constructor(private trainingService: TrainingService) { }

  ngOnInit(): void {
    // this.exercises = this.trainingService.getAvailableExercises();         
    this.trainingService.fetchAvailableExercises();
    this.exerciseSubscription = this.trainingService.availableExercisesChange.subscribe(result => {
      this.exercises = result;
    });
  }

  onStartTraining(form: NgForm) {
    // this.trainingStart.emit();              
    this.trainingService.startExercise(form.value.exerciseId);
  }

  ngOnDestroy() {
    this.exerciseSubscription.unsubscribe();
  }
}
