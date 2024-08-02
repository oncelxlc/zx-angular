import {NgOptimizedImage} from '@angular/common';
import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'zxa-not-found',
  standalone: true,
  imports: [
    NgOptimizedImage,
    RouterLink,
  ],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
})
export class NotFoundComponent {

}
