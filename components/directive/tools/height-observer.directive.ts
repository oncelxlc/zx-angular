import {
  afterNextRender,
  booleanAttribute, DestroyRef,
  Directive,
  ElementRef, inject,
  Input,
  numberAttribute,
  OnInit,
  Renderer2,
} from "@angular/core";
import { debounceTime, Subject } from "rxjs";

/**
 * 监听元素高度变化
 *
 * TODO 进一步优化，支持更多场景
 */
@Directive({
  selector: "[zxHeightObserver]",
  standalone: true,
})
export class HeightObserverDirective implements OnInit {
  @Input({required: true}) targetElement!: HTMLElement;
  @Input({transform: numberAttribute}) debounceTime = 100; // 默认防抖时间为100ms
  @Input({transform: booleanAttribute}) isDocumentHeight = true; // 是否文档高度
  @Input({transform: numberAttribute}) fixedHeight?: number; // 可选的固定高度值

  private resizeObserver!: ResizeObserver;
  private heightChangeSubject = new Subject<void>();

  private destroyRef = inject(DestroyRef);

  constructor(private el: ElementRef, private renderer: Renderer2) {
    afterNextRender(() => {
      this.setupResizeObserver();
      this.setupHeightChangeSubscription();
      this.destroyRef.onDestroy(() => {
        this.resizeObserver.disconnect();
        this.heightChangeSubject.complete();
      });
    });
  }

  ngOnInit(): void {
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
      availableHeight = document.documentElement.offsetHeight;
    } else if (this.fixedHeight !== undefined) {
      availableHeight = this.fixedHeight;
    } else {
      console.warn("Neither parent height nor fixed height is specified.");
      return;
    }

    const currentElementHeight = this.el.nativeElement.offsetHeight;
    const targetMinHeight = Math.max(0, availableHeight - currentElementHeight);

    this.renderer.setStyle(this.targetElement, "minHeight", `${targetMinHeight}px`);
  }

}
