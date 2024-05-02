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

  // Making the api call for the user registration endpoint
  public userRegistration(userDetails: any): Observable<any> {
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      catchError((error) => {
        return this.handleError(error);
      })
    );
  }

  // Making the api call for the user login endpoint
  public userLogin(userDetails: any): Observable<any> {
    return this.http.post(apiUrl + 'login', userDetails).pipe(
      catchError((error) => {
        return this.handleError(error);
      })
    );
  }

  // Making the api call for the Get All Movies endpoint
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

  // Making the api call for the Get One Movie only endpoint
  public getOneMovie(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies/:Title', {
        headers: new HttpHeaders({
          authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Making the api call for the Director endpoint
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
  // public getGenre(genreName: string): Observable<any> {
  //   const token = localStorage.getItem('token');
  //   return this.http
  //     .get(apiUrl + `movies/Genre/${genreName}`, {
  //       headers: new HttpHeaders({
  //         authorization: 'Bearer ' + token,
  //       }),
  //     })
  //     .pipe(map(this.extractResponseData), catchError(this.handleError));
  // }

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
