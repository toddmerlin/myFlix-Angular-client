import { Component, Inject, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss'],
})
export class UpdateUserComponent implements OnInit {
  user: any = { Username: '', Password: '', Email: '' };
  updatedUser: any = { Username: '', Password: '', Email: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UpdateUserComponent>,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
    } else {
      console.error('User data not found in localStorage');
    }
  }

  updateUser(): void {
    // Send request to update user profile
    this.fetchApiData.updateUser(this.updatedUser).subscribe(
      (result) => {
        console.log(result);
        // Update user data in localStorage
        localStorage.setItem('user', JSON.stringify(result));
        console.log('User updated UU:', result);
        this.dialogRef.close();
        this.snackBar.open('User updated successfully', 'OK', {
          duration: 2000,
        });
      },
      (error) => {
        console.error('Error updating user:', error);
        this.snackBar.open('Failed to update user', 'OK', {
          duration: 2000,
        });
      }
    );
  }
}
