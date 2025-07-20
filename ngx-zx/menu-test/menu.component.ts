import { Component, computed, input, output } from "@angular/core";
import { MenuConfig, MenuItem } from "./menu.interface";
import { MenuItemGroupComponent } from "./menu-item-group.component";
import { MenuItemComponent } from "./menu-item.component";
import { SubmenuComponent } from "./submenu.component";

@Component({
  selector: "zx-menu",
  imports: [
    MenuItemGroupComponent,
    SubmenuComponent,
    MenuItemComponent
  ],
  template: `
    <ul class="zx-menu"
        [class.zx-menu-vertical]="mode() === 'vertical'"
        [class.zx-menu-horizontal]="mode() === 'horizontal'"
        [class.zx-menu-inline]="mode() === 'inline'"
        [class.zx-menu-dark]="theme() === 'dark'"
        [class.zx-menu-light]="theme() === 'light'">

      @for (item of items(); track item.key) {
        <!-- 分割线 -->
        @if (item.type === 'divider') {
          <li class="zx-menu-item-divider"></li>
        }

        <!-- 菜单组 -->
        @if (item.type === 'group') {
          <zx-menu-item-group
            [item]="item"
            [config]="menuConfig()"
            [level]="0"
            [openKeys]="openKeys()"
            (itemClick)="onItemClick($event)"
            (openChange)="onOpenChange($event)">
          </zx-menu-item-group>
        }

        <!-- 子菜单 -->
        @if ((item.type === 'submenu' || (!item.type && item.children && item.children.length > 0))) {
          <zx-submenu
            [item]="item"
            [config]="menuConfig()"
            [level]="0"
            [openKeys]="openKeys()"
            (itemClick)="onItemClick($event)"
            (openChange)="onOpenChange($event)">
          </zx-submenu>
        }

        <!-- 普通菜单项 -->
        @if ((!item.children || item.children.length === 0) && item.type !== 'divider' && item.type !== 'group') {
          <zx-menu-item
            [item]="item"
            [config]="menuConfig()"
            [level]="0"
            (itemClick)="onItemClick($event)">
          </zx-menu-item>
        }
      }
    </ul>
  `,
  styleUrl: "./menu.component.scss"
})
export class MenuComponent {
  items = input<MenuItem[]>([]);
  mode = input<"vertical" | "horizontal" | "inline">("vertical");
  theme = input<"light" | "dark">("light");
  selectedKey = input<string>("");
  openKeys = input<string[]>([]);
  inlineIndent = input<number>(24);

  readonly itemClick = output<MenuItem>();
  readonly openChange = output<string[]>();

  menuConfig = computed<MenuConfig>(() => ({
    mode: this.mode(),
    theme: this.theme(),
    selectedKey: this.selectedKey(),
    openKeys: this.openKeys(),
    inlineIndent: this.inlineIndent()
  }));

  onItemClick(item: MenuItem) {
    this.itemClick.emit(item);
  }

  onOpenChange(event: { key: string, open: boolean }) {
    const currentOpenKeys = [...this.openKeys()];
    let newOpenKeys: string[];

    if (event.open) {
      if (!currentOpenKeys.includes(event.key)) {
        newOpenKeys = [...currentOpenKeys, event.key];
      } else {
        newOpenKeys = currentOpenKeys;
      }
    } else {
      newOpenKeys = currentOpenKeys.filter(key => key !== event.key);
    }

    this.openChange.emit(newOpenKeys);
  }
}
