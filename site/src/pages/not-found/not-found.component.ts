import {Component} from '@angular/core';
import {
  NzResultComponent, NzResultContentDirective, NzResultExtraDirective,
  NzResultIconDirective,
  NzResultSubtitleDirective, NzResultTitleDirective,
} from 'ng-zorro-antd/result';

@Component({
  selector: 'zxa-not-found',
  standalone: true,
  imports: [
    NzResultComponent,
    NzResultIconDirective,
    NzResultSubtitleDirective,
    NzResultContentDirective,
    NzResultExtraDirective,
    NzResultTitleDirective,
  ],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
})
export class NotFoundComponent {

}
