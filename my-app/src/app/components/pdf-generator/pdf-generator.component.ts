import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import jsPDF from 'jspdf';
import {NgIf, NgStyle} from '@angular/common';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import autoTable from 'jspdf-autotable';
import {HttpClient} from "@angular/common/http";
import {firstValueFrom} from "rxjs";
import {isMobile} from "../utils/is-mobile.utils";

@Component({
  selector: 'app-pdf-generator',
  standalone: true,
  templateUrl: './pdf-generator.component.html',
  imports: [
    NgIf,
    NgStyle
  ],
  styleUrls: ['./pdf-generator.component.scss']
})
export class PdfGeneratorComponent implements OnChanges {
  @Input() formData: any;
  @Input() selectedItems: any[] = [];
  @Input() isValid: boolean = false;
  pdfUrl: SafeResourceUrl | null = null;
  showEmailConfirmation: boolean = false;

  private delayTimeout: any;
  private delayTime = 500;

  constructor(private sanitizer: DomSanitizer, private http: HttpClient) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.formData && this.selectedItems?.length > 0) {
      clearTimeout(this.delayTimeout);
      this.delayTimeout = setTimeout(() => {
        this.generatePDF(this.formData, this.selectedItems);
      }, this.delayTime);
    }
  }

  generatePDF(formData: any, selectedItems: any[], download?: boolean) {
    const doc = new jsPDF();
    this.convertImageToBase64('assets/images/logo.png').then(logoBase64 => {
      doc.addImage(logoBase64, 'PNG', 14, 10, 50, 10);
      doc.setFontSize(10);
      doc.text('kaffekassan', 14, 30);
      doc.text('info@kaffekassan.se', 14, 35);
      doc.text('+46 010-585 46 10', 14, 40);
      doc.text(formData.date, 180, 30, {align: 'right'});
      doc.text('#0001', 180, 35, {align: 'right'});
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text('Säljare', 14, 50);
      doc.text('Företag', 140, 50);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");

      doc.text(formData.seller, 14, 55);
      doc.text(formData.school, 14, 60);

      doc.text(formData.buyer.company, 140, 55);
      doc.text(formData.buyer.reference, 140, 60);
      doc.text(`${formData.buyer.address}`, 140, 65);
      doc.text(`${formData.buyer.postalCode} ${formData.buyer.city}`, 140, 70);

      const itemRows = selectedItems.map(item => [
        `${item.quantity} st`,
        item.item.title,
        `${item.item.price} kr/st`,
        `${item.quantity * item.item.price} kr`
      ]);

      autoTable(doc, {
        startY: 80,
        head: [['Antal', 'Produkt', 'Pris', 'Summa']],
        body: itemRows,
        styles: {fontSize: 10, halign: 'left', valign: 'middle', cellPadding: 3},
        headStyles: {fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold'},
        alternateRowStyles: {fillColor: [240, 240, 240]},
        didDrawPage: (data) => {
          const totalSum = selectedItems.reduce((sum, item) => sum + item.quantity * item.item.price, 0);
          doc.setFontSize(12);
          // @ts-ignore
          doc.text(`Totalt: ${totalSum} kr, varav moms 0 kr`, 14, data.cursor.y + 10);

          doc.setFontSize(10);
          // @ts-ignore
          doc.text('Momsen specificeras inte på detta kvitto eftersom försäljningen sker via skolklass eller förening.', 14, data.cursor.y + 20);
          // @ts-ignore
          doc.text('Företag kan dock dra av hela varuvärdet.', 14, data.cursor.y + 25);
        }
      });

      const pdfBlob = doc.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      console.log(pdfUrl);
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrl + '#toolbar=0');

      if (download == true) {
        doc.save('kvitto.pdf');
      }
    })
  }

  downloadPDF() {
    this.generatePDF(this.formData, this.selectedItems, true);
  }

  emailPDF() {
    this.showEmailConfirmation = true;
  }

  convertImageToBase64(path: string): Promise<string> {
    return firstValueFrom(this.http.get(path, {responseType: 'blob'}))
      .then(blob => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      });
  }

  protected readonly isMobile = isMobile;
}
