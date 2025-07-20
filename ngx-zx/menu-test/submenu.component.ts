import { Component, computed, input, output } from "@angular/core";
import { MenuConfig, MenuItem } from "./menu.interface";
import { MenuItemComponent } from "./menu-item.component";

@Component({
  selector: "zx-submenu",
  imports: [
    MenuItemComponent
  ],
  template: `
    <li class="zx-menu-submenu"
        [class.zx-menu-submenu-open]="isOpen()"
        [class.zx-menu-submenu-disabled]="item().disabled">

      <div class="zx-menu-submenu-title"
           [style.padding-left.px]="titlePaddingLeft()"
           tabindex="0"
           (click)="toggleOpen()">
        <span class="zx-menu-title-content">
          @if (item().icon) {
            <i [class]="item().icon" class="zx-menu-item-icon"></i>
          }
          <span class="zx-menu-title-text">{{ item().label }}</span>
        </span>
        <i class="zx-menu-submenu-arrow"
           [class.zx-menu-submenu-arrow-up]="isOpen()"></i>
      </div>

      <ul class="zx-menu zx-menu-sub"
          [class.zx-menu-hidden]="!isOpen()"
          [class.zx-menu-vertical]="config().mode !== 'horizontal'"
          [class.zx-menu-horizontal]="config().mode === 'horizontal'"
          [class.zx-menu-dark]="config().theme === 'dark'"
          [class.zx-menu-light]="config().theme === 'light'">

        @for (child of item().children; track child.key) {
          @if (!child.children || child.children.length === 0) {
            <zx-menu-item
              [item]="child"
              [config]="config()"
              [level]="level() + 1"
              (itemClick)="onItemClick($event)">
            </zx-menu-item>
          } @else {
            <zx-submenu
              [item]="child"
              [config]="config()"
              [level]="level() + 1"
              [openKeys]="openKeys()"
              (itemClick)="onItemClick($event)"
              (openChange)="onOpenChange($event)">
            </zx-submenu>
          }
        }
      </ul>
    </li>
  `,
  styleUrl: "./submenu.component.scss"
})
export class SubmenuComponent {
  item = input.required<MenuItem>();
  config = input.required<MenuConfig>();
  level = input<number>(0);
  openKeys = input<string[]>([]);
  readonly itemClick = output<MenuItem>();
  readonly openChange = output<{ key: string, open: boolean }>();

  isOpen = computed(() => this.openKeys().includes(this.item().key));

  titlePaddingLeft = computed(() => {
    if (this.config().mode === "horizontal") {
      return 16;
    }
    return 16 + (this.level() * this.config().inlineIndent);
  });

  toggleOpen() {
    if (this.item().disabled) {
      return;
    }
    this.openChange.emit({
      key: this.item().key,
      open: !this.isOpen()
    });
  }

  onItemClick(item: MenuItem) {
    this.itemClick.emit(item);
  }

  onOpenChange(event: { key: string, open: boolean }) {
    this.openChange.emit(event);
  }
}
