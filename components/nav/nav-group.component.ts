import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: '[zx-nav-group]',
  exportAs: 'zxNavGroup',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p>
      nav-group works!
    </p>
  `,
  styles: [
  ]
})
export class ZxNavGroupComponent {
  @Input() public zxTitle: string = '';

}
