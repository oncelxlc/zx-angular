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
  OnInit,
  output,
  signal,
  WritableSignal,
} from "@angular/core";
import { ResizeState, SizeData } from "./resize-observer.type";

@Directive({
  selector: "[zxResizeObserver]",
})
export class ResizeObserverDirective implements OnInit {// 16 9
  // 宽度和高度变化事件
  readonly sizeChange = output<SizeData>();
  // 开始和结束调整大小事件
  readonly sizeChangeStart = output<SizeData>();
  readonly sizeChangeEnd = output<SizeData>();
  // 调整大小状态变化事件
  readonly resizeStateChange = output<ResizeState>();

  // 防抖设置, 默认16ms
  debounceTime = input<number, number | string>(16, {transform: numberAttribute});
  // 是否启用防抖, 默认启用
  enableDebounce = input<boolean, boolean | null>(true, {transform: booleanAttribute});
  // 是否在Angular外部运行
  runOutsideAngular = input<boolean, boolean | null>(true, {transform: booleanAttribute});
  // 尺寸变化阈值，单位为像素
  threshold = input<number, number | string>(1, {transform: numberAttribute});
  // 是否启用日志记录
  enableLogging = input<boolean, boolean | null>(false, {transform: booleanAttribute});

  // 依赖注入
  private elementRef = inject(ElementRef<HTMLElement>);
  private destroyRef = inject(DestroyRef);
  private ngZone = inject(NgZone);

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

  private resizeObserver: ResizeObserver | null = null;
  private debounceTimer: number | null = null;
  private endTimer: number | null = null;
  private rafId: number | null = null;

  constructor() {
    // 监听配置变化
    effect(() => {
      if (this.enableLogging()) {
        console.log("ResizeObserver配置更新:", {
          debounceTime: this.debounceTime(),
          enableDebounce: this.enableDebounce(),
          threshold: this.threshold(),
          runOutsideAngular: this.runOutsideAngular(),
        });
      }
    });
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
    this.initResizeObserver();
  }

  private initResizeObserver(): void {
    const observerCallback = (entries: ResizeObserverEntry[]) => {
      if (this.runOutsideAngular()) {
        this.ngZone.runOutsideAngular(() => {
          this.handleResize(entries);
        });
      } else {
        this.handleResize(entries);
      }
    };

    this.resizeObserver = new ResizeObserver(observerCallback);
    this.resizeObserver.observe(this.elementRef.nativeElement);

    if (this.enableLogging()) {
      console.log("ResizeObserver 已初始化");
    }
  }

  private handleResize(entries: ResizeObserverEntry[]): void {
    if (entries.length === 0) {
      return;
    }
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    this.rafId = requestAnimationFrame(() => {
      const entry = entries[0];
      const newSize = this.extractSizeData(entry);

      if (this.hasSignificantResize(newSize)) {
        this.handleSizeChange(newSize);
      }
    });
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

  private handleSizeChange(sizeData: SizeData): void {
    const currentState = this.resizeState();

    // 触发开始事件
    if (!currentState.isResizing) {
      const newState: ResizeState = {
        isResizing: true,
        startTime: Date.now(),
        changeCount: 0,
      };
      this.resizeState.set(newState);

      this.ngZone.run(() => {
        this.sizeChangeStart.emit({...sizeData});
      });

      if (this.enableLogging()) {
        console.log("开始调整大小");
      }
    }

    // 更新变化计数
    this.resizeState.update(state => ({
      ...state,
      changeCount: state.changeCount + 1,
    }));

    // 主要的尺寸变化事件
    if (this.enableDebounce() && this.debounceTime() > 0) {
      this.debounceEmit(sizeData);
    } else {
      this.emitSizeChange(sizeData);
    }

    // 设置结束计时器
    this.scheduleEndEvent(sizeData);
  }

  private debounceEmit(sizeData: SizeData): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = window.setTimeout(() => {
      this.emitSizeChange(sizeData);
      this.debounceTimer = null;
    }, this.debounceTime());
  }

  private scheduleEndEvent(sizeData: SizeData): void {
    if (this.endTimer) {
      clearTimeout(this.endTimer);
    }

    this.endTimer = window.setTimeout(() => {
      const state = this.resizeState();
      this.resizeState.set({
        ...state,
        isResizing: false,
      });

      this.ngZone.run(() => {
        this.sizeChangeEnd.emit({...sizeData});
      });

      if (this.enableLogging()) {
        console.log("结束调整大小，总变化次数:", state.changeCount);
      }

      this.endTimer = null;
    }, this.debounceTime() + 100);
  }

  private emitSizeChange(sizeData: SizeData): void {
    this.lastSize.set({...sizeData});

    this.ngZone.run(() => {
      this.sizeChange.emit(sizeData);
    });

    if (this.enableLogging()) {
      console.log("尺寸变化:", sizeData);
    }
  }

  private cleanup(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }

    if (this.endTimer) {
      clearTimeout(this.endTimer);
      this.endTimer = null;
    }

    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    // 重置信号状态
    this.lastSize.set(null);
    this.resizeState.set({
      isResizing: false,
      startTime: 0,
      changeCount: 0,
    });

    if (this.enableLogging()) {
      console.log("ResizeObserver 已清理");
    }
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
    const currentSize = this.getCurrentSize();
    if (currentSize) {
      this.lastSize.set(null); // 强制触发变化
      this.handleSizeChange(currentSize);
    }
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
