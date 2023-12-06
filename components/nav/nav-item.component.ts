import { booleanAttribute, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: '[zx-nav-item]',
  exportAs: 'zxNavItem',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p>
      nav-item works!
    </p>
  `,
  styles: [
  ]
})
export class ZxNavItemComponent {
  @Input({transform: booleanAttribute}) public zxSelected: boolean = false;

}
