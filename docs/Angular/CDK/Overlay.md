# Angular CDK Overlay 详细指南

## 概述

Angular CDK Overlay 是一个强大的服务，用于创建浮层内容，如弹窗、下拉菜单、提示框等。它提供了灵活的定位策略和强大的配置选项。

## 安装和导入

### 安装
```bash
npm install @angular/cdk
```

### 导入模块
```scss
// modal.component.scss
.modal-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  width: 500px;
  max-width: 90vw;

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #eee;

  .close-btn {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
    }
  }

.modal-body {
    padding: 20px;
  }

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 20px;
    border-top: 1px solid #eee;

    button {
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      border: 1px solid #ccc;
      background: white;

    &.primary {
        background: #007bff;
        color: white;
        border: none;
      }
    }
  }
}

// tooltip.component.scss
.tooltip {
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
}

// dropdown.component.scss
.dropdown-menu {
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-width: 150px;

.dropdown-item {
    padding: 8px 16px;
    cursor: pointer;
    border-bottom: 1px solid #eee;

  &:hover {
      background-color: #f5f5f5;
    }

  &:last-child {
      border-bottom: none;
    }
  }
}

// basic-overlay.component.scss
.overlay-content {
  background: white;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-width: 200px;
}
```

### 导入服务
```typescript
import { Overlay, OverlayRef, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
```

## 核心概念

### 1. Overlay（浮层）
浮层是显示在应用程序主要内容之上的容器。

### 2. OverlayRef（浮层引用）
用于控制和管理已创建的浮层。

### 3. Portal（传送门）
定义要在浮层中显示的内容。

### 4. PositionStrategy（定位策略）
控制浮层在屏幕上的位置。

## 基本用法

### 1. 简单的模板浮层

```typescript
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';

@Component({
  selector: 'app-basic-overlay',
  template: `
    <button (click)="openOverlay()" #trigger>打开浮层</button>
    
    <ng-template #overlayTemplate>
      <div class="overlay-content">
        <h3>这是一个浮层</h3>
        <p>浮层内容</p>
        <button (click)="closeOverlay()">关闭</button>
      </div>
    </ng-template>
  `,
  styleUrls: ['./basic-overlay.component.scss']
})
export class BasicOverlayComponent {
  @ViewChild('overlayTemplate') overlayTemplate!: TemplateRef<any>;
  @ViewChild('trigger') trigger!: any;
  
  private overlayRef!: OverlayRef;

  constructor(private overlay: Overlay) {}

  openOverlay() {
    if (this.overlayRef && this.overlayRef.hasAttached()) {
      return;
    }

    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo(this.trigger.nativeElement)
      .withPositions([{
        originX: 'start',
        originY: 'bottom',
        overlayX: 'start',
        overlayY: 'top'
      }]);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop'
    });

    const portal = new TemplatePortal(this.overlayTemplate, this.viewContainerRef);
    this.overlayRef.attach(portal);

    // 点击背景关闭
    this.overlayRef.backdropClick().subscribe(() => {
      this.closeOverlay();
    });
  }

  closeOverlay() {
    if (this.overlayRef) {
      this.overlayRef.dispose();
    }
  }
}
```

### 2. 组件浮层

```typescript
// 浮层组件
@Component({
  selector: 'app-overlay-content',
  template: `
    <div class="overlay-panel">
      <h3>{{ title }}</h3>
      <p>{{ content }}</p>
      <button (click)="close()">关闭</button>
    </div>
  `,
  styleUrls: ['./overlay-content.component.scss']
})
export class OverlayContentComponent {
  @Input() title = '';
  @Input() content = '';
  @Output() closeEvent = new EventEmitter<void>();

  close() {
    this.closeEvent.emit();
  }
}
```

```scss
// overlay-content.component.scss
.overlay-panel {
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 300px;
}
```

```typescript
// 主组件
@Component({
  selector: 'app-component-overlay',
  template: `
    <button (click)="openComponentOverlay()" #trigger>
      打开组件浮层
    </button>
  `,
  styleUrls: ['./component-overlay.component.scss']
})
export class ComponentOverlayComponent {
  @ViewChild('trigger') trigger!: ElementRef;
  
  constructor(private overlay: Overlay) {}

  openComponentOverlay() {
    const positionStrategy = this.overlay.position()
      .globalPosition()
      .centerHorizontally()
      .centerVertically();

    const overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop'
    });

    const portal = new ComponentPortal(OverlayContentComponent);
    const componentRef = overlayRef.attach(portal);

    // 传递数据
    componentRef.instance.title = '组件浮层标题';
    componentRef.instance.content = '这是通过组件创建的浮层内容';
    
    // 监听关闭事件
    componentRef.instance.closeEvent.subscribe(() => {
      overlayRef.dispose();
    });

    // 点击背景关闭
    overlayRef.backdropClick().subscribe(() => {
      overlayRef.dispose();
    });
  }
}
```

