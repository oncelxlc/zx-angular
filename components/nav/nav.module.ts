import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZxNavDirective } from './nav.directive'
import { ZxNavItemDirective } from './nav-item.directive'

@NgModule({
  imports: [CommonModule, ZxNavDirective, ZxNavItemDirective],
  exports: [ZxNavDirective, ZxNavItemDirective],
})
export class ZxNavModule {
}
