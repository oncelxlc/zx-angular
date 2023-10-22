import { Component } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { Nav_Components } from 'ng-zx'

@Component({
  selector: 'zxa-header',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, NzGridModule, Nav_Components],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
}