## 定位策略详解

### 1. 全局定位策略 (GlobalPositionStrategy)

```typescript
// 居中显示
const centerPosition = this.overlay.position()
  .globalPosition()
  .centerHorizontally()
  .centerVertically();

// 固定位置
const fixedPosition = this.overlay.position()
  .globalPosition()
  .top('100px')
  .left('200px');

// 相对视口定位
const viewportPosition = this.overlay.position()
  .globalPosition()
  .top('50%')
  .left('50%');
```

### 2. 连接定位策略 (FlexibleConnectedPositionStrategy)

```typescript
const connectedPosition = this.overlay.position()
  .flexibleConnectedTo(this.triggerElement)
  .withPositions([
    {
      originX: 'start',    // 'start' | 'center' | 'end'
      originY: 'bottom',   // 'top' | 'center' | 'bottom'
      overlayX: 'start',   // 'start' | 'center' | 'end'
      overlayY: 'top'      // 'top' | 'center' | 'bottom'
    },
    {
      originX: 'start',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'bottom'
    }
  ])
  .withFlexibleDimensions(true)
  .withPush(true);
```

## 配置选项详解

### OverlayConfig 完整配置

```typescript
const config: OverlayConfig = {
  // 定位策略
  positionStrategy: positionStrategy,
  
  // 是否有背景
  hasBackdrop: true,
  
  // 背景样式类
  backdropClass: 'custom-backdrop',
  
  // 浮层样式类
  panelClass: 'custom-overlay-panel',
  
  // 宽度和高度
  width: '300px',
  height: '200px',
  minWidth: '200px',
  minHeight: '100px',
  maxWidth: '500px',
  maxHeight: '400px',
  
  // 滚动策略
  scrollStrategy: this.overlay.scrollStrategies.reposition(),
  
  // 分层顺序
  direction: 'ltr' // 'ltr' | 'rtl'
};
```

### 滚动策略

```typescript
// 重新定位（默认）
scrollStrategy: this.overlay.scrollStrategies.reposition()

// 关闭浮层
scrollStrategy: this.overlay.scrollStrategies.close()

// 阻止滚动
scrollStrategy: this.overlay.scrollStrategies.block()

// 无操作
scrollStrategy: this.overlay.scrollStrategies.noop()
```

## 实用示例

### 1. 下拉菜单

```typescript
@Component({
  selector: 'app-dropdown',
  template: `
    <button (click)="toggleDropdown()" #dropdownTrigger>
      选择选项 ▼
    </button>
    
    <ng-template #dropdownTemplate>
      <div class="dropdown-menu">
        <div class="dropdown-item" 
             *ngFor="let item of menuItems" 
             (click)="selectItem(item)">
          {{ item.label }}
        </div>
      </div>
    </ng-template>
  `,
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent {
  @ViewChild('dropdownTemplate') dropdownTemplate!: TemplateRef<any>;
  @ViewChild('dropdownTrigger') dropdownTrigger!: ElementRef;
  
  menuItems = [
    { label: '选项 1', value: 'option1' },
    { label: '选项 2', value: 'option2' },
    { label: '选项 3', value: 'option3' }
  ];
  
  private overlayRef?: OverlayRef;

  constructor(
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef
  ) {}

  toggleDropdown() {
    if (this.overlayRef && this.overlayRef.hasAttached()) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  private openDropdown() {
    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo(this.dropdownTrigger)
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top'
        },
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom'
        }
      ]);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      scrollStrategy: this.overlay.scrollStrategies.reposition()
    });

    const portal = new TemplatePortal(this.dropdownTemplate, this.viewContainerRef);
    this.overlayRef.attach(portal);

    this.overlayRef.backdropClick().subscribe(() => {
      this.closeDropdown();
    });
  }

  private closeDropdown() {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = undefined;
    }
  }

  selectItem(item: any) {
    console.log('选中项目:', item);
    this.closeDropdown();
  }
}
```

