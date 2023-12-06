import { booleanAttribute, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: '[zx-sub-nav]',
  exportAs: 'zxSubNav',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="zx-sub-nav-title">
      <span class="zx-sub-nav-title-icon">1</span>
      <span class="zx-sub-nav-title-content">
        {{ zxTitle }}
      </span>
      <span class="zx-sub-nav-title-arrow">2</span>
    </div>
    <div class="zx-sub-nav-child">
      <ng-content></ng-content>
    </div>
  `,
  styles: [
  ]
})
export class ZxSubNavComponent {
  @Input() public zxTitle: string = '';
  @Input() public zxIcon: string = '';
  @Input({transform: booleanAttribute}) public zxOpen: boolean = false;

}
