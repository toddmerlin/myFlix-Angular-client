import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

//Declaring the api url that will provide data for the client app
const apiUrl = 'https://myflix-ssv7.onrender.com/';

/**
 * Service for fetching data from the API.
 */
@Injectable({
  providedIn: 'root',
})
export class FetchApiDataService {
  /**
   * Constructs a new FetchApiDataService instance.
   * @param http The HttpClient module for making HTTP requests.
   */
  constructor(private http: HttpClient) {}

  /**
   * Makes an API call to the users endpoint which enables a new user to register.
   * @param userDetails The details of the user to be registered.
   * @returns An Observable that emits the response from the API.
   */
  public userRegistration(userDetails: any): Observable<any> {
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      catchError((error) => {
        return this.handleError(error);
      })
    );
  }

  /**
   * Makes an API call to the users endpoint to facilitate user login.
   * @param userDetails The details of the user attempting to log in.
   * @returns An Observable that emits the response from the API.
   */
  public userLogin(userDetails: any): Observable<any> {
    return this.http.post(apiUrl + 'login', userDetails).pipe(
      catchError((error) => {
        return this.handleError(error);
      })
    );
  }

  /**
   * Makes an API call to retrieve all movie data from the server after a user has logged in.
   * Requires a bearer token in the header.
   * @returns An array containing a list of all movies and their associated data from the server
   */
  public getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies', {
        headers: new HttpHeaders({
          authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Makes an API call to retrieve details of a single movie from the server.
   * @param title The title of the movie to retrieve.
   * @returns An Observable that emits the response containing data details of the requested movie.
   */
  public getOneMovie(): Observable<any> {
    // Retrieve the authentication token from local storage
    const token = localStorage.getItem('token');

    // Make an HTTP GET request to the movies endpoint with authorization header
    return (
      this.http
        .get(apiUrl + 'movies/:Title', {
          headers: new HttpHeaders({
            authorization: 'Bearer ' + token,
          }),
        })
        // Extract and map the response data
        .pipe(map(this.extractResponseData), catchError(this.handleError))
    );
  }

  /**
   * Makes an API call to retrieve a list of movies directed by a specific director from the server.
   * @param director The name of the director whose movies are to be retrieved.
   * @returns An Observable that emits the response containing details of movies directed by the specified director.
   */
  public getDirector(director: string): Observable<any> {
    const token = localStorage.getItem('token');
    console.log(director);
    return this.http
      .get(`${apiUrl}movies/Directors/${director}`, {
        headers: new HttpHeaders({
          authorization: 'Bearer ' + token,
        }),
      })
      .pipe(
        map((response: any) => {
          console.log('FR: ' + response);
          return response;
        }),
        // this line catches errors by throwing them to the observable to be handled by the error handler
        catchError(this.handleError)
      );
  }

  /**
   * Makes an API call to retrieve movies of a specific genre from the server.
   * Requires a bearer token in the header.
   * @param genreName The name of the genre to retrieve movies for.
   * @returns An Observable that emits the response containing movie data of the specified genre.
   */
  public getGenre(genreName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + `movies/Genre/${genreName}`, {
        headers: new HttpHeaders({
          authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Makes an API call to retrieve the list of users favorite movies from the server.
   * Requires a bearer token in the header.
   * @returns An Observable that emits the response containing the user's favorite movies via their movie ID.
   */
  public getFavoriteMovies(): Observable<any> {
    const username = JSON.parse(localStorage.getItem('user') || '{}').Username;
    const token = localStorage.getItem('token');
    return this.http.get(`${apiUrl}users/${username}/favoriteMovies`, {
      headers: new HttpHeaders({
        authorization: 'Bearer ' + token,
      }),
    });
  }

  /**
   * Makes an API call to add a movie to the user's list of favorite movies on the server.
   * Requires a bearer token in the header.
   * @param movieID The ID of the movie to be added to favorites.
   * @returns An Observable that emits the response from the API.
   */
  public addFavoriteMovie(movieID: string): Observable<any> {
    // Retrieve the username and token from local storage
    const username = JSON.parse(localStorage.getItem('user') || '{}').Username;
    const token = localStorage.getItem('token');

    // Ensure that the headers are set correctly
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // Use template literals for better readability
    });

    return this.http
      .post(
        `${apiUrl}users/${username}/movies/${movieID}`,
        {}, // Send an empty body if your server doesn't require any data in the request body
        { headers: headers } // Pass the headers as an option to the post() method
      )
      .pipe(catchError(this.handleError));
  }

  /**
   * Makes an API call to remove a movie from the user's list of favorite movies on the server.
   * Requires a bearer token in the header.
   * @param movieID The ID of the movie to be removed from favorites.
   * @returns An Observable that emits the response from the API.
   */
  public deleteFavoriteMovie(movieID: string): Observable<any> {
    // Retrieve the username and token from local storage
    const username = JSON.parse(localStorage.getItem('user') || '{}').Username;
    const token = localStorage.getItem('token');

    // Ensure that the headers are set correctly
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // Use template literals for better readability
    });

    // Make an HTTP DELETE request to remove the movie from favorites
    return this.http
      .delete(`${apiUrl}users/${username}/movies/${movieID}`, {
        headers: new HttpHeaders({
          authorization: 'Bearer ' + token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Makes an API call to update uthe users data on the server.
   * Requires a bearer token in the header.
   * @param updatedUserData The updated data for the user.
   * @returns An Observable that emits the response from the API.
   */
  public updateUser(updatedUserData: any): Observable<any> {
    // Retrieve the token and username from local storage
    const token = localStorage.getItem('token');
    const username = JSON.parse(localStorage.getItem('user') || '{}').Username;
    // Ensure that the headers are set correctly
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    });
    // Prepare options with headers for the HTTP request
    const options = { headers: headers };
    // Make an HTTP PUT request to update the user data
    return this.http.put(
      apiUrl + 'users/' + username,
      updatedUserData,
      options
    );
  }

  /**
   * Makes an API call to delete the user account from the server.
   * Requires a bearer token in the header.
   * @returns An Observable that emits the response from the API.
   */
  public deleteUser(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.delete(apiUrl + 'users/:Username', {
      headers: new HttpHeaders({
        authorization: 'Bearer ' + token,
      }),
    });
  }

  /**
   * Extracts the response data from the HTTP response.
   * @param res The HTTP response object.
   * @returns The extracted response data.
   */
  private extractResponseData(res: any): any {
    // Extract the body from the HTTP response
    const body = res;
    // Return the body or an empty object if it's null or undefined
    return body || {};
  }

  /**
   * Handles HTTP errors.
   * @param error The HTTP error response.
   * @returns An observable with an error message.
   */
  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      console.error('An error occurred:', error.error.message);
    } else {
      // Server-side error
      console.error(
        `Error Status code ${error.status}, Error body is: ${error.error}`
      );
    }
    // Return an observable with an error message
    return throwError('Something bad happened; please try again later.');
  }
}
