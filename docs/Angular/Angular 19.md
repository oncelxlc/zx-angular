# Angular 19 详细变化文档

## 概述

Angular 19 于 2024 年 11 月 19 日正式发布，这是一个重要的版本更新，引入了一系列强大的更新，旨在提升应用性能、简化响应式编程并增强开发者控制能力。本版本包含了更直观的状态管理、更简洁的设置选项，以及让 Angular 更快更易用的改进。

## 主要特性

### 1. Zoneless 变更检测支持

#### 概述
Angular 19 在服务端渲染中引入了 zoneless 支持，解决了一些边缘案例，并创建了用于构建 zoneless 项目的脚手架。

#### 特点
- 移除对 Zone.js 的依赖
- 更精确的变更检测
- 更好的性能表现
- 简化的异步操作处理

#### 示例代码

**启用 Zoneless 模式：**

```typescript
// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

bootstrapApplication(AppComponent, {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    // 其他 providers
  ]
});
```

**使用 Signals 替代传统的变更检测：**

```typescript
import { Component, signal, computed } from '@angular/core';

@Component({
  selector: 'app-counter',
  template: `
    <div>
      <p>计数: {{ count() }}</p>
      <p>双倍: {{ doubleCount() }}</p>
      <button (click)="increment()">增加</button>
      <button (click)="decrement()">减少</button>
    </div>
  `
})
export class CounterComponent {
  count = signal(0);
  doubleCount = computed(() => this.count() * 2);

  increment() {
    this.count.update(value => value + 1);
  }

  decrement() {
    this.count.update(value => value - 1);
  }
}
```

### 2. 增量水合（Incremental Hydration）

#### 概述
Angular 19 引入了增量水合功能，通过优先加载关键的延迟组件来提升开发体验，从而实现更快的初始加载时间。

#### 特点
- 部分水合支持
- 优先级加载策略
- 更快的首屏渲染
- 更好的用户体验

#### 示例代码

**配置增量水合：**

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideClientHydration, withIncrementalHydration } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(withIncrementalHydration()),
    // 其他 providers
  ]
};
```

**延迟加载组件：**

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-lazy-content',
  template: `
    <div>
      @defer (when shouldLoad) {
        <expensive-component />
      } @placeholder {
        <div>加载中...</div>
      }
    </div>
  `
})
export class LazyContentComponent {
  shouldLoad = false;

  loadContent() {
    this.shouldLoad = true;
  }
}
```

### 3. 稳定的事件重放（Event Replay）

#### 概述
Angular 19 提供了稳定的事件重放功能，确保在水合过程中用户交互不会丢失。

#### 示例代码

```typescript
// 启用事件重放
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(withEventReplay()),
  ]
};
```

### 4. Standalone 组件默认化

#### 概述
Angular 19 将 standalone 组件设为默认，简化了组件的创建和使用。

#### 特点
- 简化的组件架构
- 减少样板代码
- 更好的树摇优化
- 更灵活的模块管理

#### 示例代码

**新的 Standalone 组件：**

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <form (ngSubmit)="onSubmit()">
      <input [(ngModel)]="userName" name="userName" placeholder="用户名">
      <button type="submit">提交</button>
    </form>
  `
})
export class UserFormComponent {
  userName = '';

  onSubmit() {
    console.log('用户名:', this.userName);
  }
}
```

**使用 Angular CLI 创建 Standalone 组件：**

```bash
ng generate component my-component --standalone
```

### 5. 实验性 Linked Signal 原语

#### 概述
Angular 19 引入了实验性的 linked signal 原语，提供更强大的响应式编程能力。

#### 示例代码

```typescript
import { Component, signal, linkedSignal } from '@angular/core';

@Component({
  selector: 'app-linked-example',
  template: `
    <div>
      <p>原始值: {{ source() }}</p>
      <p>转换后的值: {{ derived() }}</p>
      <button (click)="updateSource()">更新源</button>
    </div>
  `
})
export class LinkedExampleComponent {
  source = signal('初始值');
  
  // linkedSignal 根据源信号的变化自动更新
  derived = linkedSignal(() => `处理后的: ${this.source().toUpperCase()}`);

  updateSource() {
    this.source.set(`新值 ${Date.now()}`);
  }
}
```

### 6. 热模块替换（Hot Module Replacement）

#### 概述
Angular 19 引入了热模块替换功能，大大提升了开发体验。

#### 配置示例

```json
// angular.json 配置
{
  "serve": {
    "builder": "@angular-devkit/build-angular:dev-server",
    "options": {
      "hmr": true
    }
  }
}
```

```bash
# 启动开发服务器并启用 HMR
ng serve --hmr
```

### 7. 时间选择器组件

#### 概述
Angular 19 新增了时间选择器组件，为 Angular Material 库增加了新的功能。

#### 示例代码

```typescript
import { Component } from '@angular/core';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-time-picker',
  standalone: true,
  imports: [MatTimepickerModule, MatInputModule, MatFormFieldModule],
  template: `
    <mat-form-field>
      <mat-label>选择时间</mat-label>
      <input matInput [matTimepicker]="picker" [(ngModel)]="selectedTime">
      <mat-timepicker-toggle matSuffix [for]="picker"></mat-timepicker-toggle>
      <mat-timepicker #picker></mat-timepicker>
    </mat-form-field>
  `
})
export class TimePickerComponent {
  selectedTime: Date | null = null;
}
```

### 8. 服务端渲染增强

