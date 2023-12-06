import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZxNavModule } from 'zx-ui/nav/nav.module';

@Component({
  selector: 'zx-nav',
  standalone: true,
  imports: [CommonModule, ZxNavModule],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class ZxNavComponent {
  @Input() public navs = [];
}
