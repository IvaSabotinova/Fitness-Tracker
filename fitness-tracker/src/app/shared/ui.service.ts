import { Subject } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Injectable } from "@angular/core";

@Injectable()
export class UIService {
    loadingStatusChange = new Subject<boolean>();

    constructor(private snackBar: MatSnackBar) { }

    showSnackBar(message: string, action: string, duration: number) {
        this.snackBar.open(message, action, {
            duration: duration
        });
    };
}