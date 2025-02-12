import { Component, OnInit } from '@angular/core';
import { OrderService } from '../shared/services/order.service';
import { GQLQueryOptions } from '../shared/models/GQLQueryOptions';
import { Order } from '../shared/models/Order';

@Component({
  standalone: false,
  selector: 'app-myorders',
  templateUrl: './myorders.component.html',
  styleUrl: './myorders.component.css',
})
export class MyordersComponent implements OnInit {
  orders: Order[] = [];
  constructor(private orderService: OrderService) {}
  ngOnInit(): void {
    let options: GQLQueryOptions = { filters: { user: ['2'] } };

    this.orderService.getOrders(options).subscribe((res) => {
      this.orders = res.data.orders;
      console.log(res);
    });
  }
}
