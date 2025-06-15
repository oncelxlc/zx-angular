# Angular 18 详细变化文档

## 概述

Angular 18 是一个重要的版本更新，发布于2024年5月。本版本包含了无区域变更检测、原生异步支持、部分水合、Material 3 稳定化、控件状态事件、改进的 SSR 和调试，以及灵活的路由重定向等重大功能。

## 主要新特性

### 1. 实验性无区域变更检测 (Experimental Zoneless Change Detection)

#### 概述
Angular 18 引入了实验性的无区域变更检测机制，旨在解决 Zone.js 带来的一些挑战。虽然仍然是实验性功能，但这代表了 Angular 变更检测的重要发展方向。

#### 启用方式
```typescript
// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    // 其他 providers
  ]
});
```

#### 使用示例
```typescript
// 组件示例
import { Component, signal, computed, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-counter',
  template: `
    <div>
      <p>计数: {{ count() }}</p>
      <p>双倍: {{ doubleCount() }}</p>
      <button (click)="increment()">增加</button>
      <button (click)="reset()">重置</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CounterComponent {
  count = signal(0);
  doubleCount = computed(() => this.count() * 2);

  increment() {
    this.count.update(value => value + 1);
  }

  reset() {
    this.count.set(0);
  }
}
```

### 2. 增强的 Signals 支持

#### Signal-based Inputs (开发者预览)
```typescript
import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  template: `
    <div>
      <h2>{{ displayName() }}</h2>
      <p>年龄: {{ age() }}</p>
      <p>状态: {{ userStatus() }}</p>
    </div>
  `
})
export class UserProfileComponent {
  // 必需的 input signal
  firstName = input.required<string>();
  lastName = input.required<string>();
  
  // 可选的 input signal (带默认值)
  age = input(18);
  
  // 计算属性
  displayName = computed(() => `${this.firstName()} ${this.lastName()}`);
  userStatus = computed(() => this.age() >= 18 ? '成年人' : '未成年人');
}
```

使用方式：
```html
<app-user-profile 
  firstName="张" 
  lastName="三" 
  [age]="25">
</app-user-profile>
```

#### Signal-based Queries (开发者预览)
```typescript
import { Component, viewChild, viewChildren, contentChild, contentChildren } from '@angular/core';

@Component({
  selector: 'app-parent',
  template: `
    <div #container>
      <button #btn>按钮1</button>
      <button #btn>按钮2</button>
      <input #input type="text">
      <ng-content></ng-content>
    </div>
  `
})
export class ParentComponent {
  // 单个元素查询
  container = viewChild<ElementRef>('container');
  input = viewChild<ElementRef>('input');
  
  // 多个元素查询
  buttons = viewChildren<ElementRef>('btn');
  
  // 内容查询
  projectedContent = contentChildren('projected');

  ngAfterViewInit() {
    console.log('容器元素:', this.container()?.nativeElement);
    console.log('按钮数量:', this.buttons().length);
  }
}
```

### 3. Material 3 设计系统支持

#### 升级到 Material 3
```bash
ng add @angular/material
```

```typescript
// app.config.ts
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    // 其他 providers
  ]
};
```

#### Material 3 主题配置
```scss
// styles.scss
@use '@angular/material' as mat;

// 定义 Material 3 调色板
$primary-palette: mat.define-palette(mat.$azure-palette);
$accent-palette: mat.define-palette(mat.$blue-palette);
$warn-palette: mat.define-palette(mat.$red-palette);

// 创建 Material 3 主题
$theme: mat.define-theme((
  color: (
    theme-type: light,
    primary: $primary-palette,
    tertiary: $accent-palette,
  ),
  typography: (
    brand-family: 'Roboto, sans-serif',
    plain-family: 'Roboto, sans-serif',
  ),
));

