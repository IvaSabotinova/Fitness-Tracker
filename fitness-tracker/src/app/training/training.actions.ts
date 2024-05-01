import { Action } from "@ngrx/store";
import { Exercise } from "./exercise.model";

export const SET_AVAILABLE_EXERCISES = '[Training] Set Available Exercises';
export const SET_FINISHED_EXERCISES = '[Training] Set Finished Exercises';
export const SET_RUNNING_EXERCISE = '[Training] Set Running Exercise';
export const STOP_RUNNING_EXERCISE = '[Training] Stop Running Exercise';

export class SetAvailableExercises implements Action{
   readonly type = SET_AVAILABLE_EXERCISES;

   constructor(public payload: Exercise[]) {}
}

export class SetFinishedExercises implements Action{
   readonly type = SET_FINISHED_EXERCISES;

   constructor(public payload: Exercise[]) {}
}

export class SetRunningExercise implements Action{
    readonly type = SET_RUNNING_EXERCISE;

    constructor(public payload: string) {}
 }

 export class StopRunningExercise implements Action{
    readonly type = STOP_RUNNING_EXERCISE;
 }

export type TrainingActions = SetAvailableExercises 
                            | SetFinishedExercises 
                            | SetRunningExercise 
                            | StopRunningExercise;