import { Component } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { ZxNavComponent } from 'ng-zx'

@Component({
  selector: 'zxa-header',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, NzGridModule, ZxNavComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
}