// 应用主题
@include mat.all-component-themes($theme);
```

### 4. 控件状态事件 (Control State Events)

#### 增强的响应式表单
```typescript
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-form',
  template: `
    <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
      <input formControlName="email" placeholder="邮箱">
      <div *ngIf="emailControl.invalid && emailControl.touched">
        邮箱格式不正确
      </div>
      
      <input formControlName="password" type="password" placeholder="密码">
      <div *ngIf="passwordControl.invalid && passwordControl.dirty">
        密码至少6位
      </div>
      
      <button type="submit" [disabled]="userForm.invalid">提交</button>
    </form>
    
    <div>
      <p>表单状态: {{ formStatus }}</p>
      <p>邮箱状态: {{ emailStatus }}</p>
    </div>
  `
})
export class FormComponent {
  private fb = inject(FormBuilder);
  
  userForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  get emailControl() { return this.userForm.get('email')!; }
  get passwordControl() { return this.userForm.get('password')!; }
  
  get formStatus() { return this.userForm.status; }
  get emailStatus() { return this.emailControl.status; }

  constructor() {
    // 监听表单状态变化
    this.userForm.statusChanges.subscribe(status => {
      console.log('表单状态变化:', status);
    });
    
    // 监听特定控件状态变化
    this.emailControl.statusChanges.subscribe(status => {
      console.log('邮箱状态变化:', status);
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      console.log('表单数据:', this.userForm.value);
    }
  }
}
```

### 5. 灵活的路由重定向

#### 函数式重定向
Angular 18 使 redirectTo 属性更加灵活，可以接受返回字符串的函数，而不仅仅是字符串值。这提供了基于运行时状态的更复杂重定向逻辑。

```typescript
// app-routing.module.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    redirectTo: (route) => {
      // 基于查询参数的条件重定向
      const userRole = route.queryParams['role'];
      return userRole === 'admin' ? '/admin-dashboard' : '/user-dashboard';
    }
  },
  {
    path: 'profile',
    redirectTo: (route) => {
      // 基于路径参数的重定向
      const userId = route.params['id'];
      return userId ? `/users/${userId}/profile` : '/login';
    }
  },
  {
    path: 'legacy/:id',
    redirectTo: (route) => {
      // 动态重定向逻辑
      const id = route.params['id'];
      const timestamp = Date.now();
      return `/new-route/${id}?t=${timestamp}`;
    }
  }
];
```

### 6. ng-content 的 fallback 支持

#### 内容投影增强
```typescript
@Component({
  selector: 'app-card',
  template: `
    <div class="card">
      <div class="card-header">
        <ng-content select="[slot=header]">
          <!-- fallback 内容 -->
          <h3>默认标题</h3>
        </ng-content>
      </div>
      
      <div class="card-body">
        <ng-content>
          <!-- 默认插槽的 fallback -->
          <p>暂无内容</p>
        </ng-content>
      </div>
      
      <div class="card-footer">
        <ng-content select="[slot=footer]">
          <!-- footer 的 fallback -->
          <button>确定</button>
        </ng-content>
      </div>
    </div>
  `,
  styles: [`
    .card { border: 1px solid #ddd; border-radius: 8px; }
    .card-header { padding: 16px; border-bottom: 1px solid #eee; }
    .card-body { padding: 16px; }
    .card-footer { padding: 16px; border-top: 1px solid #eee; }
  `]
})
export class CardComponent {}
```

使用示例：
```html
<!-- 使用自定义内容 -->
<app-card>
  <h2 slot="header">自定义标题</h2>
  <p>这是卡片内容</p>
  <div slot="footer">
    <button>取消</button>
    <button>保存</button>
  </div>
</app-card>

<!-- 使用 fallback 内容（空卡片） -->
<app-card></app-card>
```

### 7. 改进的服务端渲染 (SSR)

#### 增量静态再生 (ISR) 支持
```typescript
// app.config.server.ts
import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    // ISR 配置
    {
      provide: 'ISR_CONFIG',
      useValue: {
        revalidate: 60, // 60秒后重新生成
        fallback: 'blocking' // 或 'non-blocking'
      }
    }
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
```

#### 流式 SSR
```typescript
// 支持流式服务端渲染
@Component({
  selector: 'app-async-data',
  template: `
    <div>
      @if (data$ | async; as data) {
        <div>{{ data.title }}</div>
      } @else {
        <div>加载中...</div>
      }
    </div>
  `
})
export class AsyncDataComponent {
  data$ = this.http.get<any>('/api/data').pipe(
    delay(2000) // 模拟慢速 API
  );

