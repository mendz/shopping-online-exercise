import { Directive, ElementRef, Renderer2, OnInit, Input } from '@angular/core';

@Directive({
  selector: '[appCentered]',
})
export class CenteredDirective implements OnInit {
  @Input() centerText: boolean;
  @Input() maxWidth: string;

  constructor(private elRef: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    // this.renderer.setStyle(this.elRef.nativeElement, 'width', '80%');
    // this.renderer.setStyle(this.elRef.nativeElement, 'margin', 'auto');
    this.renderer.addClass(this.elRef.nativeElement, 'centered');
    if (this.centerText) {
      this.renderer.setStyle(this.elRef.nativeElement, 'text-align', 'center');
    }
    if (this.maxWidth) {
      this.renderer.setStyle(
        this.elRef.nativeElement,
        'max-width',
        this.maxWidth
      );
    }
  }
}
