import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-error-box',
  template: `
    <div class="error" appCentered maxWidth="500px">
      <p>{{ error }}</p>
    </div>
  `,
  styleUrls: ['./error-box.component.css'],
})
export class ErrorBoxComponent implements OnInit {
  @Input() error: string;

  constructor() {}

  ngOnInit() {}
}
