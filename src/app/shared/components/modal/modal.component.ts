import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';

@Component({
  standalone: false,
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent implements OnInit, OnDestroy {
  @Input() modalRef?: BsModalRef;
  @Input() title: string = '';
  subscriptions = new Subscription();
  constructor(
    private modalService: BsModalService,
    private render: Renderer2,
  ) {}

  ngOnInit(): void {

  }
  closeModal() {
    this.modalRef?.hide();
    this.ngOnDestroy();
  }


  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
