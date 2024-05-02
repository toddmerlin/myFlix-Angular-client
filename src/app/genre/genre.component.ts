import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-genre',
  templateUrl: './genre.component.html',
  styleUrls: ['./genre.component.scss'],
})
export class GenreComponent {
  constructor(
    public dialogRef: MatDialogRef<GenreComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
}
