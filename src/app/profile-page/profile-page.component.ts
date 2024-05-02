import { Component, Input, OnInit, Inject } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UpdateUserComponent } from '../update-user/update-user.component';
import { MovieCardComponent } from '../movie-card/movie-card.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
})
export class ProfilePageComponent implements OnInit {
  user: any = { Username: '', Password: '', Email: '', Birthday: '' };
  updatedUser: any = { Username: '', Password: '', Email: '' };
  movies: any[] = [];
  favorites: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public router: Router,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUser();
    this.fetchFavorites();
  }

  // Load user data from localStorage
  public loadUser(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData); // Parsing the string to an object
    }
  }

  // Fetch details of favorite movies
  fetchFavorites(): void {
    if (this.user.FavoriteMovies.length === 0) {
      // No favorite movies to fetch
      console.log('No favorite movies found.');
      return;
    }
    this.fetchApiData.getFavoriteMovies().subscribe(
      (favoriteIds: string[]) => {
        // Fetch complete movie data
        this.fetchApiData.getAllMovies().subscribe((moviesData: any[]) => {
          // Filter favorite movies from complete movie data based on IDs
          this.favorites = moviesData.filter((movie) =>
            favoriteIds.includes(movie._id)
          );
        });
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getMovieCard(movie: any): void {
    this.dialog.open(MovieCardComponent, {
      data: { movie: movie },
    });
  }

  public updateUser(): void {
    const dialogRef = this.dialog.open(UpdateUserComponent, {
      width: '400px',
      height: '400px',
      data: {
        user: this.user, // Pass user data to EditProfileComponent
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      // Handle any result from the dialog if needed
      this.loadUser();
      if (result) {
        this.user = result;
        console.log('Updated user:', this.user);
      }
    });
  }

  public deleteUser(): void {
    if (confirm('Are you sure you want to delete your account?')) {
      this.fetchApiData.deleteUser().subscribe((resp) => {
        localStorage.clear();
        this.snackBar.open('Your account has been deleted!', 'OK', {
          duration: 2000,
        });
        this.router.navigate(['welcome']);
        return resp;
      });
    }
  }

  // this will redirect to the home page
  public back(): void {
    this.router.navigate(['movies']);
  }
}