#### 概述
Angular 19 通过允许开发者配置不同路由的渲染方式来增强服务端渲染，可以指定路由应该被预渲染还是服务端渲染。

#### 示例代码

```typescript
// app.config.server.ts
import { ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';

export const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    // 配置路由渲染策略
  ]
};
```

```typescript
// 路由配置
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    data: { prerender: true } // 预渲染
  },
  {
    path: 'profile',
    component: ProfileComponent,
    data: { ssr: true } // 服务端渲染
  }
];
```

### 9. 实验性流式数据检索 API

#### 概述
Angular 19 引入了实验性的流式数据检索 API，提供更高效的数据处理方式。

#### 示例代码

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StreamingDataService {
  constructor(private http: HttpClient) {}

  getStreamingData(): Observable<any> {
    return this.http.get('/api/streaming-data', {
      observe: 'events',
      reportProgress: true
    });
  }
}
```

### 10. 混合渲染支持

#### 概述
Angular 19 支持混合渲染，允许在同一应用中混合使用不同的渲染策略。

#### 示例代码

```typescript
// 混合渲染配置
import { Component } from '@angular/core';

@Component({
  selector: 'app-hybrid',
  template: `
    <!-- 客户端渲染部分 -->
    <div class="client-rendered">
      <dynamic-content />
    </div>
    
    <!-- 服务端渲染部分 -->
    <div class="server-rendered">
      <static-content />
    </div>
  `
})
export class HybridComponent {}
```

## 开发工具改进

### 1. 未使用 Standalone 导入警告

Angular 19 会对未使用的 standalone 导入发出警告，帮助开发者优化代码。

```typescript
// Angular 19 会警告未使用的导入
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnusedModule } from './unused-module'; // 会收到警告

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule], // UnusedModule 未使用
  template: `<div>示例组件</div>`
})
export class ExampleComponent {}
```

### 2. Angular Language Service 改进

Angular Language Service 帮助代码编辑器处理错误和识别、获取补全和提示，以及在 Angular 模板中导航。

## 性能优化

### 1. 更好的树摇优化

```typescript
// 优化前
import * as _ from 'lodash';

// 优化后 - Angular 19 支持更精确的树摇
import { debounce } from 'lodash';
```

### 2. 减少包大小

```typescript
// 使用 Standalone 组件减少包大小
@Component({
  selector: 'app-minimal',
  standalone: true,
  imports: [], // 只导入必需的模块
  template: `<div>最小化组件</div>`
})
export class MinimalComponent {}
```

## 迁移指南

### 从 Angular 18 迁移到 Angular 19

#### 1. 更新依赖

```bash
ng update @angular/core @angular/cli
```

#### 2. 启用新特性

```typescript
// 更新 main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { 
  provideExperimentalZonelessChangeDetection,
  provideClientHydration,
  withIncrementalHydration 
} from '@angular/core';

bootstrapApplication(AppComponent, {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideClientHydration(withIncrementalHydration()),
  ]
});
```

#### 3. 转换为 Standalone 组件

```typescript
// 旧的组件 (Angular 18)
@NgModule({
  declarations: [OldComponent],
  imports: [CommonModule, FormsModule],
  exports: [OldComponent]
})
export class OldModule {}

// 新的 Standalone 组件 (Angular 19)
@Component({
  selector: 'app-new',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `...`
})
export class NewComponent {}
```

## 最佳实践

### 1. 使用 Signals 进行状态管理

```typescript
import { Component, signal, computed, effect } from '@angular/core';

@Component({
  selector: 'app-best-practice',
  template: `
    <div>
      <input (input)="updateName($event)" [value]="name()">
      <p>问候语: {{ greeting() }}</p>
      <p>字符数: {{ nameLength() }}</p>
    </div>
  `
})
export class BestPracticeComponent {
  name = signal('');
  greeting = computed(() => `你好, ${this.name()}!`);
  nameLength = computed(() => this.name().length);

  constructor() {
    // 使用 effect 进行副作用处理
    effect(() => {
      console.log(`名字变更为: ${this.name()}`);
    });
  }

  updateName(event: Event) {
    const target = event.target as HTMLInputElement;
    this.name.set(target.value);
  }
}
```

### 2. 优化性能的组件设计

```typescript
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-optimized',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @defer (when shouldLoad) {
      <heavy-component />
    } @placeholder {
      <skeleton-loader />
    } @loading (minimum 2s) {
      <loading-spinner />
    }
  `
})
export class OptimizedComponent {
  shouldLoad = false;
}
```

## 总结

Angular 19 是一个重要的版本更新，专注于提升应用性能、简化响应式编程并增强开发者控制能力。主要改进包括：

- **Zoneless 变更检测**：提供更精确和高效的变更检测机制
- **增量水合**：优化服务端渲染应用的加载性能
- **Standalone 组件默认化**：简化组件架构和依赖管理
- **实验性新特性**：为未来的发展奠定基础
- **开发工具改进**：提供更好的开发体验

这些特性使得 Angular 应用更加高效、易维护且用户体验更佳。建议开发者逐步采用这些新特性，特别是 Signals 和 Standalone 组件，以获得最佳的开发体验和应用性能。

## 参考资源

- [Angular 官方文档](https://angular.dev)
- [Angular 发布说明](https://angular.dev/reference/releases)
- [Angular Roadmap](https://angular.dev/roadmap)
- [Angular CLI 文档](https://angular.dev/tools/cli)
