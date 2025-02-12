import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { Product } from '../models/Product';
import { Brand } from '../models/Brand';
import { Category } from '../models/Category';
import { Order } from '../models/Order';
import { OrderItem } from '../models/OrderItem';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root',
})
export class ShareDataService {
  updateOrCreateEntitySignal = signal<
    Brand | Category | Order | OrderItem | Product | User | null
  >(null);
  $informationUpdated = new Subject<boolean>();

  constructor() {}
}
