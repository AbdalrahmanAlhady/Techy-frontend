import { Component, Input } from '@angular/core';
import { Order } from '../../shared/models/Order';

@Component({
  standalone: false,
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrl: './order.component.css',
})
export class OrderComponent {
  @Input() order!: Order;
}
