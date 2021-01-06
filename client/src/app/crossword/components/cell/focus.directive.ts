import { Directive, Input, ElementRef, EventEmitter, OnChanges } from "@angular/core";

@Directive({
  selector: "[appFocus]"
})
export class FocusDirective implements OnChanges {

  @Input() public appFocus: EventEmitter<boolean>;
  public constructor(private element: ElementRef) { }

  public ngOnChanges(): void {
    this.element.nativeElement.focus();
  }
}
