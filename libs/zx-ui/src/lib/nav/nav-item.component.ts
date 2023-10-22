import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'zx-nav-item',
  standalone: true,
  imports: [CommonModule],
  template: `<div><ng-content></ng-content>zx-nav-item</div>`
})
export class ZxNavItemComponent {}
