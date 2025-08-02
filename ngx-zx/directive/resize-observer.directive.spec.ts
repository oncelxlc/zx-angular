import { ComponentFixture, TestBed, fakeAsync, tick, flush } from "@angular/core/testing";
import { Component, DebugElement, NgZone } from "@angular/core";
import { By } from "@angular/platform-browser";
import { ResizeObserverDirective } from "./resize-observer.directive";
import { ResizeState, SizeData } from "./resize-observer.type";

// Mock ResizeObserver
class MockResizeObserver {
  private callback: ResizeObserverCallback;
  private entries: ResizeObserverEntry[] = [];

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }

  observe(target: Element) {
    // 模拟初始观察
  }

  unobserve(target: Element) {
    // 模拟取消观察
  }

  disconnect() {
    // 模拟断开连接
  }

  // 测试辅助方法：触发回调
  triggerResize(entries: ResizeObserverEntry[]) {
    this.entries = entries;
    this.callback(entries, this);
  }
}

// 全局mock ResizeObserver
(window as any).ResizeObserver = MockResizeObserver;

// 测试组件
@Component({
  imports: [
    ResizeObserverDirective
  ],
  template: `
    <div
      #testElement
      zxResizeObserver
      [debounceTime]="debounceTime"
      [enableDebounce]="enableDebounce"
      [runOutsideAngular]="runOutsideAngular"
      [threshold]="threshold"
      [enableLogging]="enableLogging"
      (sizeChange)="onSizeChange($event)"
      (sizeChangeStart)="onSizeChangeStart($event)"
      (sizeChangeEnd)="onSizeChangeEnd($event)"
      (resizeStateChange)="onResizeStateChange($event)"
      style="width: 100px; height: 100px;">
      Test Element
    </div>
  `
})
class TestComponent {
  debounceTime = 16;
  enableDebounce = true;
  runOutsideAngular = true;
  threshold = 1;
  enableLogging = false;

  sizeChangeEvents: SizeData[] = [];
  sizeChangeStartEvents: SizeData[] = [];
  sizeChangeEndEvents: SizeData[] = [];
  resizeStateChangeEvents: ResizeState[] = [];

  onSizeChange(event: SizeData) {
    this.sizeChangeEvents.push(event);
  }

  onSizeChangeStart(event: SizeData) {
    this.sizeChangeStartEvents.push(event);
  }

  onSizeChangeEnd(event: SizeData) {
    this.sizeChangeEndEvents.push(event);
  }

  onResizeStateChange(event: ResizeState) {
    this.resizeStateChangeEvents.push(event);
  }
}

