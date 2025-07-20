import { Component, computed, input, output } from "@angular/core";
import { MenuConfig, MenuItem } from "./menu.interface";
import { SubmenuComponent } from "./submenu.component";
import { MenuItemComponent } from "./menu-item.component";

@Component({
  selector: "zx-menu-item-group",
  imports: [
    MenuItemComponent,
    SubmenuComponent
  ],
  template: `
    <li class="zx-menu-item-group">
      <div class="zx-menu-item-group-title"
           [style.padding-left.px]="titlePaddingLeft()">
        {{ item().label }}
      </div>
      <ul class="zx-menu-item-group-list">
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
  styleUrl: "./menu-item-group.component.scss"
})
export class MenuItemGroupComponent {
  item = input.required<MenuItem>();
  config = input.required<MenuConfig>();
  level = input<number>(0);
  openKeys = input<string[]>([]);
  readonly itemClick = output<MenuItem>();
  readonly openChange = output<{ key: string, open: boolean }>();

  titlePaddingLeft = computed(() => {
    if (this.config().mode === "horizontal") {
      return 16;
    }
    return 16 + (this.level() * this.config().inlineIndent);
  });

  onItemClick(item: MenuItem) {
    this.itemClick.emit(item);
  }

  onOpenChange(event: { key: string, open: boolean }) {
    this.openChange.emit(event);
  }
}
