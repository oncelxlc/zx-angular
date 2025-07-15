import { Component } from "@angular/core";
import { AsideComponent, FooterComponent, HeaderComponent } from "@zxa-components/container";

@Component({
  selector: "zxa-main",
  imports: [HeaderComponent, FooterComponent, AsideComponent],
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"],
})
export class MainComponent {
}
