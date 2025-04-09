import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatRipple } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-logout-popup',
  imports: [MatIconModule, MatRipple],
  templateUrl: './logout-popup.component.html',
  styleUrl: './logout-popup.component.css'
})
export class LogoutPopupComponent {

  /*--------- Inject ---------*/

  router = inject(Router)
    cookieService = inject(CookieService)

    /*--------- style settings ---------*/
rippleColor: string = 'rgba(255, 255, 255, 0.2)';


  /*--------- variables ---------*/
  account: string = '';
  userToken: string = '';





  /*--------- input/output ---------*/

  @Input() toggleLogout: boolean = false;
  @Output() toggleLogoutChange= new EventEmitter<boolean>();



/*--------- functions ---------*/

  // on init

  ngOnInit() {
    this.userToken = this.cookieService.get('authToken');
    if (this.userToken !== '') {
      this.account = this.cookieService.get('account');
    }
  }


  closePopup(){
    this.toggleLogout = false;
    this.toggleLogoutChange.emit(this.toggleLogout);
  }

  // logout
  logout() {
    this.toggleLogout = false;
    this.toggleLogoutChange.emit(this.toggleLogout);
    this.userToken = '';
    this.cookieService.delete('authToken', '/');
    this.router.navigate(['/login']);
  }


  // // logout
  // logout() {
  //   this.toggleLogout = false;
  //   this.toggleLogoutChange = false;
  //   this.router.navigate(['/login']);
  // }



}