  constructor(private http: HttpClient) {}
}
```

### 8. 开发体验改进

#### 增强的 Hot Module Replacement (HMR)
```json
// angular.json
{
  "serve": {
    "builder": "@angular-devkit/build-angular:dev-server",
    "options": {
      "hmr": true,
      "liveReload": true
    }
  }
}
```

#### 改进的错误提示
```typescript
// 更好的类型错误提示
@Component({
  selector: 'app-example',
  template: `
    <!-- Angular 18 会提供更精确的模板类型检查 -->
    <div>{{ user.name }}</div> <!-- 如果 user 可能为空，会有清晰的错误提示 -->
  `
})
export class ExampleComponent {
  user: User | null = null;
}
```

### 9. 新的控制流语法 (稳定版)

#### @if, @for, @switch 语法
```typescript
@Component({
  selector: 'app-control-flow',
  template: `
    <!-- 条件渲染 -->
    @if (user) {
      <div>欢迎, {{ user.name }}!</div>
    } @else if (loading) {
      <div>加载中...</div>
    } @else {
      <div>请登录</div>
    }

    <!-- 列表渲染 -->
    @for (item of items; track item.id) {
      <div class="item">
        {{ item.name }} - {{ item.price | currency }}
      </div>
    } @empty {
      <div>暂无数据</div>
    }

    <!-- Switch 语句 -->
    @switch (status) {
      @case ('loading') {
        <div>正在加载...</div>
      }
      @case ('success') {
        <div>加载成功!</div>
      }
      @case ('error') {
        <div>加载失败</div>
      }
      @default {
        <div>未知状态</div>
      }
    }
  `
})
export class ControlFlowComponent {
  user: User | null = null;
  loading = false;
  items: Item[] = [];
  status: 'loading' | 'success' | 'error' | 'idle' = 'idle';
}
```

### 10. 性能优化

#### 改进的包体积
```typescript
// 更好的 tree-shaking 支持
import { Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-optimized',
  template: `...`
})
export class OptimizedComponent {
  private destroyRef = inject(DestroyRef);

  constructor(private http: HttpClient) {
    // 自动取消订阅，无需手动管理
    this.http.get('/api/data')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => {
        console.log(data);
      });
  }
}
```

## 升级指南

### 从 Angular 17 升级到 18

1. **更新 Angular CLI**
```bash
npm install -g @angular/cli@latest
```

2. **更新项目依赖**
```bash
ng update @angular/core @angular/cli
ng update @angular/material  # 如果使用 Material
```

3. **检查废弃功能**
```typescript
// 检查并替换废弃的 API
// 例如：ViewChild 查询现在推荐使用 signal-based 查询
```

4. **启用新功能**
```typescript
// 可选：启用实验性功能
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

bootstrapApplication(AppComponent, {
  providers: [
    provideExperimentalZonelessChangeDetection(), // 实验性
    // 其他 providers
  ]
});
```

## 注意事项

### 实验性功能
- 无区域变更检测仍然是实验性功能，不建议在生产环境使用
- Signal-based inputs 和 queries 处于开发者预览阶段

### 兼容性
- 需要 Node.js 18.19.1 或更高版本
- TypeScript 5.4 或更高版本
- 支持的浏览器版本保持不变

### 性能建议
- 在使用无区域变更检测时，确保正确使用 signals
- 利用新的控制流语法提高模板性能
- 合理使用 SSR 和 ISR 功能

## 总结

Angular 18 带来了许多激动人心的新功能，特别是：
- 实验性无区域变更检测为未来的性能优化奠定基础
- Signal-based APIs 提供了更好的响应式编程体验
- 改进的 SSR 和开发工具提升了开发效率
- 新的控制流语法使模板更加简洁和性能更好

这些改进使 Angular 18 成为一个更加现代化、高性能的前端框架，为开发者提供了更好的开发体验和更强大的功能。
