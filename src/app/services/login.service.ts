import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../.environments/environment.prod';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {


  /*------- Inject -------*/

  http = inject(HttpClient);
  router = inject(Router);
  cookieService = inject(CookieService);


  baseAPI = environment.baseAPI;

  login(account: string, password: string, rememberMe: boolean) {
    const credentials = {
      UserName: account,
      Password: password,
      RememberMe: rememberMe
    };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<{ data: string }>(
      `${this.baseAPI}TrackingApi/login`,
      credentials,
      { headers }
    );
  }

  logout() {
    this.cookieService.delete('authToken', '/');
    //彈出瀏覽器的警告視窗
    alert('登出成功');

    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }




}