### 2. 工具提示 (Tooltip)

```typescript
@Component({
  selector: 'app-tooltip',
  template: `
    <button (mouseenter)="showTooltip()" 
            (mouseleave)="hideTooltip()" 
            #tooltipTrigger>
      悬停显示提示
    </button>
    
    <ng-template #tooltipTemplate>
      <div class="tooltip">
        {{ tooltipText }}
      </div>
    </ng-template>
  `,
  styleUrls: ['./tooltip.component.scss']
})
export class TooltipComponent {
  @ViewChild('tooltipTemplate') tooltipTemplate!: TemplateRef<any>;
  @ViewChild('tooltipTrigger') tooltipTrigger!: ElementRef;
  @Input() tooltipText = '这是一个工具提示';
  
  private overlayRef?: OverlayRef;
  private timeoutId?: number;

  constructor(
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef
  ) {}

  showTooltip() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    if (this.overlayRef && this.overlayRef.hasAttached()) {
      return;
    }

    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo(this.tooltipTrigger)
      .withPositions([
        {
          originX: 'center',
          originY: 'top',
          overlayX: 'center',
          overlayY: 'bottom',
          offsetY: -8
        },
        {
          originX: 'center',
          originY: 'bottom',
          overlayX: 'center',
          overlayY: 'top',
          offsetY: 8
        }
      ]);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.close()
    });

    const portal = new TemplatePortal(this.tooltipTemplate, this.viewContainerRef);
    this.overlayRef.attach(portal);
  }

  hideTooltip() {
    this.timeoutId = window.setTimeout(() => {
      if (this.overlayRef) {
        this.overlayRef.dispose();
        this.overlayRef = undefined;
      }
    }, 100);
  }
}
```

### 3. 模态对话框

```typescript
@Component({
  selector: 'app-modal',
  template: `
    <button (click)="openModal()">打开模态框</button>
    
    <ng-template #modalTemplate>
      <div class="modal-container">
        <div class="modal-header">
          <h2>{{ modalTitle }}</h2>
          <button (click)="closeModal()" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <p>{{ modalContent }}</p>
        </div>
        <div class="modal-footer">
          <button (click)="closeModal()">取消</button>
          <button (click)="confirm()" class="primary">确认</button>
        </div>
      </div>
    </ng-template>
  `,
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  @ViewChild('modalTemplate') modalTemplate!: TemplateRef<any>;
  
  modalTitle = '确认操作';
  modalContent = '您确定要执行此操作吗？';
  private overlayRef?: OverlayRef;

  constructor(
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef
  ) {}

  openModal() {
    const positionStrategy = this.overlay.position()
      .globalPosition()
      .centerHorizontally()
      .centerVertically();

    this.overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop',
      scrollStrategy: this.overlay.scrollStrategies.block()
    });

    const portal = new TemplatePortal(this.modalTemplate, this.viewContainerRef);
    this.overlayRef.attach(portal);

    // ESC 键关闭
    this.overlayRef.keydownEvents().subscribe(event => {
      if (event.key === 'Escape') {
        this.closeModal();
      }
    });
  }

  closeModal() {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = undefined;
    }
  }

  confirm() {
    console.log('用户确认操作');
    this.closeModal();
  }
}
```

## 高级用法

### 1. 自定义背景样式

```scss
// 全局样式文件 (styles.scss)
.custom-backdrop {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
}

.custom-overlay-panel {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 或者使用SCSS变量和混合
$overlay-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
$overlay-border-radius: 8px;
$overlay-bg: white;

@mixin overlay-base {
  background: $overlay-bg;
  border-radius: $overlay-border-radius;
  box-shadow: $overlay-shadow;
}

.modal-container {
  @include overlay-base;
  width: 500px;
  max-width: 90vw;
}

.dropdown-menu {
  @include overlay-base;
  min-width: 150px;
  border: 1px solid #ccc;
}
```

### 2. 键盘导航支持

```typescript
@Component({
  // ...
})
export class KeyboardNavigationOverlay {
  private focusTrap?: FocusTrap;

  openOverlay() {
    // ... 创建浮层代码

    // 添加焦点陷阱
    this.focusTrap = this.focusTrapFactory.create(
      this.overlayRef.overlayElement
    );
    this.focusTrap.focusInitialElement();

    // 键盘事件处理
    this.overlayRef.keydownEvents().subscribe(event => {
      if (event.key === 'Escape') {
        this.closeOverlay();
      }
    });
  }

  closeOverlay() {
    if (this.focusTrap) {
      this.focusTrap.destroy();
    }
    // ... 其他关闭逻辑
  }
}
```

