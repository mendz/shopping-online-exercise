import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
  animations: [
    trigger('modal', [
      transition('void => *', [
        style({ transform: 'scale3d(.3, .3, .3)' }),
        animate(200),
      ]),
      // TODO: find why this is not working
      transition('* => void', [
        animate(200, style({ transform: 'scale3d(.0, .0, .0)' })),
      ]),
    ]),
  ],
})
export class AlertComponent implements OnInit {
  @Input() message: string;
  @Output() closeAlert = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {}

  onClose() {
    this.closeAlert.emit();
  }
}
