import { isPlatformBrowser } from "@angular/common";
import {
  booleanAttribute,
  computed,
  DestroyRef,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  NgZone,
  numberAttribute,
  OnChanges,
  OnInit,
  output,
  PLATFORM_ID,
  signal,
  SimpleChanges,
  WritableSignal,
} from "@angular/core";
import {
  Subject,
  animationFrameScheduler,
  merge,
  filter,
  map,
  observeOn,
  shareReplay,
  takeUntil,
  tap,
  debounceTime,
} from "rxjs";
import { ResizeState, SizeData } from "./resize-observer.type";

/**
 * 用于监听元素大小变化的指令
 * 该指令使用ResizeObserver API来检测元素的尺寸变化，并提供相关事件和状态管理。
 */
@Directive({
  selector: "[zxResizeObserver]",
})
export class ResizeObserverDirective implements OnInit, OnChanges {
  // 宽度和高度变化事件
  readonly sizeChange = output<SizeData>();
  // 开始和结束调整大小事件
  readonly sizeChangeStart = output<SizeData>();
  readonly sizeChangeEnd = output<SizeData>();
  // 调整大小状态变化事件
  readonly resizeStateChange = output<ResizeState>();

  // 防抖设置, 默认16ms
  debounceTime = input<number, number | string>(16, {transform: numberAttribute});
  // 是否在Angular外部运行
  runOutsideAngular = input<boolean, boolean | null>(true, {transform: booleanAttribute});
  // 尺寸变化阈值，单位为像素
  threshold = input<number, number | string>(1, {transform: numberAttribute});

  // 依赖注入
  private elementRef = inject(ElementRef<HTMLElement>);
  private destroyRef = inject(DestroyRef);
  private ngZone = inject(NgZone);
  private platformId = inject(PLATFORM_ID);

  // 最后一次尺寸数据
  private lastSize: WritableSignal<SizeData | null> = signal<SizeData | null>(null);
  // 调整大小状态
  private resizeState: WritableSignal<ResizeState> = signal<ResizeState>({
    isResizing: false,
    startTime: 0,
    changeCount: 0,
  });

  // 计算属性
  readonly currentResizeState = computed(() => this.resizeState());
  readonly hasSize = computed(() => this.lastSize() !== null);

  // RxJS Subjects
  private destroy$ = new Subject<void>();
  private resizeEntries$ = new Subject<ResizeObserverEntry[]>();
  private forceCheck$ = new Subject<void>();
  private resizeObserver: ResizeObserver | null = null;

