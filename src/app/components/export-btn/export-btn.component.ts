import { Component, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ExportTemplateComponent } from '../export-template/export-template.component';

@Component({
  selector: 'app-export-btn',
  imports: [MatRippleModule, MatIconModule, CommonModule, ExportTemplateComponent],
  templateUrl: './export-btn.component.html',
  styleUrl: './export-btn.component.css'
})
export class ExportBtnComponent implements AfterViewInit {

  /*--------- style ---------*/
  isLoading: boolean = false;


  /*--------- 取得 `app-export-template` 元素 ---------*/
  @ViewChild('exportTemplate', { static: false }) exportTemplate!: ElementRef;

  /*--------- Input ---------*/
  @Input() fileName: string = 'exported-data.pdf';
  @Input() trackingNumber: string = ''; 

  ngAfterViewInit() {
    if (!this.exportTemplate) {
      console.error("exportTemplate 未找到!");
    }
  }

  /*--------- Function: 匯出 PDF ---------*/
  exportToPDF() {

    if (!this.exportTemplate) {
      console.error("exportTemplate勒???");
      return;
    }

    const doc = new jsPDF({
      orientation: 'portrait', 
      unit: 'mm',
      format: 'a4'
    });

    const content = this.exportTemplate.nativeElement.innerHTML;

    doc.html(content, {
      callback: function (pdf) {
        pdf.save("exported-data.pdf");
      },
      x: 10,
      y: 10,
      width: 190, 
      windowWidth: 800
    });

  }
}
