import { Observable, Subject, Subscription } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { addDoc, collection } from 'firebase/firestore';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { Timestamp } from '@angular/fire/firestore';

import { Exercise } from './exercise.model';

Injectable()
export class TrainingService {
    private availableExercises: Exercise[] = [];
    // { id: 'crunches', name: 'Crunches', duration: 30, calories: 8 },
    // { id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 15 },
    // { id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 18 },
    // { id: 'burpees', name: 'Burpees', duration: 60, calories: 8 }
    //];
    availableExercisesChange = new Subject<Exercise[]>();
    private runningExercise: Exercise;
    runningExerciseChange = new Subject<Exercise>();
    pastExercisesChange = new Subject<Exercise[]>();
    private db: Firestore = inject(Firestore);
    private fbSubscriptions: Subscription[] = [];

    fetchAvailableExercises() {
        //return this.availableExercises.slice();
        const exercisesCollection = collection(this.db, 'AvailableExercises'); // get a reference to the AvailableExercises collection    
        const exercises$ = collectionData(exercisesCollection) as Observable<Exercise[]>; // get documents (data) from the collection
        this.fbSubscriptions.push(exercises$.subscribe((result) => {
            this.availableExercises = result;
            this.availableExercisesChange.next([...this.availableExercises]);
        }, error => {
            console.log(error);
        }));
    }

    startExercise(selectedId: string) {
        this.runningExercise = this.availableExercises.find(ex => ex.id === selectedId);
        this.runningExerciseChange.next({ ...this.runningExercise });
    }

    getRunningExercise() {
        return { ...this.runningExercise };
    }

    completeExercise() {
        this.addDataToDatabase({ ...this.runningExercise, date: new Date(), state: 'completed' });
        this.runningExercise = null;
        this.runningExerciseChange.next(null);
    }

    cancelExercise(progress: number) {
        this.addDataToDatabase({
            ...this.runningExercise,
            duration: this.runningExercise.duration * (progress / 100),
            calories: this.runningExercise.calories * (progress / 100),
            date: new Date(),
            state: 'cancelled'
        });
        this.runningExercise = null;
        this.runningExerciseChange.next(null);
    }

    fetchCompletedOrCancelledExercises() {
        const finishedExercises = collection(this.db, 'FinishedExercises');
        const exercises$ = collectionData(finishedExercises) as Observable<any>;

        this.fbSubscriptions.push(exercises$.subscribe((result) => {
            result.forEach(x => {
                const jsDate = (x.date as Timestamp).toDate();
                x.date = jsDate;
                this.pastExercisesChange.next(result);
            })
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