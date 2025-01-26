import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ShareDataService {

  $informationUpdated = new Subject<boolean>();

  constructor() { }
}
