import { Directive } from '@angular/core';

@Directive({
  selector: '[zx-nav]',
  exportAs:  'zxNav',
  standalone: true
})
export class ZxNavDirective {

  constructor() { }

}
