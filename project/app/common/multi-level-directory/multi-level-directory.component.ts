import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Route, Router} from '@angular/router';

@Component({
  selector: 'zxa-multi-level-directory',
  standalone: true,
  imports: [],
  templateUrl: './multi-level-directory.component.html',
  styleUrl: './multi-level-directory.component.scss',
})
export class MultiLevelDirectoryComponent implements OnInit {
  constructor(private http: HttpClient, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.http.get('/config/menu.config.json').subscribe((res) => {
      console.log(res);
      console.log(this.route);
    });
    this.route.params.subscribe(res => {
      console.log(res);
    });
    this.route.queryParams.subscribe(res => {
      console.log(res);
    });
    this.route.url.subscribe(res => {
      console.log(res);
    });
    this.route.data.subscribe(res => {
      console.log(res);
    });
  }

}
