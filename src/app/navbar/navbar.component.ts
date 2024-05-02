import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  constructor(public router: Router) {}

  ngOnInit(): void {}

  // navigate user to default movie list view
  public openMovieList(): void {
    this.router.navigate(['movies']);
  }

  // navigate user to profile view
  public openProfile(): void {
    this.router.navigate(['profile']);
  }

  // logout user, navigate to welcome page and remove token and user from local storage
  public logoutUser(): void {
    localStorage.setItem('token', '');
    localStorage.setItem('user', '');
    this.router.navigate(['welcome']);
  }
}
