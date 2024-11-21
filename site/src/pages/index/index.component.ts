import { Component } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { MatSlideToggle } from "@angular/material/slide-toggle";

@Component({
  selector: 'zxa-index',
  standalone: true,
  imports: [
    MatSlideToggle,
    MatIcon,
  ],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss'
})
export class IndexComponent {

}
