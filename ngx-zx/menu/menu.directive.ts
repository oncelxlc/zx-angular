import { Directive, input } from "@angular/core";

@Directive({
  selector: "[zxMenu]",
  host: {
    class: "zx-menu",
    "[class.zx-menu-vertical]": "zxMode() === 'vertical'",
    "[class.zx-menu-inline]": "zxMode() === 'inline'",
  }
})
export class MenuDirective {
  zxMode = input<"inline" | "vertical">("vertical");
}
