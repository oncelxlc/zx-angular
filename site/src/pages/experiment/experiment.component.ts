import { Component } from "@angular/core";
import { ResizeObserverDirective, SizeData } from "@ngx-zx/directive";

@Component({
  selector: "zxa-experiment",
  imports: [
    ResizeObserverDirective
  ],
  templateUrl: "./experiment.component.html",
  styleUrl: "./experiment.component.scss"
})
export class ExperimentComponent {
  onSizeChange(event: SizeData) {
    console.log("Size changed:", event);
  }
}
