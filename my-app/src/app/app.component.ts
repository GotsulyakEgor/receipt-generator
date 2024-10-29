import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ListComponent} from "./components/list/list.component";
import {FormComponent} from "./components/form/form.component";
import {FormGroup} from "@angular/forms";
import {Item} from "./interfaces/item";
import {PdfGeneratorComponent} from "./components/pdf-generator/pdf-generator.component";
import {HeaderComponent} from "./components/header/header.component";
import {FooterComponent} from "./components/footer/footer.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ListComponent, FormComponent, PdfGeneratorComponent, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  selectedItems: { item: Item | undefined, quantity: number }[] = [];
  contactInfo?: FormGroup;
  isFormValid: boolean = false;

  updateSelectedItems(items: { item: Item | undefined, quantity: number }[]) {
    this.selectedItems = items;
  }

  updateContactInfo(form: FormGroup) {
    this.contactInfo = form.value;
    this.isFormValid = form.valid;
  }
}
