import { Component, EventEmitter, HostListener, inject, Inject, Input, Output, SimpleChanges } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { LogoutPopupComponent } from "../logout-popup/logout-popup.component";
import { MatRippleModule } from '@angular/material/core';
import { LoginPopupComponent } from "../login-popup/login-popup.component";

@Component({
  selector: 'app-header',
  imports: [MatIconModule, RouterLink, MatTooltipModule,
    LogoutPopupComponent, LogoutPopupComponent, MatRippleModule,
    LoginPopupComponent, LoginPopupComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {


  /*--------- Input ---------*/
  @Input() isLoginExpired: boolean = false;
  @Output() isLoginExpiredChange: EventEmitter<boolean> = new EventEmitter<boolean>();


  /*--------- Inject ---------*/

  router = inject(Router);
  cookieService = inject(CookieService)

  /*--------- variables ---------*/

  account: string = '';
  userToken: string = '';
  toggleLogout: boolean = false;
  toggleLogin: boolean = false;

  /*--------- style settings ---------*/

  menuDisabled: boolean = false;
  rippleColor: string = 'rgba(0, 0, 0, 0.02)';

  /*--------- items ---------*/
  menuList: any[] = [
    { name: 'Shipment Summary', routerLink: '/shipment-summary-guest' },
    { name: 'Shipment List', routerLink: '/shipment-list' },
  ];
  _selectedMenu: string = "";
  url: string = "";

  /*--------- functions ---------*/

  // on init

  ngOnInit() {
    this.userToken = this.cookieService.get('authToken');
    this.account = this.cookieService.get('account');
    if (this.userToken && this.account) {
      if (this.isLoginExpired == true) {
        this.handleLoginExpiration()
      } else {
        this.getUrlAndRender();
      }
    } else {
      this.userToken = '';
      this.account = '';
      this.getUrlAndRender();
    }

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isLoginExpired'] && !changes['isLoginExpired'].firstChange) {
      this.isLoginExpiredChange.emit(this.isLoginExpired);
      if (this.isLoginExpired) {
        this.handleLoginExpiration();
      }
    }
  }

  // Getter and Setter
  get selectedMenu() {
    return this._selectedMenu;
  }

  set selectedMenu(value: string) {
    this._selectedMenu = value;
  }


  // select menu
  selectMenu(menu: string, route: string) {
    if (this.selectedMenu === menu) {
      window.location.reload();
    } else {
      this.navigateTo(route);
      this.selectedMenu = menu;
    }
  }



  // router
  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  handleLoginExpiration() {
    this.cookieService.delete('authToken');
    this.cookieService.delete('account');
    this.userToken = '';
    this.account = '';
    this.toggleLogin = true;
  }

  getUrlAndRender() {
    this.url = this.router.url;
    if (this.url == "/shipment-summary-guest") {
      this.selectedMenu = "Shipment Summary";
      this.toggleLogin = false;
    } else if (this.url == "/shipment-list") {
      this.selectedMenu = "Shipment List";
      this.toggleLogin = this.userToken === "";
    } else {
      this.selectedMenu = "Shipment List";
    }
  }

  logoutBtn() {
    console.log(this.isLoginExpired)
    this.toggleLogout = true;
  }
  toggleLogoutChange(event: boolean) {
    this.toggleLogout = event;
  }

  loginBtn() {
    this.toggleLogin = true;
  }

  toggleLoginChange(event: boolean) {
    this.toggleLogin = event;
  }


}
