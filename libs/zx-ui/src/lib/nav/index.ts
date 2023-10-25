import { ZxNavComponent } from './nav.component';
import { ZxNavItemComponent } from './nav-item.component'
import { NgModule } from '@angular/core'

/**
 * ZxNavModule 是一个用于在 Angular 应用程序中提供导航功能的模块。
 * 它导出 ZxNavComponent 和 ZxNavItemComponent，并导入它们以在模块中使用。
 */
@NgModule({
  imports: [ZxNavComponent, ZxNavItemComponent],
  exports: [ZxNavComponent, ZxNavItemComponent]
})
export class ZxNavModule {}
