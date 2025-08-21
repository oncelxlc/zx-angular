import { Component, DebugElement, ElementRef, NgZone } from "@angular/core";
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { ResizeObserverDirective } from "./resize-observer.directive";
import { ResizeState, SizeData } from "./resize-observer.type";

// 模拟 ResizeObserver
class MockResizeObserver {
  private readonly callback: ResizeObserverCallback;
  private observedElements: Set<Element> = new Set<Element>();

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }

  observe(target: Element): void {
    this.observedElements.add(target);
  }

  unobserve(target: Element): void {
    this.observedElements.delete(target);
  }

  disconnect(): void {
    this.observedElements.clear();
  }

  // 测试辅助方法
  triggerResize(entries: ResizeObserverEntry[]): void {
    this.callback(entries, this);
  }

  getObservedElements(): Element[] {
    return Array.from(this.observedElements);
  }
}

// 创建模拟的 ResizeObserverEntry
function createMockEntry(
  element: Element,
  contentRect: { width: number; height: number },
): ResizeObserverEntry {
  const mockContentRect: DOMRectReadOnly = {
    width: contentRect.width,
    height: contentRect.height,
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    bottom: contentRect.height,
    right: contentRect.width,
    toJSON: () => ({
      width: contentRect.width,
      height: contentRect.height,
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      bottom: contentRect.height,
      right: contentRect.width,
    }),
  };

  return {
    target: element,
    contentRect: mockContentRect,
    borderBoxSize: [],
    contentBoxSize: [],
    devicePixelContentBoxSize: [],
  };
}

// 模拟 HTMLElement 接口扩展
interface MockHTMLElement extends HTMLElement {
  offsetWidth: number;
  offsetHeight: number;
}

// 测试组件
@Component({
  imports: [
    ResizeObserverDirective,
  ],
  template: `
    <div
      #testElement
      zxResizeObserver
      [debounceTime]="debounceTime"
      [runOutsideAngular]="runOutsideAngular"
      [threshold]="threshold"
      (sizeChange)="onSizeChange($event)"
      (sizeChangeStart)="onSizeChangeStart($event)"
      (sizeChangeEnd)="onSizeChangeEnd($event)"
      (resizeStateChange)="onResizeStateChange($event)"
      style="width: 100px; height: 100px;">
      Test Content
    </div>
  `,
})
class TestComponent {
  debounceTime = 16;
  enableDebounce = true;
  runOutsideAngular = true;
  threshold = 1;
  enableLogging = false;

  sizeChanges: SizeData[] = [];
  sizeChangeStarts: SizeData[] = [];
  sizeChangeEnds: SizeData[] = [];
  resizeStateChanges: ResizeState[] = [];

  onSizeChange(data: SizeData): void {
    this.sizeChanges.push(data);

  }

  onSizeChangeStart(data: SizeData): void {
    this.sizeChangeStarts.push(data);
  }

  onSizeChangeEnd(data: SizeData): void {
    this.sizeChangeEnds.push(data);
  }

  onResizeStateChange(state: ResizeState): void {
    this.resizeStateChanges.push({...state});
  }
}

