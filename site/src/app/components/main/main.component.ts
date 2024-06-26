import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { FooterComponent } from "@zx-ng/app/components/footer/footer.component";
import { HeaderComponent } from "@zx-ng/app/components/header/header.component";

export const PROGRESS_BAR_DELAY = 30;

@Component({
  selector: "zxa-main",
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"],
})
export class MainComponent implements AfterViewInit {
  footerHeight: number = 0;
  @ViewChild("footer") private footer!: ElementRef<HTMLDivElement>;

  constructor() {
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.footerHeight = this.footer && this.footer.nativeElement.offsetHeight || 100;
    });
  }
}
