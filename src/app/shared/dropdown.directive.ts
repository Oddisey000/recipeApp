import { Directive, HostListener, HostBinding, ElementRef } from '@angular/core';

@Directive({
  selector: '[appDropdown]',
  exportAs: 'appDropdown'
})
export class DropdownDirective {
  
  @HostBinding('class.show') isShow = false;

  constructor(private elRef: ElementRef) { }

  @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
    this.isShow = this.elRef.nativeElement.contains(event.target) ? !this.isShow : false;
  }

}
