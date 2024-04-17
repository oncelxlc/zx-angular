import {NgOptimizedImage} from '@angular/common';
import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {NzButtonComponent} from 'ng-zorro-antd/button';
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
    NgOptimizedImage,
    NzButtonComponent,
    RouterLink,
  ],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
})
export class NotFoundComponent {

}
