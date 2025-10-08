
# 📘 Angular CDK Overlay 使用详解

> 本文档介绍如何在 Angular 中使用 `@angular/cdk/overlay` 来创建自定义弹窗、提示框、浮层等 UI 组件，提供详细代码示例和原理解析。

## 📦 一、安装依赖

```bash
ng add @angular/cdk
```

## 🧠 二、基本概念

| 概念 | 说明 |
|------|------|
| `Overlay` | 动态创建浮层容器，插入到 DOM 中浮于页面上方。 |
| `OverlayRef` | 管理 Overlay 实例（显示、隐藏、销毁等）。 |
| `PositionStrategy` | 控制浮层位置（绝对、相对、跟随锚点等）。 |
| `ScrollStrategy` | 控制滚动行为（阻止、关闭、无影响等）。 |
| `Portal` | 动态插入组件或模板内容。 |

## 🛠️ 三、基础使用步骤

### 1. 创建 Overlay 服务（可复用）

```ts
// overlay.service.ts
import {
  Injectable, Injector, TemplateRef
} from '@angular/core';
import {
  Overlay, OverlayRef, OverlayConfig, PositionStrategy
} from '@angular/cdk/overlay';
import {
  ComponentPortal, TemplatePortal
} from '@angular/cdk/portal';
import { ViewContainerRef } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class OverlayService {
  constructor(private overlay: Overlay) {}

  openTemplateOverlay(
    template: TemplateRef<any>,
    viewContainerRef: ViewContainerRef,
    positionStrategy: PositionStrategy
  ): OverlayRef {
    const overlayRef = this.overlay.create({ positionStrategy });
    const portal = new TemplatePortal(template, viewContainerRef);
    overlayRef.attach(portal);
    return overlayRef;
  }
}
```

### 2. 使用模板和服务展示 Overlay

```html
<!-- app.component.html -->
<button (click)="open()">打开浮层</button>

<ng-template #overlayTemplate>
  <div class="overlay-content">Hello Overlay!</div>
</ng-template>
```

```ts
// app.component.ts
import { Component, ViewChild, TemplateRef, ViewContainerRef } from '@angular/core';
import { Overlay, OverlayRef, FlexibleConnectedPositionStrategy } from '@angular/cdk/overlay';
import { OverlayService } from './overlay.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  @ViewChild('overlayTemplate') overlayTemplate!: TemplateRef<any>;
  overlayRef!: OverlayRef;

  constructor(
    private overlayService: OverlayService,
    private viewContainerRef: ViewContainerRef,
    private overlay: Overlay
  ) {}

  open() {
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(document.body)
      .withPositions([
        { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'top' }
      ]);

    this.overlayRef = this.overlayService.openTemplateOverlay(
      this.overlayTemplate,
      this.viewContainerRef,
      positionStrategy
    );
  }
}
```

## 🔧 四、进阶配置项说明

### 1. 定位策略 `PositionStrategy`

```ts
const positionStrategy = this.overlay
  .position()
  .flexibleConnectedTo(buttonElement)
  .withFlexibleDimensions(false)
  .withPush(false)
  .withPositions([
    {
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top'
    }
  ]);
```

### 2. 滚动策略 `ScrollStrategy`

```ts
this.overlay.create({
  scrollStrategy: this.overlay.scrollStrategies.block() // 禁止滚动
});
```

### 3. 背景遮罩 + 点击关闭

```ts
const overlayRef = this.overlay.create({
  hasBackdrop: true,
  backdropClass: 'cdk-overlay-dark-backdrop',
});

overlayRef.backdropClick().subscribe(() => overlayRef.detach());
```

## 🔁 五、动态组件插入（ComponentPortal）

```ts
const portal = new ComponentPortal(MyPopupComponent);
overlayRef.attach(portal);
```

```ts
// MyPopupComponent.ts
@Component({
  selector: 'my-popup',
  template: `<p>我是动态组件内容</p>`
})
export class MyPopupComponent {}
```

## 🚀 六、进阶示例

### 1. 视频预览弹窗

```ts
@Component({
  selector: 'video-preview',
  template: `
    <div class="preview">
      <video autoplay controls [src]="url | safe: 'resourceUrl'"></video>
    </div>
  `
})
export class VideoPreviewComponent {
  @Input() url!: string;
}
```

```ts
const overlayRef = this.overlay.create({
  hasBackdrop: true,
  positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically()
});
const portal = new ComponentPortal(VideoPreviewComponent);
const componentRef = overlayRef.attach(portal);
componentRef.instance.url = videoBlobUrl;
```

### 2. 全局 Loading 提示

```ts
const overlayRef = this.overlay.create({
  hasBackdrop: true,
  backdropClass: 'transparent-backdrop',
  positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically()
});

const portal = new ComponentPortal(LoadingSpinnerComponent);
overlayRef.attach(portal);
```

## 🎯 七、自定义样式

```css
.overlay-content {
  background: white;
  border: 1px solid #ccc;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  border-radius: 8px;
}

.preview video {
  width: 480px;
  height: auto;
}

.transparent-backdrop {
  background: rgba(255, 255, 255, 0.5);
}
```

## 🧪 八、完整小结

| 功能 | 技术点 |
|------|--------|
| 打开浮层 | `OverlayRef.attach()` |
| 关闭浮层 | `OverlayRef.detach()` |
| 模板插入 | `TemplatePortal` |
| 组件插入 | `ComponentPortal` |
| 定位控制 | `PositionStrategy` |
| 遮罩关闭 | `hasBackdrop` + `backdropClick()` |

## 📎 九、推荐阅读

- Angular CDK 官方文档: https://material.angular.io/cdk/overlay
- Angular CDK Portal 文档: https://material.angular.io/cdk/portal/overview
