import { Component, OnInit, Input } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrl: './user-registration-form.component.scss',
})
export class UserRegistrationFormComponent implements OnInit {
  @Input() userRegData = {
    Username: '',
    Password: '',
    Email: '',
    Birthday: '',
  };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar,
    public router: Router
  ) {}

  ngOnInit(): void {}

  registerUser(): void {
    this.fetchApiData.userRegistration(this.userRegData).subscribe(
      (response) => {
        console.log('Registration response:', response); // Log the entire response

        // Store the entire response in local storage
        localStorage.setItem('user', JSON.stringify(response));

        console.log('User data:', response);
        console.log('Token:', response.token);

        // Redirect to the movies page
        this.dialogRef.close();
        this.snackBar.open('Congratulations! and welcome to MyFlix', 'OK', {
          duration: 2000,
        });
        this.router.navigate(['movies']);
      },
      (error) => {
        console.error('Error registering user:', error);
        // Handle registration error
        this.snackBar.open('Failed to register user', 'OK', {
          duration: 2000,
        });
      }
    );
  }
}