### 3. 动态内容更新

```typescript
export class DynamicOverlayComponent {
  private componentRef?: ComponentRef<any>;

  openDynamicOverlay() {
    // ... 创建浮层
    
    const portal = new ComponentPortal(DynamicContentComponent);
    this.componentRef = this.overlayRef.attach(portal);
    
    // 动态更新内容
    this.updateContent();
  }

  updateContent() {
    if (this.componentRef) {
      this.componentRef.instance.data = this.newData;
      this.componentRef.instance.refresh();
    }
  }
}
```

## 最佳实践

### 1. 内存管理
- 始终在组件销毁时清理 OverlayRef
- 使用 takeUntil 操作符管理订阅 (Angular提供[`takeUntilDestroyed`](https://angular.dev/api/core/rxjs-interop/takeUntilDestroyed))

```typescript
// 旧的示例
export class OverlayComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    
    if (this.overlayRef) {
      this.overlayRef.dispose();
    }
  }

  private setupSubscriptions() {
    this.overlayRef.backdropClick()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.closeOverlay());
  }
}

// 使用Angular 19+ 的 takeUntilDestroyed
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
export class OverlayComponent implements OnDestroy {
  ngOnDestroy() {
    if (this.overlayRef) {
      this.overlayRef.dispose();
    }
  }

  private setupSubscriptions() {
    this.overlayRef.backdropClick()
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.closeOverlay());
  }
}
```

### 2. 无障碍访问
- 添加适当的 ARIA 属性
- 管理焦点状态
- 支持键盘导航

### 3. 性能优化
- 延迟创建浮层
- 复用 OverlayRef 当可能时
- 使用 OnPush 变更检测策略

### 4. 响应式设计
- 使用灵活的定位策略
- 设置最大宽度和高度
- 考虑移动设备的特殊需求

## 常见问题

### Q: 如何防止浮层溢出视口？
A: 使用 `withFlexibleDimensions(true)` 和 `withPush(true)`：

```typescript
const positionStrategy = this.overlay.position()
  .flexibleConnectedTo(element)
  .withFlexibleDimensions(true)
  .withPush(true)
  .withViewportMargin(8);
```

### Q: 如何创建嵌套浮层？
A: 每个浮层都有独立的 z-index，可以正常嵌套：

```typescript
// 在第一个浮层中创建第二个浮层
const secondOverlay = this.overlay.create({
  positionStrategy: this.overlay.position().globalPosition().centerHorizontally().centerVertically()
});
```

### Q: 如何处理浮层的动画？
A: 使用 SCSS 动画或 Angular Animations API：

```scss
// component.scss
.overlay-enter {
  opacity: 0;
  transform: translateY(-20px);
  transition: all 300ms ease-out;

  &.overlay-enter-active {
    opacity: 1;
    transform: translateY(0);
  }
}

.overlay-leave {
  opacity: 1;
  transform: translateY(0);
  transition: all 300ms ease-in;

  &.overlay-leave-active {
    opacity: 0;
    transform: translateY(-20px);
  }
}

// 使用SCSS变量管理动画
$animation-duration: 300ms;
$animation-easing: ease-out;

@mixin slide-in-animation {
  animation: slideIn $animation-duration $animation-easing;
}

.modal-container {
  @include slide-in-animation;
}
```

```typescript
// 或者使用Angular Animations
@Component({
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))
      ])
    ])
  ]
})
```

## 总结

CDK Overlay 是一个功能强大且灵活的工具，适用于创建各种浮层组件。通过合理使用定位策略、配置选项和生命周期管理，可以创建出用户体验良好的界面组件。

使用SCSS可以更好地组织样式代码，通过变量、混合器(mixins)、嵌套等特性，让样式更加模块化和可维护。记住始终考虑无障碍访问性、性能优化和内存管理，以确保应用程序的质量和稳定性。

### SCSS 最佳实践建议：

1. **使用变量管理主题色彩和尺寸**
2. **创建可复用的混合器(mixins)**
3. **合理使用嵌套，避免过深层级**
4. **利用SCSS的模块化功能拆分样式文件**
