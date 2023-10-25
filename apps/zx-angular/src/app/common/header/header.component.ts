import { Component } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { ZxNavModule } from 'ng-zx'

@Component({
  selector: 'zxa-header',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, NzGridModule, ZxNavModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
}
