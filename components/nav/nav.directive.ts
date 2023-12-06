import { Directive } from '@angular/core';

@Directive({
  selector: '[zx-nav]',
  exportAs:  'zxNav',
  standalone: true,
  host: {
    '[class.zx-nav]': 'true'
  }
})
export class ZxNavDirective {

  constructor() { }

}
