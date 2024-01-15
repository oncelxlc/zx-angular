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
  navList = [] as any[];

  constructor(private httpClient: HttpClient) {
  }

  ngOnInit(): void {
    this.httpClient.get('/config/first-nav.json').subscribe((res: any) => {
      this.navList = res.nav as any[];
    });
  }
}
