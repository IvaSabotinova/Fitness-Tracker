import { Exercise } from "./exercise.model";
import {
    TrainingActions,
    SET_AVAILABLE_EXERCISES,
    SET_FINISHED_EXERCISES,
    SET_RUNNING_EXERCISE,
    STOP_RUNNING_EXERCISE
} from "./training.actions";
import * as fromApp from '../app.reducer';
import { createFeatureSelector, createSelector } from "@ngrx/store";

export interface TrainingState {
    availableExercises: Exercise[],
    finishedExercises: Exercise[],
    runningExercise: Exercise
};

export interface State extends fromApp.State {
    training: TrainingState
}

const initialState: TrainingState = {
    availableExercises: [],
    finishedExercises: [],
    runningExercise: null
}

export function trainingReducer(state = initialState, action: TrainingActions) {
    switch (action.type) {
        case SET_AVAILABLE_EXERCISES:
            return {
                ...state,
                availableExercises: action.payload
            };
        case SET_FINISHED_EXERCISES:
            return {
                ...state,
                finishedExercises: action.payload
            };
        case SET_RUNNING_EXERCISE:
            return {
                ...state,
                 runningExercise: {...state.availableExercises.find(x => x.id === action.payload)}
            };
        case STOP_RUNNING_EXERCISE:
            return {
                ...state,
                runningExercise: null
            };
        default: {
            return state
        };
    }
}

export const getTrainingState = createFeatureSelector<TrainingState>('training');
export const getAvailableExercises = createSelector(getTrainingState, (state: TrainingState) => state.availableExercises);
export const getFinishedExercises = createSelector(getTrainingState, (state: TrainingState) => state.finishedExercises);
export const getRunningExercise = createSelector(getTrainingState, (state: TrainingState) => state.runningExercise);
export const hasRunningExercise = createSelector(getTrainingState, (state: TrainingState) => state.runningExercise != null);
