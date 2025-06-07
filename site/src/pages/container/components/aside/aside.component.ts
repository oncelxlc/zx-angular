import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'zxa-aside',
  imports: [
    NgOptimizedImage,
    RouterLink,
  ],
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.scss'
})
export class AsideComponent {

}
