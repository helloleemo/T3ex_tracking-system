import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatRipple } from '@angular/material/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { CookieService } from 'ngx-cookie-service';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login-popup',
  imports: [MatRipple, FormsModule, MatIconModule],
  templateUrl: './login-popup.component.html',
  styleUrl: './login-popup.component.css'
})
export class LoginPopupComponent {

  /*--------- style settings ---------*/
  rippleColor: string = '(0, 0, 0, 0.02)';

  /*------- Inject -------*/
  router = inject(Router)
  authService = inject(LoginService);
  cookieService = inject(CookieService);


  /*------- Input/Output -------*/
  @Input() toggleLogin: boolean = false;
  @Output() toggleLoginChange = new EventEmitter<boolean>();


  /*------- Variables -------*/

  //loading
  loading: boolean = false;


  // login
  account = '';
  password = '';
  isLoginInput = false;
  loginAlertMessage = '';
  rememberMe = false;
  typing = true;

  isLogin: boolean = false;


  linkToList = '/shipment-list';

  /*--------- functions ---------*/

  ngOnInit() {
    const rememberMeCookie = this.cookieService.get('rememberMe');
    const authToken = this.cookieService.get('authToken');
    if (rememberMeCookie === 'true') {
      this.rememberMe = rememberMeCookie === 'true';
      this.account = this.cookieService.get('account');
    } else {
      this.rememberMe = false;
      this.account = '';
    }
    if (authToken) {
      this.isLogin = true;
    } else {
      this.isLogin = false;
    }
  }



  checkLogin() {
    this.loading = true;
    this.checkLoginInput(this.account, this.password);
    if (!this.isLoginInput) {
      this.loading = false;
      return;
    }
    this.authService.login(this.account, this.password, this.rememberMe).subscribe({
      next: (res) => {
        const token = res.data;
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 7);

        this.cookieService.set('authToken', res.data, {
          path: '/',
          secure: true,
          sameSite: 'Strict'
        });
        this.cookieService.set('account', this.account.toString(), {
          expires: expirationDate,
          path: '/',
          secure: true,
          sameSite: 'Strict'
        });
        this.cookieService.set('rememberMe', this.rememberMe.toString(), {
          expires: expirationDate,
          path: '/',
          secure: true,
          sameSite: 'Strict'
        });
        this.toggleLoginChange.emit(false);
        this.router.navigate(['/shipment-list']);
        this.loading = false;
        window.location.reload();
      },
      error: (err) => {
        console.error('Login Failed:', err);
        this.loginAlertMessage = 'Login failed, please try again';
        this.isLoginInput = false;
        this.typing = false;
        this.loading = false;

      }
    });
  }

  checkLoginInput(account: string, password: string) {
    if (account.trim() == '' || password.trim() == '') {
      this.isLoginInput = false;
      this.typing = false;
      this.loginAlertMessage = 'Please enter your account and password';
    } else {
      this.isLoginInput = true;
      this.typing = true;
    }
  }

  typeAccount(e: any) {
    this.typing = true;
    this.loginAlertMessage = '';
  }

  closePopup() {
    this.toggleLoginChange.emit(false);
    this.router.navigate(['/login']);
  }


}
