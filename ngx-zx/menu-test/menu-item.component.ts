import { Component, computed, input, output } from "@angular/core";
import { MenuConfig, MenuItem } from "./menu.interface";

@Component({
  selector: "zx-menu-item",
  imports: [],
  template: `
    <li class="zx-menu-item"
        [class.zx-menu-item-selected]="isSelected()"
        [class.zx-menu-item-disabled]="item().disabled"
        [style.padding-left.px]="paddingLeft()"
        (click)="handleClick()"
        tabindex="0">
      <span class="zx-menu-title-content">
        @if (item().icon) {
          <i [class]="item().icon" class="zx-menu-item-icon"></i>
        }
        <span class="zx-menu-title-text">{{ item().label }}</span>
      </span>
    </li>
  `,
  styleUrl: "./menu-item.component.scss"
})
export class MenuItemComponent {
  item = input.required<MenuItem>();
  config = input.required<MenuConfig>();
  level = input<number>(0);
  readonly itemClick = output<MenuItem>();

  isSelected = computed(() => this.item().key === this.config().selectedKey);

  paddingLeft = computed(() => {
    if (this.config().mode === "horizontal") {
      return 16;
    }
    return 16 + (this.level() * this.config().inlineIndent);
  });

  handleClick() {
    if (this.item().disabled) {
      return;
    }
    this.itemClick.emit(this.item());
  }
}
