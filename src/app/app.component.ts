import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Tracking-system';


  constructor(private router: Router) { }

  ngOnInit(): void {
    const currentUrl = window.location.href;

    if (currentUrl.includes('/Tracking/viewer')) {
      const queryString = window.location.search;
      const encodedParams = queryString.substring(1);

      this.router.navigateByUrl(`/Tracking/shipment-summary?${encodedParams}`);
    }
  }


}
