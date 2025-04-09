import { Component, EventEmitter, Input, Output, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-private-policy',
  imports: [MatIconModule],
  templateUrl: './private-policy.component.html',
  styleUrl: './private-policy.component.css'
})
export class PrivatePolicyComponent {

  /*------- Data  -----*/
  isShowPrivatePolicy:boolean = false;
  
  @Output() closePopup = new EventEmitter<boolean>();
  @Input() receivedData: boolean = false;

  /*------- Style  -----*/

  pStyle = 'text-blackColor/90'
  hStyle = 'text-xl font-bold text-blackColor/90'



  /*----------- Send data to Outter -----------*/
  sendPrivatePolicy() {
    this.isShowPrivatePolicy = false;
    this.closePopup.emit(this.isShowPrivatePolicy);
    console.log('sent',this.isShowPrivatePolicy);
  }

}
