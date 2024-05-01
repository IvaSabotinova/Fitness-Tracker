import { Observable, Subscription, take } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { addDoc, collection } from 'firebase/firestore';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { Timestamp } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';

import { Exercise } from './exercise.model';
import { UIService } from '../shared/ui.service';
import * as fromTraining from './training.reducer';
import * as Training from './training.actions';
import * as UI from '../shared/ui.actions';

@Injectable()
export class TrainingService {   
    private db: Firestore = inject(Firestore);
    private fbSubscriptions: Subscription[] = [];

    constructor(private uiService: UIService, private store: Store<fromTraining.State>) { }

    fetchAvailableExercises() {
        this.store.dispatch(new UI.StartLoading());
        const exercisesCollection = collection(this.db, 'AvailableExercises'); // get a reference to the AvailableExercises collection 
        const exercises$ = collectionData(exercisesCollection) as Observable<Exercise[]>; // get documents (data) from the collection
        this.fbSubscriptions.push(exercises$.subscribe((result) => {
            this.store.dispatch(new Training.SetAvailableExercises(result));
            this.store.dispatch(new UI.StopLoading());
        }, error => {
            console.log(error);
            this.uiService.showSnackBar('Fetching exercises failed. Please try again!', null, 3000)
            this.store.dispatch(new Training.SetAvailableExercises(null));
            this.store.dispatch(new UI.StopLoading());
        }));
    }

    startExercise(selectedId: string) {        
        this.store.dispatch(new Training.SetRunningExercise(selectedId));
    }

    completeExercise() {
        this.store.select(fromTraining.getRunningExercise).pipe(take(1)).subscribe(ex => {
            this.addDataToDatabase({ ...ex, date: new Date(), state: 'completed' });
            this.store.dispatch(new Training.StopRunningExercise());
        })
    }

    cancelExercise(progress: number) {
        this.store.select(fromTraining.getRunningExercise).pipe(take(1)).subscribe(ex => {
            this.addDataToDatabase({
                ...ex,
                duration: ex.duration * (progress / 100),
                calories: ex.calories * (progress / 100),
                date: new Date(),
                state: 'cancelled'
            });
            this.store.dispatch(new Training.StopRunningExercise())
        });
    }

    fetchCompletedOrCancelledExercises() {
        const finishedExercises = collection(this.db, 'FinishedExercises');
        const exercises$ = collectionData(finishedExercises) as Observable<any>;

        this.fbSubscriptions.push(exercises$.subscribe((result) => {
            result.forEach(x => {
                const jsDate = (x.date as Timestamp).toDate();
                x.date = jsDate;
            })
            this.store.dispatch(new Training.SetFinishedExercises(result))
        }, error => {
            console.log(error);
        }));
    }

    cancelFbSubscriptions() {
        this.fbSubscriptions.forEach(sub => sub.unsubscribe());
    }

    private addDataToDatabase(exercise: Exercise) {
        const collectionRef = collection(this.db, 'FinishedExercises');
        // Add documents to the collection
        addDoc(collectionRef, exercise);
    }
}