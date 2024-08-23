import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, debounceTime } from 'rxjs';

/**
 * 监听元素高度变化
 *
 * TODO 默认高度设置，定位的父元素高度
 */
@Directive({
  selector: '[zxHeightObserver]',
  standalone: true,
})
export class HeightObserverDirective implements OnInit, OnDestroy {
  @Input() targetElement!: HTMLElement;
  @Input() debounceTime = 100; // 默认防抖时间为100ms

  private resizeObserver!: ResizeObserver;
  private heightChangeSubject = new Subject<number>();

  constructor(private el: ElementRef) {
  }

  ngOnInit(): void {
    this.setupResizeObserver();
    this.setupHeightChangeSubscription();
  }

  ngOnDestroy(): void {
    this.resizeObserver.disconnect();
    this.heightChangeSubject.complete();
  }

  /**
   * 设置ResizeObserver
   * @private
   */
  private setupResizeObserver() {
    this.resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const height = entry.contentRect.height;
        this.heightChangeSubject.next(height);
      }
    });

    this.resizeObserver.observe(this.el.nativeElement);
  }

  /**
   * 设置高度变化订阅
   * @private
   */
  private setupHeightChangeSubscription() {
    this.heightChangeSubject.pipe(
      debounceTime(this.debounceTime),
    ).subscribe(height => {
      if (this.targetElement) {
        this.targetElement.style.minHeight = `${height}px`;
      }
    });
  }

}
