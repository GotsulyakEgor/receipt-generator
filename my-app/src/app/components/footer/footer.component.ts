import { Component } from '@angular/core';
import {NgIf} from "@angular/common";
import {isMobile} from "../utils/is-mobile.utils";

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  isOpen: any = {
    kaffekassan: false,
    forsaljning: false,
    kalkylatorer: false
  };

  toggleMenu(section: any): void {
    this.isOpen[section] = !this.isOpen[section];
  }

  protected readonly isMobile = isMobile;
}
