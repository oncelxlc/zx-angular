import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { HeightObserverDirective } from '@ngx-zx/directive';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'zxa-main',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, HeightObserverDirective],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements AfterViewInit {
  footerHeight = 0;
  @ViewChild('footer')
  private footer!: ElementRef<HTMLDivElement>;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.footerHeight = this.footer && this.footer.nativeElement.offsetHeight || 100;
    });
  }
}
