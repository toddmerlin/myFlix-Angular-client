import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-director',
  templateUrl: './director.component.html',
  styleUrls: ['./director.component.scss'],
})
export class DirectorComponent {
  constructor(
    public dialogRef: MatDialogRef<DirectorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
}
