import { Component } from "@angular/core";
import { ResizeObserverDirective, SizeData } from "@ngx-zx/directive";
import { MonacoComponent } from "@ngx-zx/editor";

@Component({
  selector: "zxa-experiment",
  imports: [
    ResizeObserverDirective,
    MonacoComponent,
  ],
  templateUrl: "./experiment.component.html",
  styleUrl: "./experiment.component.scss",
})
export class ExperimentComponent {
  onSizeChange(event: SizeData) {
    console.log("Size changed:", event);
  }
}
