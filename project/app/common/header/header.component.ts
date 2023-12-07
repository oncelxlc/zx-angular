import { Component } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NzGridModule } from 'ng-zorro-antd/grid';

@Component({
  selector: 'zxa-header',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, NzGridModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
}
