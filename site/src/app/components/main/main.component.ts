import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { FooterComponent, HeaderComponent } from "@zx-ng/app/components";

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
  footerHeight = 0;
  @ViewChild("footer")
  private footer!: ElementRef<HTMLDivElement>;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.footerHeight = this.footer && this.footer.nativeElement.offsetHeight || 100;
    });
  }
}
