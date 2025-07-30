import {
  computed,
  DestroyRef,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  NgZone,
  OnInit,
  output,
  signal
} from "@angular/core";

@Directive({
  selector: "[zxResizeObserver]"
})
export class ResizeObserverDirective implements OnInit {// 使用新的输出API
  // 输出事件
  readonly sizeChange = output<SizeData>();
  readonly sizeChangeStart = output<SizeData>();
  readonly sizeChangeEnd = output<SizeData>();
  readonly resizeStateChange = output<ResizeState>();

  // 输入属性
  debounceTime = input<number>(16);
  enableDebounce = input<boolean>(true);
  runOutsideAngular = input<boolean>(true);
  threshold = input<number>(1);
  enableLogging = input<boolean>(false);

  // 依赖注入
  private elementRef = inject(ElementRef<HTMLElement>);
  private destroyRef = inject(DestroyRef);
  private ngZone = inject(NgZone);

  // 响应式状态
  private lastSize = signal<SizeData | null>(null);
  private resizeState = signal<ResizeState>({
    isResizing: false,
    startTime: 0,
    changeCount: 0
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
          runOutsideAngular: this.runOutsideAngular()
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
    if (!window.ResizeObserver) {
      console.warn("ResizeObserver is not supported in this browser");
      this.fallbackToWindowResize();
      return;
    }

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
      contentHeight: Math.round(height)
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
        changeCount: 0
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
      changeCount: state.changeCount + 1
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
        isResizing: false
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

  private fallbackToWindowResize(): void {
    console.warn("使用 window resize 降级方案");

    const handleWindowResize = () => {
      const currentSize = this.getCurrentSize();
      if (currentSize && this.hasSignificantResize(currentSize)) {
        this.handleSizeChange(currentSize);
      }
    };

    if (this.runOutsideAngular()) {
      this.ngZone.runOutsideAngular(() => {
        window.addEventListener("resize", handleWindowResize);
      });
    } else {
      window.addEventListener("resize", handleWindowResize);
    }

    this.destroyRef.onDestroy(() => {
      window.removeEventListener("resize", handleWindowResize);
    });
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
      changeCount: 0
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
      contentHeight: Math.round(rect.height)
    };
  }

  forceCheck(): void {
    const currentSize = this.getCurrentSize();
    if (currentSize) {
      this.lastSize.set(null); // 强制触发变化
      this.handleSizeChange(currentSize);
    }
  }

  getResizeStats() {
    return {
      currentState: this.resizeState(),
      lastSize: this.lastSize(),
      hasSize: this.hasSize()
    };
  }

  // 重置统计信息
  resetStats(): void {
    this.resizeState.set({
      isResizing: false,
      startTime: 0,
      changeCount: 0
    });
  }
}

export interface SizeData {
  width: number;
  height: number;
  contentWidth: number;
  contentHeight: number;
}

export interface ResizeState {
  isResizing: boolean;
  startTime: number;
  changeCount: number;
}
