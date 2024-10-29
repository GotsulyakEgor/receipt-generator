import { Component } from '@angular/core';
import {NgIf} from "@angular/common";
import {isMobile} from "../utils/is-mobile.utils";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  protected readonly isMobile = isMobile;
}