describe("ResizeObserverDirective", () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let directive: ResizeObserverDirective;
  let debugElement: DebugElement;
  let mockResizeObserver: MockResizeObserver;
  let originalResizeObserver: typeof ResizeObserver | undefined;

  beforeEach(async () => {
    // 保存原始的 ResizeObserver
    originalResizeObserver = window.ResizeObserver;

    // 模拟 ResizeObserver 构造函数
    window.ResizeObserver = function (this: ResizeObserver, callback: ResizeObserverCallback) {
      mockResizeObserver = new MockResizeObserver(callback);
      return mockResizeObserver as unknown as ResizeObserver;
    } as unknown as typeof ResizeObserver;

    await TestBed.configureTestingModule({
      imports: [TestComponent, ResizeObserverDirective],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement.query(By.directive(ResizeObserverDirective));
    directive = debugElement.injector.get(ResizeObserverDirective);

    // 安全地模拟元素属性
    const element = debugElement.nativeElement as MockHTMLElement;
    Object.defineProperty(element, "offsetWidth", {
      value: 100,
      configurable: true,
      writable: true,
    });
    Object.defineProperty(element, "offsetHeight", {
      value: 100,
      configurable: true,
      writable: true,
    });

    fixture.detectChanges();
  });

  afterEach(() => {
    // 恢复原始的 ResizeObserver
    if (originalResizeObserver) {
      window.ResizeObserver = originalResizeObserver;
    }
    fixture.destroy();
  });

  describe("初始化", () => {
    it("应该创建指令实例", () => {
      expect(directive).toBeTruthy();
    });

    it("应该创建并观察元素", () => {
      expect(mockResizeObserver).toBeTruthy();
      expect(mockResizeObserver.getObservedElements()).toContain(debugElement.nativeElement);
    });

    it("应该设置默认输入属性", () => {
      expect(directive.debounceTime()).toBe(16);
      expect(directive.runOutsideAngular()).toBe(true);
      expect(directive.threshold()).toBe(1);
    });
  });

  describe("输入属性", () => {
    it("应该更新防抖时间", () => {
      component.debounceTime = 100;
      fixture.detectChanges();
      expect(directive.debounceTime()).toBe(100);
    });

    it("应该更新启用防抖设置", () => {
      component.enableDebounce = false;
      fixture.detectChanges();
    });

    it("应该更新阈值设置", () => {
      component.threshold = 5;
      fixture.detectChanges();
      expect(directive.threshold()).toBe(5);
    });

    it("应该更新日志记录设置", () => {
      component.enableLogging = true;
      fixture.detectChanges();
    });
  });

  describe("尺寸变化检测", () => {
    it("应该检测到尺寸变化并发出事件", fakeAsync(() => {
      // 模拟尺寸变化
      const element = debugElement.nativeElement as MockHTMLElement;
      Object.defineProperty(element, "offsetWidth", {
        value: 200,
        configurable: true,
        writable: true,
      });
      Object.defineProperty(element, "offsetHeight", {
        value: 150,
        configurable: true,
        writable: true,
      });

      const entry = createMockEntry(debugElement.nativeElement, {
        width: 200,
        height: 150,
      });

      mockResizeObserver.triggerResize([entry]);
      tick(); // 处理 requestAnimationFrame
      tick(16); // 处理防抖
      flush();

      expect(component.sizeChanges.length).toBeGreaterThan(0);
      expect(component.sizeChanges[0]).toEqual({
        width: 240,
        height: 150,
        contentWidth: 240,
        contentHeight: 150,
      });
    }));

    it("应该触发开始和结束事件", fakeAsync(() => {
      const entry = createMockEntry(debugElement.nativeElement, {
        width: 280,
        height: 150,
      });

      mockResizeObserver.triggerResize([entry]);
      tick();

      // 应该触发开始事件
      expect(component.sizeChangeStarts.length).toBe(1);
      expect(component.resizeStateChanges.some(s => s.isResizing)).toBe(true);

      tick(200); // 等待结束计时器

      // 应该触发结束事件
      expect(component.sizeChangeEnds.length).toBe(1);
      expect(component.resizeStateChanges.some(s => !s.isResizing)).toBe(true);
    }));

    it("应该遵守阈值设置", fakeAsync(() => {
      component.threshold = 10;
      fixture.detectChanges();

      // 小于阈值的变化
      const element = debugElement.nativeElement as MockHTMLElement;
      Object.defineProperty(element, "offsetWidth", {
        value: 105,
        configurable: true,
        writable: true,
      });

      const entry = createMockEntry(debugElement.nativeElement, {
        width: 105,
        height: 100,
      });

      mockResizeObserver.triggerResize([entry]);
      tick();
      tick(16);
      flush();

      expect(component.sizeChanges.length).toBe(0);
    }));

    it("应该在禁用防抖时立即发出事件", fakeAsync(() => {
      component.enableDebounce = false;
      fixture.detectChanges();

      const entry = createMockEntry(debugElement.nativeElement, {
        width: 320,
        height: 150,
      });

      mockResizeObserver.triggerResize([entry]);
      tick();

      expect(component.sizeChanges.length).toBeGreaterThan(0);
    }));
  });

  describe("计算属性", () => {
    it("应该正确计算 hasSize", () => {
      expect(directive.hasSize()).toBe(false);

      // 触发尺寸变化
      const entry = createMockEntry(debugElement.nativeElement, {
        width: 360,
        height: 150,
      });
      mockResizeObserver.triggerResize([entry]);
      expect(directive.hasSize()).toBe(true);
    });

    it("应该正确返回当前调整大小状态", () => {
      const initialState = directive.currentResizeState();
      expect(initialState.isResizing).toBe(false);
      expect(initialState.changeCount).toBe(0);
    });
  });

  describe("公共方法", () => {
    it("应该返回当前尺寸", () => {
      const element = debugElement.nativeElement as MockHTMLElement;
      Object.defineProperty(element, "offsetWidth", {
        value: 150,
        configurable: true,
        writable: true,
      });
      Object.defineProperty(element, "offsetHeight", {
        value: 120,
        configurable: true,
        writable: true,
      });

      // 模拟 getBoundingClientRect
      const mockRect: DOMRect = {
        width: 150,
        height: 120,
        x: 0,
        y: 0,
        top: 0,
        left: 0,
        bottom: 120,
        right: 150,
        toJSON: () => ({
          width: 150,
          height: 120,
          x: 0,
          y: 0,
          top: 0,
          left: 0,
          bottom: 120,
          right: 150,
        }),
      };

      spyOn(element, "getBoundingClientRect").and.returnValue(mockRect);

      const currentSize = directive.getCurrentSize();
      expect(currentSize).toEqual({
        width: 400,
        height: 120,
        contentWidth: 400,
        contentHeight: 120,
      });
    });

    it("应该强制检查尺寸变化", fakeAsync(() => {
      const element = debugElement.nativeElement as MockHTMLElement;
      Object.defineProperty(element, "offsetWidth", {
        value: 180,
        configurable: true,
        writable: true,
      });
      Object.defineProperty(element, "offsetHeight", {
        value: 140,
        configurable: true,
        writable: true,
      });

      const mockRect: DOMRect = {
        width: 180,
        height: 140,
        x: 0,
        y: 0,
        top: 0,
        left: 0,
        bottom: 140,
        right: 180,
        toJSON: () => ({
          width: 180,
          height: 140,
          x: 0,
          y: 0,
          top: 0,
          left: 0,
          bottom: 140,
          right: 180,
        }),
      };

      spyOn(element, "getBoundingClientRect").and.returnValue(mockRect);

      directive.forceCheck();
      tick();
      tick(16);
      flush();

      expect(component.sizeChanges.length).toBeGreaterThan(0);
    }));

    it("应该返回调整大小统计信息", () => {
      const stats = directive.getResizeStats();
      expect(stats).toBeDefined();
      expect(stats.currentState).toBeDefined();
      expect(stats.lastSize).toBeDefined();
      expect(stats.hasSize).toBeDefined();
      expect(typeof stats.hasSize).toBe("boolean");
    });

    it("应该重置统计信息", () => {
      directive.resetStats();
      const stats = directive.getResizeStats();
      expect(stats.currentState.isResizing).toBe(false);
      expect(stats.currentState.changeCount).toBe(0);
      expect(stats.currentState.startTime).toBe(0);
    });
  });

  describe("内存清理", () => {
    it("应该在销毁时清理资源", () => {
      spyOn(mockResizeObserver, "disconnect").and.callThrough();

      fixture.destroy();

      expect(mockResizeObserver.disconnect).toHaveBeenCalled();
    });

    it("应该清理定时器", fakeAsync(() => {
      // 触发一个需要防抖的变化
      const entry = createMockEntry(debugElement.nativeElement, {
        width: 440,
        height: 150,
      });

      mockResizeObserver.triggerResize([entry]);

      // 在防抖完成前销毁
      fixture.destroy();

      // 确保没有未处理的定时器
      expect(() => flush()).not.toThrow();
    }));
  });

  describe("NgZone 集成", () => {
    it("应该根据 runOutsideAngular 设置运行", () => {
      const ngZone = TestBed.inject(NgZone);
      spyOn(ngZone, "runOutsideAngular").and.callThrough();

      component.runOutsideAngular = true;
      fixture.detectChanges();

      const entry = createMockEntry(debugElement.nativeElement, {
        width: 480,
        height: 150,
      });

      mockResizeObserver.triggerResize([entry]);

      expect(ngZone.runOutsideAngular).toHaveBeenCalled();
    });

    it("应该在发出事件时进入 Angular 区域", fakeAsync(() => {
      const ngZone = TestBed.inject(NgZone);
      spyOn(ngZone, "run").and.callThrough();

      const entry = createMockEntry(debugElement.nativeElement, {
        width: 520,
        height: 150,
      });

      mockResizeObserver.triggerResize([entry]);
      tick();
      tick(16);

      expect(ngZone.run).toHaveBeenCalled();
    }));
  });

  describe("错误处理", () => {
    it("应该处理空的 ResizeObserverEntry 数组", () => {
      expect(() => {
        mockResizeObserver.triggerResize([]);
      }).not.toThrow();
    });

    it("应该处理无效的元素引用", () => {
      // 创建测试用的 ElementRef
      const nullElementRef: ElementRef<HTMLElement> = {
        nativeElement: null as unknown as HTMLElement,
      };

      // 创建新的指令实例并设置无效的 elementRef
      const testDirective = Object.create(ResizeObserverDirective.prototype);
      testDirective.elementRef = nullElementRef;

      const currentSize = testDirective.getCurrentSize();
      expect(currentSize).toBeNull();
    });
  });

  describe("日志记录", () => {
    let consoleSpy: jasmine.Spy;

    beforeEach(() => {
      consoleSpy = spyOn(console, "log");
    });

    it("应该在启用日志时记录配置更新", () => {
      component.enableLogging = true;
      fixture.detectChanges();

      expect(consoleSpy).toHaveBeenCalledWith(
        "ResizeObserver配置更新:",
        jasmine.objectContaining({
          debounceTime: jasmine.any(Number),
          enableDebounce: jasmine.any(Boolean),
          threshold: jasmine.any(Number),
          runOutsideAngular: jasmine.any(Boolean),
        }),
      );
    });

    it("应该在启用日志时记录调整大小事件", fakeAsync(() => {
      component.enableLogging = true;
      fixture.detectChanges();

      const entry = createMockEntry(debugElement.nativeElement, {
        width: 560,
        height: 150,
      });

      mockResizeObserver.triggerResize([entry]);
      tick();
      tick(16);
      tick(200);

      expect(consoleSpy).toHaveBeenCalledWith("开始调整大小");
      expect(consoleSpy).toHaveBeenCalledWith("尺寸变化:", jasmine.objectContaining({
        width: jasmine.any(Number),
        height: jasmine.any(Number),
        contentWidth: jasmine.any(Number),
        contentHeight: jasmine.any(Number),
      }));
      expect(consoleSpy).toHaveBeenCalledWith("结束调整大小，总变化次数:", jasmine.any(Number));
    }));
  });

  describe("防抖功能", () => {
    it("应该在指定时间内防抖多次变化", fakeAsync(() => {
      component.debounceTime = 50;
      component.enableDebounce = true;
      fixture.detectChanges();

      const entry1 = createMockEntry(debugElement.nativeElement, {
        width: 600,
        height: 150,
      });
      const entry2 = createMockEntry(debugElement.nativeElement, {
        width: 640,
        height: 160,
      });

      // 快速触发两次变化
      mockResizeObserver.triggerResize([entry1]);
      tick();
      tick(20); // 在防抖时间内

      mockResizeObserver.triggerResize([entry2]);
      tick();
      tick(50); // 完成防抖

      // 应该只有一次 sizeChange 事件（最后一次）
      expect(component.sizeChanges.length).toBe(1);
    }));

    it("应该在禁用防抖时触发所有变化", fakeAsync(() => {
      component.enableDebounce = false;
      fixture.detectChanges();

      const entry1 = createMockEntry(debugElement.nativeElement, {
        width: 680,
        height: 150,
      });
      const entry2 = createMockEntry(debugElement.nativeElement, {
        width: 720,
        height: 160,
      });

      mockResizeObserver.triggerResize([entry1]);
      tick();
      mockResizeObserver.triggerResize([entry2]);
      tick();

      // 应该有两次 sizeChange 事件
      expect(component.sizeChanges.length).toBe(2);
    }));
  });

  describe("阈值检查", () => {
    it("应该只在变化超过阈值时触发事件", fakeAsync(() => {
      component.threshold = 5;
      fixture.detectChanges();

      // 设置初始尺寸
      const initialEntry = createMockEntry(debugElement.nativeElement, {
        width: 100,
        height: 100,
      });
      mockResizeObserver.triggerResize([initialEntry]);
      tick();
      tick(16);

      // 清空之前的事件
      component.sizeChanges = [];

      // 小于阈值的变化
      const element = debugElement.nativeElement as MockHTMLElement;
      Object.defineProperty(element, "offsetWidth", {
        value: 103,
        configurable: true,
        writable: true,
      });

      const smallChangeEntry = createMockEntry(debugElement.nativeElement, {
        width: 103,
        height: 100,
      });

      mockResizeObserver.triggerResize([smallChangeEntry]);
      tick();
      tick(16);
      flush();

      expect(component.sizeChanges.length).toBe(0);

      // 大于阈值的变化
      Object.defineProperty(element, "offsetWidth", {
        value: 110,
        configurable: true,
        writable: true,
      });

      const largeChangeEntry = createMockEntry(debugElement.nativeElement, {
        width: 110,
        height: 100,
      });

      mockResizeObserver.triggerResize([largeChangeEntry]);
      tick();
      tick(16);
      flush();

      expect(component.sizeChanges.length).toBe(1);
    }));
  });

  describe("边界情况", () => {
    it("应该处理零尺寸元素", fakeAsync(() => {
      const element = debugElement.nativeElement as MockHTMLElement;
      Object.defineProperty(element, "offsetWidth", {
        value: 0,
        configurable: true,
        writable: true,
      });
      Object.defineProperty(element, "offsetHeight", {
        value: 0,
        configurable: true,
        writable: true,
      });

      const entry = createMockEntry(debugElement.nativeElement, {
        width: 0,
        height: 0,
      });

      mockResizeObserver.triggerResize([entry]);
      tick();
      tick(16);
      flush();

      expect(component.sizeChanges.length).toBeGreaterThan(0);
      expect(component.sizeChanges[0].width).toBe(0);
      expect(component.sizeChanges[0].height).toBe(0);
    }));

    it("应该处理负阈值", () => {
      component.threshold = -1;
      fixture.detectChanges();

      // 即使阈值为负，也应该能正常工作
      expect(directive.threshold()).toBe(-1);
    });

    it("应该处理非常大的防抖时间", () => {
      component.debounceTime = 10000;
      fixture.detectChanges();

      expect(directive.debounceTime()).toBe(10000);
    });
  });
});
