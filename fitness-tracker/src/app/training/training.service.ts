import { Observable, Subject, Subscription, take } from 'rxjs';
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
    //private availableExercises: Exercise[] = [];
    // { id: 'crunches', name: 'Crunches', duration: 30, calories: 8 },
    // { id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 15 },
    // { id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 18 },
    // { id: 'burpees', name: 'Burpees', duration: 60, calories: 8 }
    //];
    // availableExercisesChange = new Subject<Exercise[]>();
    // private runningExercise: Exercise;
    // runningExerciseChange = new Subject<Exercise>();
    // pastExercisesChange = new Subject<Exercise[]>();
    private db: Firestore = inject(Firestore);
    private fbSubscriptions: Subscription[] = [];

    constructor(private uiService: UIService, private store: Store<fromTraining.State>) { }

    fetchAvailableExercises() {
        //return this.availableExercises.slice();
        this.store.dispatch(new UI.StartLoading());
        //this.uiService.loadingStatusChange.next(true);
        const exercisesCollection = collection(this.db, 'AvailableExercises'); // get a reference to the AvailableExercises collection 
        const exercises$ = collectionData(exercisesCollection) as Observable<Exercise[]>; // get documents (data) from the collection
        this.fbSubscriptions.push(exercises$.subscribe((result) => {
            //  this.availableExercises = result;
            // this.availableExercisesChange.next([...this.availableExercises]);
            this.store.dispatch(new Training.SetAvailableExercises(result));
            // this.uiService.loadingStatusChange.next(false);
            this.store.dispatch(new UI.StopLoading());
        }, error => {
            console.log(error);
            this.uiService.showSnackBar('Fetching exercises failed. Please try again!', null, 3000)
            //  this.uiService.loadingStatusChange.next(false);
            this.store.dispatch(new Training.SetAvailableExercises(null));
            this.store.dispatch(new UI.StopLoading());
            // this.availableExercisesChange.next(null);
            // this.store.dispatch(new trainingActions.SetAvailableExercises(null))
        }));
    }

    startExercise(selectedId: string) {
        // this.runningExercise = this.availableExercises.find(ex => ex.id === selectedId);
        // this.runningExerciseChange.next({ ...this.runningExercise });
        this.store.dispatch(new Training.SetRunningExercise(selectedId));
    }

    // getRunningExercise() { 
    //     this.store.select(fromTraining.getRunningExercise).subscribe(ex=>{
    //         this.runningExercise = ex
    //     })  
    //     return { ...this.runningExercise };
    // }

    completeExercise() {
        this.store.select(fromTraining.getRunningExercise).pipe(take(1)).subscribe(ex => {
            // this.runningExercise = ex
            this.addDataToDatabase({ ...ex, date: new Date(), state: 'completed' });
            // this.runningExercise = null;
            // this.runningExerciseChange.next(null);
            this.store.dispatch(new Training.StopRunningExercise());
        })
    }

    cancelExercise(progress: number) {
        this.store.select(fromTraining.getRunningExercise).pipe(take(1)).subscribe(ex => {
            //this.runningExercise = ex
            this.addDataToDatabase({
                ...ex,
                duration: ex.duration * (progress / 100),
                calories: ex.calories * (progress / 100),
                date: new Date(),
                state: 'cancelled'
            });
            // this.runningExercise = null;
            // this.runningExerciseChange.next(null);
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
            // this.pastExercisesChange.next(result);
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