  constructor() {
    // 监听状态变化并发出事件
    effect(() => {
      const state = this.resizeState();
      this.ngZone.run(() => {
        this.resizeStateChange.emit(state);
      });
    });

    // 自动清理
    this.destroyRef.onDestroy(() => {
      this.cleanup();
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initResizeObserver();
      this.setupResizeStream();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["threshold"]) {
      console.log(changes["threshold"]);
    }
  }

  private initResizeObserver(): void {
    const observerCallback = (entries: ResizeObserverEntry[]) => {
      if (this.runOutsideAngular()) {
        this.ngZone.runOutsideAngular(() => {
          this.resizeEntries$.next(entries);
        });
      } else {
        this.resizeEntries$.next(entries);
      }
    };

    this.resizeObserver = new ResizeObserver(observerCallback);
    this.resizeObserver.observe(this.elementRef.nativeElement);
  }

  private setupResizeStream(): void {
    // 主要的resize流处理
    const resizeStream$ = merge(
      // 来自ResizeObserver的事件
      this.resizeEntries$.pipe(
        filter(entries => entries.length > 0),
        map(entries => entries[0]),
        observeOn(animationFrameScheduler), // 替代requestAnimationFrame
        map(entry => this.extractSizeData(entry)),
      ),
      // 强制检查的事件
      this.forceCheck$.pipe(
        map(() => this.getCurrentSize()),
        filter((size): size is SizeData => size !== null),
      ),
    ).pipe(
      // 过滤出有意义的尺寸变化
      filter(newSize => this.hasSignificantResize(newSize)),
      shareReplay(1),
      takeUntil(this.destroy$),
    );

    // 处理resize开始事件
    resizeStream$.pipe(
      filter(() => !this.resizeState().isResizing),
      tap(sizeData => {
        const newState: ResizeState = {
          isResizing: true,
          startTime: Date.now(),
          changeCount: 0,
        };
        this.resizeState.set(newState);

        this.ngZone.run(() => {
          this.sizeChangeStart.emit({...sizeData});
        });
      }),
      takeUntil(this.destroy$),
    ).subscribe();

    // 更新变化计数
    resizeStream$.pipe(
      tap(() => {
        this.resizeState.update(state => ({
          ...state,
          changeCount: state.changeCount + 1,
        }));
      }),
      takeUntil(this.destroy$),
    ).subscribe();

    // 处理防抖的尺寸变化事件
    resizeStream$.pipe(
      debounceTime(this.debounceTime()),
      tap(sizeData => {
        this.emitSizeChange(sizeData);
      }),
      takeUntil(this.destroy$),
    ).subscribe();

    // 处理resize结束事件
    resizeStream$.pipe(
      debounceTime(this.debounceTime()),
      tap(sizeData => {
        const state = this.resizeState();
        this.resizeState.set({
          ...state,
          isResizing: false,
        });

        this.ngZone.run(() => {
          this.sizeChangeEnd.emit({...sizeData});
        });
      }),
      takeUntil(this.destroy$),
    ).subscribe();
  }

  private extractSizeData(entry: ResizeObserverEntry): SizeData {
    const {width, height} = entry.contentRect;
    const element = this.elementRef.nativeElement;

    return {
      width: Math.round(element.offsetWidth),
      height: Math.round(element.offsetHeight),
      contentWidth: Math.round(width),
      contentHeight: Math.round(height),
    };
  }

  private hasSignificantResize(newSize: SizeData): boolean {
    const lastSize = this.lastSize();
    if (!lastSize) {
      return true;
    }

    const threshold = this.threshold();
    const widthDiff = Math.abs(lastSize.width - newSize.width);
    const heightDiff = Math.abs(lastSize.height - newSize.height);
    const contentWidthDiff = Math.abs(lastSize.contentWidth - newSize.contentWidth);
    const contentHeightDiff = Math.abs(lastSize.contentHeight - newSize.contentHeight);

    return (
      widthDiff >= threshold ||
      heightDiff >= threshold ||
      contentWidthDiff >= threshold ||
      contentHeightDiff >= threshold
    );
  }

  private emitSizeChange(sizeData: SizeData): void {
    this.lastSize.set({...sizeData});
    this.ngZone.run(() => {
      this.sizeChange.emit(sizeData);
    });
  }

  private cleanup(): void {
    // 触发destroy流
    this.destroy$.next();
    this.destroy$.complete();

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    // 完成所有subjects
    this.resizeEntries$.complete();
    this.forceCheck$.complete();

    // 重置信号状态
    this.lastSize.set(null);
    this.resizeState.set({
      isResizing: false,
      startTime: 0,
      changeCount: 0,
    });
  }

  // 公共方法
  getCurrentSize(): SizeData | null {
    if (!this.elementRef.nativeElement) {
      return null;
    }

    const element = this.elementRef.nativeElement;
    const rect = element.getBoundingClientRect();

    return {
      width: Math.round(element.offsetWidth),
      height: Math.round(element.offsetHeight),
      contentWidth: Math.round(rect.width),
      contentHeight: Math.round(rect.height),
    };
  }

  /**
   * 强制检查当前元素的大小变化
   */
  forceCheck(): void {
    this.lastSize.set(null); // 强制触发变化
    this.forceCheck$.next();
  }

  /**
   * 获取当前的调整大小状态和统计信息
   */
  getResizeStats() {
    return {
      currentState: this.resizeState(),
      lastSize: this.lastSize(),
      hasSize: this.hasSize(),
    };
  }

  // 重置统计信息
  resetStats(): void {
    this.resizeState.set({
      isResizing: false,
      startTime: 0,
      changeCount: 0,
    });
  }
}
