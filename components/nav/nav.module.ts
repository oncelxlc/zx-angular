import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZxNavDirective, ZxNavGroupComponent, ZxNavItemComponent, ZxSubNavComponent } from './';

@NgModule({
  imports: [
    CommonModule,
    ZxNavDirective,
    ZxNavGroupComponent,
    ZxNavItemComponent,
    ZxSubNavComponent
  ],
  exports: [
    ZxNavDirective,
    ZxNavGroupComponent,
    ZxNavItemComponent,
    ZxSubNavComponent
  ]
})
export class ZxNavModule {
}
