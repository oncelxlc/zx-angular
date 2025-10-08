import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { AsideComponent, FooterComponent, HeaderComponent } from "@zxa-components/container";

@Component({
  selector: "zxa-container",
  imports: [
    RouterOutlet,
    AsideComponent,
    FooterComponent,
    HeaderComponent,
  ],
  templateUrl: "./container.component.html",
  styleUrl: "./container.component.scss"
})
export class ContainerComponent {

}
