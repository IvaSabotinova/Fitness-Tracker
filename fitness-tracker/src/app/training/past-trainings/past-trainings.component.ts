import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';

import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-past-trainings',
  templateUrl: './past-trainings.component.html',
  styleUrl: './past-trainings.component.css'
})
export class PastTrainingsComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns = ['date', 'name', 'calories', 'duration', 'state']
  dataSource = new MatTableDataSource<Exercise>();
  pastExercisesSubscription: Subscription

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private trainingService: TrainingService) { } 

  ngOnInit(): void {
   this.trainingService.fetchCompletedOrCancelledExercises();
   this.pastExercisesSubscription = this.trainingService.pastExercisesChange.subscribe((pastExercises: Exercise[]) => {
      this.dataSource.data = pastExercises;
    })
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  doFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy(): void {
    this.pastExercisesSubscription.unsubscribe();
  }

}