describe("ResizeObserverDirective", () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let directive: ResizeObserverDirective;
  let debugElement: DebugElement;
  let mockResizeObserver: MockResizeObserver;

  // 创建模拟的ResizeObserverEntry
  const createMockEntry = (width: number, height: number): ResizeObserverEntry => {
    const element = fixture.debugElement.nativeElement.querySelector("div");

    // Mock offsetWidth and offsetHeight
    Object.defineProperty(element, "offsetWidth", {
      value: width,
      configurable: true
    });
    Object.defineProperty(element, "offsetHeight", {
      value: height,
      configurable: true
    });

    return {
      target: element,
      contentRect: {
        width,
        height,
        top: 0,
        left: 0,
        bottom: height,
        right: width,
        x: 0,
        y: 0,
        toJSON: () => ({})
      },
      borderBoxSize: [],
      contentBoxSize: [],
      devicePixelContentBoxSize: []
    } as ResizeObserverEntry;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestComponent, ResizeObserverDirective],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement.query(By.directive(ResizeObserverDirective));
    directive = debugElement.injector.get(ResizeObserverDirective);

    fixture.detectChanges();

    // 获取创建的 MockResizeObserver 实例
    mockResizeObserver = (directive as any).resizeObserver as MockResizeObserver;
  });

  afterEach(() => {
    fixture.destroy();
  });

  describe("初始化", () => {
    it("应该创建指令", () => {
      expect(directive).toBeTruthy();
    });

    it("应该初始化ResizeObserver", () => {
      expect((directive as any).resizeObserver).toBeInstanceOf(MockResizeObserver);
    });

    it("应该设置默认配置值", () => {
      expect(directive.debounceTime()).toBe(16);
      expect(directive.enableDebounce()).toBe(true);
      expect(directive.runOutsideAngular()).toBe(true);
      expect(directive.threshold()).toBe(1);
      expect(directive.enableLogging()).toBe(false);
    });

    it("应该正确计算初始状态", () => {
      expect(directive.hasSize()).toBe(false);
      expect(directive.currentResizeState().isResizing).toBe(false);
    });
  });

  describe("配置变化", () => {
    it("应该响应debounceTime变化", () => {
      component.debounceTime = 50;
      fixture.detectChanges();
      expect(directive.debounceTime()).toBe(50);
    });

    it("应该响应enableDebounce变化", () => {
      component.enableDebounce = false;
      fixture.detectChanges();
      expect(directive.enableDebounce()).toBe(false);
    });

    it("应该响应threshold变化", () => {
      component.threshold = 5;
      fixture.detectChanges();
      expect(directive.threshold()).toBe(5);
    });

    it("应该响应enableLogging变化", () => {
      component.enableLogging = true;
      fixture.detectChanges();
      expect(directive.enableLogging()).toBe(true);
    });
  });

  describe("尺寸变化检测", () => {
    it("应该检测到初始尺寸变化", fakeAsync(() => {
      const mockEntry = createMockEntry(200, 150);

      mockResizeObserver.triggerResize([mockEntry]);
      tick(100); // 等待 requestAnimationFrame 和 debounce

      expect(component.sizeChangeStartEvents.length).toBe(1);
      expect(component.sizeChangeEvents.length).toBe(1);
      expect(component.sizeChangeEvents[0]).toEqual({
        width: 200,
        height: 150,
        contentWidth: 200,
        contentHeight: 150
      });
    }));

    it("应该检测显著的尺寸变化", fakeAsync(() => {
      // 第一次变化
      const mockEntry1 = createMockEntry(200, 150);
      mockResizeObserver.triggerResize([mockEntry1]);
      tick(100);

      // 第二次变化（超过阈值）
      const mockEntry2 = createMockEntry(205, 155);
      mockResizeObserver.triggerResize([mockEntry2]);
      tick(100);

      expect(component.sizeChangeEvents.length).toBe(2);
    }));

    it("应该忽略不显著的尺寸变化", fakeAsync(() => {
      component.threshold = 5;
      fixture.detectChanges();

      // 第一次变化
      const mockEntry1 = createMockEntry(200, 150);
      mockResizeObserver.triggerResize([mockEntry1]);
      tick(100);

      // 第二次变化（未超过阈值）
      const mockEntry2 = createMockEntry(202, 152);
      mockResizeObserver.triggerResize([mockEntry2]);
      tick(100);

      expect(component.sizeChangeEvents.length).toBe(1);
    }));
  });

  describe("防抖功能", () => {
    it("应该在启用防抖时延迟发射事件", fakeAsync(() => {
      component.debounceTime = 100;
      component.enableDebounce = true;
      fixture.detectChanges();

      const mockEntry = createMockEntry(200, 150);
      mockResizeObserver.triggerResize([mockEntry]);

      // 立即检查 - 应该没有sizeChange事件
      tick(50);
      expect(component.sizeChangeEvents.length).toBe(0);
      expect(component.sizeChangeStartEvents.length).toBe(1); // start事件不防抖

      // 等待防抖时间
      tick(100);
      expect(component.sizeChangeEvents.length).toBe(1);
    }));

    it("应该在禁用防抖时立即发射事件", fakeAsync(() => {
      component.enableDebounce = false;
      fixture.detectChanges();

      const mockEntry = createMockEntry(200, 150);
      mockResizeObserver.triggerResize([mockEntry]);
      tick(20);

      expect(component.sizeChangeEvents.length).toBe(1);
    }));

    it("应该在快速连续变化时合并防抖事件", fakeAsync(() => {
      component.debounceTime = 100;
      fixture.detectChanges();

      // 快速连续触发多次变化
      const mockEntry1 = createMockEntry(200, 150);
      const mockEntry2 = createMockEntry(210, 160);
      const mockEntry3 = createMockEntry(220, 170);

      mockResizeObserver.triggerResize([mockEntry1]);
      tick(50);
      mockResizeObserver.triggerResize([mockEntry2]);
      tick(50);
      mockResizeObserver.triggerResize([mockEntry3]);
      tick(50);

      // 此时应该只有start事件
      expect(component.sizeChangeEvents.length).toBe(0);
      expect(component.sizeChangeStartEvents.length).toBe(1);

      // 等待防抖完成
      tick(100);
      expect(component.sizeChangeEvents.length).toBe(1);
      expect(component.sizeChangeEvents[0].width).toBe(220);
    }));
  });

  describe("调整大小状态", () => {
    it("应该正确跟踪调整大小状态", fakeAsync(() => {
      const mockEntry = createMockEntry(200, 150);
      mockResizeObserver.triggerResize([mockEntry]);
      tick(50);

      // 应该进入调整状态
      expect(directive.currentResizeState().isResizing).toBe(true);
      expect(directive.currentResizeState().changeCount).toBe(1);

      // 等待结束
      tick(200);
      expect(directive.currentResizeState().isResizing).toBe(false);
    }));

    it("应该计算正确的变化次数", fakeAsync(() => {
      const mockEntry1 = createMockEntry(200, 150);
      const mockEntry2 = createMockEntry(210, 160);
      const mockEntry3 = createMockEntry(220, 170);

      mockResizeObserver.triggerResize([mockEntry1]);
      tick(20);
      mockResizeObserver.triggerResize([mockEntry2]);
      tick(20);
      mockResizeObserver.triggerResize([mockEntry3]);
      tick(20);

      expect(directive.currentResizeState().changeCount).toBe(3);
    }));

    it("应该发射状态变化事件", fakeAsync(() => {
      const mockEntry = createMockEntry(200, 150);
      mockResizeObserver.triggerResize([mockEntry]);
      tick(200);

      expect(component.resizeStateChangeEvents.length).toBeGreaterThan(0);
      expect(component.resizeStateChangeEvents.some(e => e.isResizing)).toBe(true);
      expect(component.resizeStateChangeEvents.some(e => !e.isResizing)).toBe(true);
    }));
  });

  describe("开始和结束事件", () => {
    it("应该发射开始和结束事件", fakeAsync(() => {
      const mockEntry = createMockEntry(200, 150);
      mockResizeObserver.triggerResize([mockEntry]);
      tick(200);

      expect(component.sizeChangeStartEvents.length).toBe(1);
      expect(component.sizeChangeEndEvents.length).toBe(1);
    }));

    it("多次变化应该只触发一次开始事件", fakeAsync(() => {
      const mockEntry1 = createMockEntry(200, 150);
      const mockEntry2 = createMockEntry(210, 160);

      mockResizeObserver.triggerResize([mockEntry1]);
      tick(20);
      mockResizeObserver.triggerResize([mockEntry2]);
      tick(200);

      expect(component.sizeChangeStartEvents.length).toBe(1);
      expect(component.sizeChangeEndEvents.length).toBe(1);
    }));
  });

  describe("公共方法", () => {
    it("getCurrentSize应该返回当前尺寸", () => {
      const element = fixture.debugElement.nativeElement.querySelector("div");
      Object.defineProperty(element, "offsetWidth", {value: 300, configurable: true});
      Object.defineProperty(element, "offsetHeight", {value: 200, configurable: true});

      spyOn(element, "getBoundingClientRect").and.returnValue({
        width: 300,
        height: 200,
        top: 0,
        left: 0,
        bottom: 200,
        right: 300,
        x: 0,
        y: 0
      } as DOMRect);

      const size = directive.getCurrentSize();
      expect(size).toEqual({
        width: 300,
        height: 200,
        contentWidth: 300,
        contentHeight: 200
      });
    });

    it("forceCheck应该强制检查尺寸变化", fakeAsync(() => {
      const element = fixture.debugElement.nativeElement.querySelector("div");
      Object.defineProperty(element, "offsetWidth", {value: 250, configurable: true});
      Object.defineProperty(element, "offsetHeight", {value: 180, configurable: true});

      spyOn(element, "getBoundingClientRect").and.returnValue({
        width: 250,
        height: 180,
        top: 0,
        left: 0,
        bottom: 180,
        right: 250,
        x: 0,
        y: 0
      } as DOMRect);

      directive.forceCheck();
      tick(100);

      expect(component.sizeChangeEvents.length).toBe(1);
      expect(component.sizeChangeEvents[0].width).toBe(250);
    }));

    it("getResizeStats应该返回当前统计信息", () => {
      const stats = directive.getResizeStats();
      expect(stats).toEqual({
        currentState: directive.currentResizeState(),
        lastSize: null,
        hasSize: false
      });
    });

    it("resetStats应该重置统计信息", fakeAsync(() => {
      // 先触发一些变化
      const mockEntry = createMockEntry(200, 150);
      mockResizeObserver.triggerResize([mockEntry]);
      tick(50);

      expect(directive.currentResizeState().changeCount).toBeGreaterThan(0);

      // 重置统计
      directive.resetStats();
      expect(directive.currentResizeState()).toEqual({
        isResizing: false,
        startTime: 0,
        changeCount: 0
      });
    }));
  });

  describe("清理功能", () => {
    it("应该在组件销毁时清理资源", () => {
      const disconnectSpy = spyOn(mockResizeObserver, "disconnect");

      fixture.destroy();

      expect(disconnectSpy).toHaveBeenCalled();
    });

    it("应该清理所有计时器", fakeAsync(() => {
      const mockEntry = createMockEntry(200, 150);
      mockResizeObserver.triggerResize([mockEntry]);

      // 销毁组件
      fixture.destroy();

      // 等待一段时间确保没有遗留的计时器触发
      tick(1000);
      flush();

      // 如果清理正确，这里不应该有任何错误
      expect(true).toBe(true);
    }));
  });

  describe("NgZone集成", () => {
    it("应该在runOutsideAngular为true时在Angular外部运行", () => {
      const ngZone = TestBed.inject(NgZone);
      spyOn(ngZone, "runOutsideAngular").and.callThrough();

      component.runOutsideAngular = true;
      fixture.detectChanges();

      const mockEntry = createMockEntry(200, 150);
      mockResizeObserver.triggerResize([mockEntry]);

      expect(ngZone.runOutsideAngular).toHaveBeenCalled();
    });

    it("应该在runOutsideAngular为false时在Angular内部运行", () => {
      const ngZone = TestBed.inject(NgZone);
      spyOn(ngZone, "runOutsideAngular");

      component.runOutsideAngular = false;
      fixture.detectChanges();

      const mockEntry = createMockEntry(200, 150);
      mockResizeObserver.triggerResize([mockEntry]);

      expect(ngZone.runOutsideAngular).not.toHaveBeenCalled();
    });
  });

  describe("日志功能", () => {
    it("应该在启用日志时输出日志", () => {
      spyOn(console, "log");

      component.enableLogging = true;
      fixture.detectChanges();

      expect(console.log).toHaveBeenCalledWith("ResizeObserver配置更新:", jasmine.objectContaining({
        debounceTime: jasmine.any(Number),
        enableDebounce: jasmine.any(Boolean),
        threshold: jasmine.any(Number),
        runOutsideAngular: jasmine.any(Boolean)
      }));
    });

    it("应该在禁用日志时不输出日志", fakeAsync(() => {
      spyOn(console, "log");

      component.enableLogging = false;
      fixture.detectChanges();

      // 重置调用计数
      (console.log as jasmine.Spy).calls.reset();

      const mockEntry = createMockEntry(200, 150);
      mockResizeObserver.triggerResize([mockEntry]);
      tick(100);

      // 检查是否没有调用过尺寸变化的日志
      const logCalls = (console.log as jasmine.Spy).calls.all();
      const sizeChangeLogExists = logCalls.some(call =>
        call.args[0] === "尺寸变化:" ||
        call.args[0] === "开始调整大小" ||
        call.args[0].includes("结束调整大小")
      );
      expect(sizeChangeLogExists).toBe(false);
    }));
  });

  describe("边界情况", () => {
    it("应该处理空的ResizeObserverEntry数组", () => {
      expect(() => {
        mockResizeObserver.triggerResize([]);
      }).not.toThrow();
    });

    it("应该处理element为null的情况", () => {
      // 模拟element为null
      spyOn(directive, "getCurrentSize").and.returnValue(null);

      expect(() => {
        directive.forceCheck();
      }).not.toThrow();
    });

    it("应该处理负数尺寸", fakeAsync(() => {
      const element = fixture.debugElement.nativeElement.querySelector("div");
      Object.defineProperty(element, "offsetWidth", {value: -10, configurable: true});
      Object.defineProperty(element, "offsetHeight", {value: -10, configurable: true});

      const mockEntry = {
        target: element,
        contentRect: {width: -10, height: -10}
      } as ResizeObserverEntry;

      expect(() => {
        mockResizeObserver.triggerResize([mockEntry]);
        tick(100);
      }).not.toThrow();
    }));
  });
});
