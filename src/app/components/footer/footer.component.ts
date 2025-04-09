import { Component, EventEmitter, Input, input, Output, output } from '@angular/core';
import { PrivatePolicyComponent } from '../private-policy/private-policy.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-footer',
  imports: [PrivatePolicyComponent, ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

  /*------- Data -----*/
  isShowPrivatePolicy: boolean = false;


  openPrivatePolicy() {
    this.isShowPrivatePolicy = true;
  }

  closePrivatePolicy(e: boolean) {
    this.isShowPrivatePolicy = e;
  }


}
