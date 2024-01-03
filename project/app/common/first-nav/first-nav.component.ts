import {Component} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  selector: 'zxa-first-nav',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, RouterLink, RouterLinkActive],
  templateUrl: './first-nav.component.html',
  styleUrls: ['./first-nav.component.scss'],
})
export class ZxaFirstNavComponent {
  navList = [
    {name: 'Docs', link: '/docs', icon: 'assets/header/logo.svg'},
    {name: 'Experimental', link: '/experimental', icon: 'assets/header/logo.svg'},
    {name: 'Knowledge', link: '/knowledge', icon: 'assets/header/logo.svg'},
  ];
}
