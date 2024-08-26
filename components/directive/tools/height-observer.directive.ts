import {
  booleanAttribute,
  Directive,
  ElementRef,
  Input,
  numberAttribute,
  OnDestroy,
  OnInit,
  Renderer2,
} from "@angular/core";
import { debounceTime, Subject } from "rxjs";

/**
 * 监听元素高度变化
 *
 * TODO 默认高度设置，定位的父元素高度
 */
@Directive({
  selector: "[zxHeightObserver]",
  standalone: true,
})
export class HeightObserverDirective implements OnInit, OnDestroy {
  @Input({required: true}) targetElement!: HTMLElement;
  @Input({transform: numberAttribute}) debounceTime = 100; // 默认防抖时间为100ms
  @Input({transform: booleanAttribute}) isDocumentHeight = true; // 是否文档高度
  @Input({transform: numberAttribute}) fixedHeight?: number; // 可选的固定高度值

  private resizeObserver!: ResizeObserver;
  private heightChangeSubject = new Subject<void>();

  constructor(private el: ElementRef, private renderer: Renderer2) {
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
    this.resizeObserver = new ResizeObserver(() => {
      this.heightChangeSubject.next();
    });
    this.resizeObserver.observe(document.documentElement);
    this.resizeObserver.observe(this.targetElement);
  }

  /**
   * 设置高度变化订阅
   * @private
   */
  private setupHeightChangeSubscription() {
    this.heightChangeSubject.pipe(
      debounceTime(this.debounceTime),
    ).subscribe(() => {
      this.updateTargetHeight();
    });
  }

  /**
   * 更新目标元素的最小高度
   * @private
   */
  private updateTargetHeight() {
    if (!this.targetElement) return;

    let availableHeight: number;
    if (this.isDocumentHeight) {
      availableHeight = document.documentElement.clientHeight;
    } else if (this.fixedHeight !== undefined) {
      availableHeight = this.fixedHeight;
    } else {
      console.warn("Neither parent height nor fixed height is specified.");
      return;
    }

    const currentElementHeight = this.el.nativeElement.offsetHeight;
    const targetMinHeight = Math.max(0, availableHeight - currentElementHeight);

    this.renderer.setStyle(this.targetElement, "minHeight", `${ targetMinHeight }px`);
  }

}
