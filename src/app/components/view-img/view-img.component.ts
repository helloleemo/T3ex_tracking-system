import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../.environments/environment.prod';

@Component({
  selector: 'app-view-img',
  imports: [MatIconModule, CommonModule],
  templateUrl: './view-img.component.html',
  styleUrl: './view-img.component.css'
})
export class ViewImgComponent {

  /*--------- Inject data ---------*/

  http = inject(HttpClient);
  router = inject(Router);

  /*--------- Input data ---------*/

  @Input() imgList: any

  /*------- Data import -------*/
  baseAPI = environment.baseAPI

  /*--------- Output data ---------*/

  @Output() closeClicked = new EventEmitter<boolean>();

  /*--------- Variables ---------*/
  currentIndex: number = 0;
  imageUrls: string[] = [];
  loading: boolean = true;


  /*--------- Lifecycle ---------*/
  ngOnInit(): void {
    console.log('imgList', this.imgList);
    this.preloadImages();
  }


  /*--------- Functions ---------*/
  preloadImages() {
    this.imgList.forEach((item: any, index: number) => {
      this.postFilesData(item.Guid).subscribe({
        next: (blob) => {
          const url = URL.createObjectURL(blob);
          this.imageUrls[index] = url;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        },
        complete: () => { }
      });
    });
  }

  closeImg(e: any) {
    this.currentIndex = 0
  }

  // imge data
  get currentImg() {
    return {
      img: this.imageUrls[this.currentIndex] || '',
      name: this.imgList[this.currentIndex]?.Name || 'Image'
    };
  }

  nextImg() {
    this.currentIndex = (this.currentIndex + 1) % this.imgList.length;
  }

  prevImg() {
    this.currentIndex = (this.currentIndex - 1 + this.imgList.length) % this.imgList.length;
  }

  sendCloseClicked() {
    this.closeClicked.emit(false);
  }



  postFilesData(guid: string): Observable<Blob> {
    console.log('guid', guid);
    const token = this.getCookie('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const params = new HttpParams().set('guid', guid);

    return this.http.get(`${this.baseAPI}TrackingApi/Download`, {
      headers,
      params,
      responseType: 'blob'
    });
  }


  // get coolies
  getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }

}
