import {Component, OnInit} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'zxa-first-nav',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, RouterLink, RouterLinkActive],
  templateUrl: './first-nav.component.html',
  styleUrls: ['./first-nav.component.scss'],
})
export class ZxaFirstNavComponent implements OnInit{
  navList = [
    {name: 'Docs', link: '/docs', icon: 'assets/header/logo.svg'},
    {name: 'Experimental', link: '/experimental', icon: 'assets/header/logo.svg'},
    {name: 'Knowledge', link: '/knowledge', icon: 'assets/header/logo.svg'},
  ];

  constructor(private httpClient: HttpClient) {
  }

  ngOnInit(): void {
    this.httpClient.get('/config/first-nav.json').subscribe(console.log);
  }
}
