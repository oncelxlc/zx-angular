import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HeightObserverDirective } from './height-observer.directive';

@Component({
  template: `
    <div #observed style="height: 100px;">Observed</div>
    <div #target zxHeightObserver [targetElement]="target" [isDocumentHeight]="isDocumentHeight" [fixedHeight]="fixedHeight">Target</div>
  `,
  imports: [HeightObserverDirective],
})
class TestComponent {
  isDocumentHeight = true;
  fixedHeight?: number;
}

describe('HeightObserverDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let targetEl: DebugElement;
  let observedEl: DebugElement;
  let directive: HeightObserverDirective;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    targetEl = fixture.debugElement.query(By.css('[zxHeightObserver]'));
    observedEl = fixture.debugElement.query(By.css('#observed'));
    directive = targetEl.injector.get(HeightObserverDirective);

    // Mock ResizeObserver
    window.ResizeObserver = class {
      observe = jasmine.createSpy('observe');
      unobserve = jasmine.createSpy('unobserve');
      disconnect = jasmine.createSpy('disconnect');
    };

    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should observe document.documentElement and target element', () => {
    expect(window.ResizeObserver.prototype.observe).toHaveBeenCalledWith(document.documentElement);
    expect(window.ResizeObserver.prototype.observe).toHaveBeenCalledWith(targetEl.nativeElement);
  });

  it('should update target height when using document height', fakeAsync(() => {
    // 修复: 使用类型断言来解决 TypeScript 错误
    spyOn<any>(document.documentElement, 'offsetHeight').and.returnValue(500);
    spyOn<any>(observedEl.nativeElement, 'offsetHeight').and.returnValue(100);

    directive.ngOnInit();
    tick(directive.debounceTime + 1);

    expect(targetEl.nativeElement.style.minHeight).toBe('400px');
  }));

  it('should update target height when using fixed height', fakeAsync(() => {
    component.isDocumentHeight = false;
    component.fixedHeight = 300;
    fixture.detectChanges();

    // 修复: 使用类型断言来解决 TypeScript 错误
    spyOn<any>(observedEl.nativeElement, 'offsetHeight').and.returnValue(100);

    directive.ngOnInit();
    tick(directive.debounceTime + 1);

    expect(targetEl.nativeElement.style.minHeight).toBe('200px');
  }));

  it('should not update target height when neither document height nor fixed height is specified', fakeAsync(() => {
    component.isDocumentHeight = false;
    component.fixedHeight = undefined;
    fixture.detectChanges();

    spyOn(console, 'warn');
    // 修复: 使用类型断言来解决 TypeScript 错误
    spyOn<any>(observedEl.nativeElement, 'offsetHeight').and.returnValue(100);

    directive.ngOnInit();
    tick(directive.debounceTime + 1);

    expect(console.warn).toHaveBeenCalledWith('Neither parent height nor fixed height is specified.');
    expect(targetEl.nativeElement.style.minHeight).toBe('');
  }));

  it('should disconnect ResizeObserver on destroy', () => {
    directive.ngOnDestroy();
    expect(window.ResizeObserver.prototype.disconnect).toHaveBeenCalled();
  });
});
