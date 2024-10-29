import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private itemsUrl = 'assets/items.json';
  constructor(private http: HttpClient) { }

  getItems(): Observable<any> {
    return this.http.get<any>(this.itemsUrl);
  }
}
