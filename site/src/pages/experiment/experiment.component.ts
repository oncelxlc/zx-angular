import { Component } from '@angular/core';
import { TableComponent } from '@ngx-zx/table';

@Component({
  selector: 'zxa-experiment',
  standalone: true,
  imports: [
    TableComponent,
  ],
  templateUrl: './experiment.component.html',
  styleUrl: './experiment.component.scss'
})
export class ExperimentComponent {

}
