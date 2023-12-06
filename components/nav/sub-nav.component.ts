import { booleanAttribute, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: '[zx-sub-nav]',
  exportAs: 'zxSubNav',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p>
      sub-nav works!
    </p>
  `,
  styles: [
  ]
})
export class ZxSubNavComponent {
  @Input() public zxTitle: string = '';
  @Input({transform: booleanAttribute}) public zxOpen: boolean = false;

}
