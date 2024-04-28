import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';
import { UIService } from '../../shared/ui.service';


@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrl: './new-training.component.css'
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  // @Output() trainingStart = new EventEmitter<void>();
  exercises: Exercise[] = [];
  exerciseSubscription: Subscription;
  isLoading = true;
  loadingStatusSubscription: Subscription;

  constructor(private trainingService: TrainingService, private uiService: UIService) { }

  ngOnInit(): void {
    // this.exercises = this.trainingService.getAvailableExercises();         
   this.fetchExercises();
    this.exerciseSubscription = this.trainingService.availableExercisesChange.subscribe(result => {
      this.exercises = result;
    });
    this.loadingStatusSubscription = this.uiService.loadingStatusChange.subscribe(status => {
      this.isLoading = status;
    })
  }

  fetchExercises(){
    this.trainingService.fetchAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    // this.trainingStart.emit();              
    this.trainingService.startExercise(form.value.exerciseId);
  }

  ngOnDestroy() {
    if (this.exerciseSubscription) {
      this.exerciseSubscription.unsubscribe();
    }
    if (this.loadingStatusSubscription) {
      this.loadingStatusSubscription.unsubscribe();
    }
  }
}
