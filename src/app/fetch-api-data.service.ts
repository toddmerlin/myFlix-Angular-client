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

@Injectable({
  providedIn: 'root',
})
export class FetchApiDataService {
  // Inject the HttpClient module to the constructor params
  // This will provide HttpClient to the entire class, making it available via this.http
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

  // Making the api call for the Genre endpoint
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

  // Making the api call for the Get User endpoint

  public getUser(): Observable<any> {
    const token = localStorage.getItem('token');
    console.log('Get user Token' + token);
    return this.http.get(apiUrl + 'Users', {
      headers: new HttpHeaders({
        authorization: 'Bearer ' + token,
      }),
    });
  }

  // Making the api call for the Get Favourite Movies for a user endpoint
  public getFavoriteMovies(): Observable<any> {
    const username = JSON.parse(localStorage.getItem('user') || '{}').Username;
    const token = localStorage.getItem('token');

    return this.http.get(`${apiUrl}users/${username}/favoriteMovies`, {
      headers: new HttpHeaders({
        authorization: 'Bearer ' + token,
      }),
    });
  }

  // Making the api call for the Add a Movie users Favourite Movies endpoint
  public addFavoriteMovie(movieID: string): Observable<any> {
    const username = JSON.parse(localStorage.getItem('user') || '{}').Username;
    const token = localStorage.getItem('token');
    console.log('Token ' + token);

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

  // Making the api call for the Delete a Movie to Favourite Movies endpoint
  public deleteFavoriteMovie(movieID: string): Observable<any> {
    const username = JSON.parse(localStorage.getItem('user') || '{}').Username;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // Use template literals for better readability
    });

    return this.http
      .delete(`${apiUrl}users/${username}/movies/${movieID}`, {
        headers: new HttpHeaders({
          authorization: 'Bearer ' + token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  // Making the api call for the Update the users profile endpoint
  public updateUser(updatedUserData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const username = JSON.parse(localStorage.getItem('user') || '{}').Username;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    });
    const options = { headers: headers };

    return this.http.put(
      apiUrl + 'users/' + username,
      updatedUserData,
      options
    );
  }

  // Making the api call for the Delete User endpoint
  public deleteUser(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.delete(apiUrl + 'users/:Username', {
      headers: new HttpHeaders({
        authorization: 'Bearer ' + token,
      }),
    });
  }

  // Non-typed response extraction
  private extractResponseData(res: any): any {
    const body = res;
    return body || {};
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` + `Error body is: ${error.error}`
      );
    }
    return throwError('Something bad happened; please try again later.');
  }
}
