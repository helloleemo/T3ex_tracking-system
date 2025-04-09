import { Component, inject } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { MatIconModule } from '@angular/material/icon'
import { MatRippleModule } from '@angular/material/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { CookieService } from 'ngx-cookie-service';
import { TrackingNumberService } from '../../services/tracking-number.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../.environments/environment.prod';

@Component({
  selector: 'app-login',
  imports: [FooterComponent, MatIconModule, MatRippleModule,
    CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  /*------- Inject -------*/
  router = inject(Router)
  authService = inject(LoginService);
  cookieService = inject(CookieService);
  http = inject(HttpClient)


  /*------- styles settings -------*/
  rippleColor = 'rgba(255, 255, 255, 0.1)';



  /*------- data import -------*/
  baseAPI = environment.baseAPI;


  /*------- Variables -------*/

  // test data
  testData = {
    "StartDate": null,
    "EndDate": null,
    "Status": 0,
    "DateType": 0,
    "NumberType": 0,
    "TrackingNo": null,
    "SortBy": "new_to_old",
    "Page": 1,
    "PageSize": 5
  }

  //loading
  loading: boolean = false;

  // tracking number
  trackingNumber: string = '';
  isValidTrackingNum: boolean = false;
  alertMessage: string = '';

  // login
  account = '';
  password = '';
  isLoginInput = false;
  loginAlertMessage = '';
  rememberMe = false;
  typing = true;

  isLogin: boolean = false;


  linkToList = '/shipment-list';


  /*------- Data import -------*/

  // services
  trackingNumberService = inject(TrackingNumberService);



  /*------- Functions -------*/

  ngOnInit() {
    // check if user is already logged in
    const rememberMeCookie = this.cookieService.get('rememberMe');
    const authToken = this.cookieService.get('authToken');

    if (rememberMeCookie === 'true') {
      this.rememberMe = true;
      this.account = this.cookieService.get('account');
    } else {
      this.rememberMe = false;
      this.account = '';
    }

    if (authToken) {
      this.getData(this.testData).subscribe({
        next: (res) => {
          this.isLogin = true;
        },
        error: (err) => {
          this.isLogin = false;
          this.router.navigate(['/login']);
        }
      });
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
        this.router.navigate(['/shipment-list']);
      },
      error: (err) => {
        console.error('Login Failed:', err);
        this.loginAlertMessage = 'Login failed, please try again';
        this.isLoginInput = false;
        this.typing = false;
        this.loading = false;
      },
      complete: () => { }
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

  checkValid(e: any) {
    if (e.target.value === '') {
      this.isValidTrackingNum = false;
      this.alertMessage = 'the tracking number cannot be empty';
    } else {
      this.isValidTrackingNum = true;
      this.alertMessage = '';
    }
  }

  sendTrackingNumber() {
    if (this.isValidTrackingNum) {
      this.trackingNumberService.setData(this.trackingNumber);
      this.router.navigate(['/shipment-summary-guest']);
    } else {
      this.alertMessage = 'Please enter a valid tracking number';
    }
  }

  logout() {
    this.authService.logout();
  }




  getData(searchContent: object): Observable<any> {
    const token = this.getCookie('authToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<any[]>(
      `${this.baseAPI}TrackingApi/search`,
      searchContent,
      { headers }
    );
  }

  tryGetData(testData: object): boolean {
    let result = false;
    this.getData(testData).subscribe({
      next: (res) => {
        console.log('res', res)
        if (res.status === 401) {
          this.router.navigate(['/login']);
          result = false;
        } else {
          result = true;
        }
      }
    });
    return result;
  }


  // Cookie
  // get coolies
  getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }

}
