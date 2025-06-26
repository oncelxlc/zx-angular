
# Angular CDK Overlay 使用详解

Angular CDK（Component Dev Kit）中的 `Overlay` 模块提供了一种强大的方式来在任意位置显示浮层组件，比如弹窗、提示框、下拉菜单等。

## 基本概念

### Overlay
`Overlay` 是一个服务，用于创建浮层。通过它可以在页面的任意位置渲染组件，不依赖组件的 DOM 结构。

### OverlayRef
由 `Overlay.create()` 创建的引用对象，用于控制浮层的显示、隐藏、定位等。

### OverlayConfig
配置项，包括定位策略、尺寸、面板类名、滚动策略、是否有 backdrop 背景等。

### PositionStrategy
用于控制浮层的定位方式。常用的是 `FlexibleConnectedPositionStrategy`。

---

## 基本使用示例

```ts
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Component } from '@angular/core';
import { MyOverlayComponent } from './my-overlay.component';

@Component({ ... })
export class MyComponent {
  private overlayRef: OverlayRef;

  constructor(private overlay: Overlay) {}

  openOverlay() {
    const positionStrategy = this.overlay.position()
      .global()
      .centerHorizontally()
      .centerVertically();

    this.overlayRef = this.overlay.create({ positionStrategy });
    this.overlayRef.attach(new ComponentPortal(MyOverlayComponent));
  }

  closeOverlay() {
    this.overlayRef?.detach();
  }
}
```

---

## 常用 API 说明

### `Overlay.create(config?: OverlayConfig): OverlayRef`
创建一个浮层，返回 `OverlayRef` 用于后续操作。

### `OverlayRef.attach(portal: Portal<any>): void`
将组件或模板附加到浮层上。

### `OverlayRef.detach(): void`
将浮层与组件解除挂载。

### `OverlayRef.dispose(): void`
销毁浮层。

### `Overlay.position()`
获取 `PositionBuilder`，用于设置浮层定位策略。

---

## 更进阶示例：基于元素定位的下拉菜单

```ts
openDropdown(trigger: ElementRef) {
  const positionStrategy = this.overlay.position()
    .flexibleConnectedTo(trigger)
    .withPositions([
      {
        originX: 'start',
        originY: 'bottom',
        overlayX: 'start',
        overlayY: 'top',
      }
    ]);

  const overlayRef = this.overlay.create({
    positionStrategy,
    hasBackdrop: true,
    backdropClass: 'transparent-backdrop',
    scrollStrategy: this.overlay.scrollStrategies.close()
  });

  overlayRef.attach(new ComponentPortal(MyDropdownComponent));

  overlayRef.backdropClick().subscribe(() => overlayRef.dispose());
}
```

---

## 背景点击关闭浮层

通过 `hasBackdrop: true` 启用背景遮罩，并监听 `backdropClick()` 实现点击背景关闭浮层。

```ts
overlayRef.backdropClick().subscribe(() => overlayRef.dispose());
```

---

## 自定义滚动策略

- `this.overlay.scrollStrategies.noop()`：滚动时不做任何处理
- `this.overlay.scrollStrategies.close()`：滚动时关闭浮层
- `this.overlay.scrollStrategies.block()`：阻止滚动
- `this.overlay.scrollStrategies.reposition()`：滚动时重新定位

---

## 参考链接

- [Angular CDK Overlay 官方文档](https://material.angular.io/cdk/overlay/overview)
