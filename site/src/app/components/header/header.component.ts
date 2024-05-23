import {Component} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {RouterLink} from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'zxa-header',
  standalone: true,
  imports: [
    NgOptimizedImage,
    RouterLink,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  navs: { name: string, link: string }[] = [];

  constructor(private http: HttpClient) {
    this.http.get('assets/config/nav.config.json', {responseType: 'json'}).subscribe(res => {
      if (res) {
        this.navs = (res as any).nav;
      }
    });
  }
}
