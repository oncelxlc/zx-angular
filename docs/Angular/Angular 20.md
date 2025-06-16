### 文件命名约定变更

- **重大更新**: Angular样式指南发布重大更新
- **简化原则**: 移除大量推荐规则，专注于最重要的规范
- **命名变更**: 文件命名约定改变，移除大部分后缀要求
- **访问地址**: [angular.dev/style-guide](https://angular.dev/style-guide)

**文件命名示例**:

```bash
# 旧的文件命名约定 (Angular 19及之前)
src/
├── app/
│   ├── components/
│   │   ├── user-profile.component.ts
│   │   ├── user-profile.component.html
│   │   ├── user-profile.component.scss
│   │   └── user-profile.component.spec.ts
│   ├── services/
│   │   ├── user.service.ts
│   │   └── user.service.spec.ts
│   ├── guards/
│   │   ├── auth.guard.ts
│   │   └── auth.guard.spec.ts
│   ├── pipes/
│   │   ├── currency-format.pipe.ts
│   │   └── currency-format.pipe.spec.ts
│   └── models/
│       ├── user.model.ts
│       └── api-response.model.ts

# 新的文件命名约定 (Angular 20推荐)
src/
├── app/
│   ├── components/
│   │   ├── user-profile.ts          # 移除.component后缀
│   │   ├── user-profile.html
│   │   ├── user-profile.scss
│   │   └── user-profile.test.ts     # 可选：.spec.ts 或 .test.ts
│   ├── services/
│   │   ├── user.ts                  # 移除.service后缀
│   │   └── user.test.ts
│   ├── guards/
│   │   ├── auth.ts                  # 移除.guard后缀
│   │   └── auth.test.ts
│   ├── pipes/
│   │   ├── currency-format.ts       # 移除.pipe后缀
│   │   └── currency-format.test.ts
│   └── models/
│       ├── user.ts                  # 移除.model后缀
│       └── api-response.ts
```

**代码组织示例**:

```typescript
// 文件: src/app/components/user-profile.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.html',
  styleUrls: ['./user-profile.scss']
})
export class UserProfile {
  // 组件实现
}

// 文件: src/app/services/user.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // 服务实现
}

// 文件: src/app/guards/auth.ts
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  canActivate(): boolean {
    // 守卫逻辑
    return true;
  }
}

// 文件: src/app/pipes/currency-format.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFormat'
})
export class CurrencyFormatPipe implements PipeTransform {
  transform(value: number): string {
    // 管道逻辑
    return `${value.toFixed(2)}`;
  }
}

// 文件: src/app/models/user.ts
export interface User {
  id: number;
  name: string;
  email: string;
  profile?: UserProfile;
}

export interface UserProfile {
  avatar: string;
  bio: string;
  location: string;
}
```

**新样式指南要点**:

```shell
// 推荐的项目结构
src/
├── app/
│   ├── core/                    # 核心功能（单例服务、全局守卫等）
│   ├── shared/                  # 共享模块（通用组件、管道、指令）
│   ├── features/                # 功能模块
│   │   ├── user-management/
│   │   │   ├── components/
│   │   │   ├── services/ # Angular 20 版本详细变化文档
```

## 📅 发布信息

- **发布日期**: 2025年5月29日
- **版本类型**: 主要版本 (Major Release)
- **支持状态**: 当前版本

## 🚀 主要新功能

### 1. 控制流语法稳定化

- **影响范围**: 模板语法
- **详细说明**: Angular 20 中的控制流语法（如 `@if`、`@for`、`@switch`）现已完全稳定
- **优势**: 提供更简洁、更直观的模板控制流编写方式

**示例代码**:

```html
<!-- 新的控制流语法 -->
@if (user.isLoggedIn) {
<div>欢迎, {{ user.name }}!</div>
} @else {
<div>请先登录</div>
}

@for (item of items; track item.id) {
<div class="item">{{ item.name }}</div>
} @empty {
<div>暂无数据</div>
}

@switch (status) {
@case ('loading') {
<div>加载中...</div>
}
@case ('success') {
<div>加载完成</div>
}
@default {
<div>未知状态</div>
}
}
```

### 2. Signal 相关 API 稳定化

- **effect()**: 响应式效果函数正式稳定
- **linkedSignal()**: 链接信号API稳定
- **toSignal()**: 将Observable转换为Signal的工具函数稳定
- **意义**: Signal 生态系统更加成熟，为响应式编程提供完整支持

**示例代码**:

```typescript
import { signal, effect, linkedSignal, toSignal } from '@angular/core';
import { Observable } from 'rxjs';

// 基础Signal使用
const count = signal(0);
const doubleCount = computed(() => count() * 2);

// effect() - 稳定版本
effect(() => {
  console.log('Count changed:', count());
  // 在count变化时自动执行
});

// linkedSignal() - 链接信号
const firstName = signal('John');
const lastName = signal('Doe');
const fullName = linkedSignal(() => `${firstName()} ${lastName()}`);

// toSignal() - Observable转Signal
const data$: Observable<any> = this.http.get('/api/data');
const dataSignal = toSignal(data$, {initialValue: null});

// 在组件中使用
@Component({
  template: `
    <div>Count: {{ count() }}</div>
    <div>Double: {{ doubleCount() }}</div>
    <div>Full Name: {{ fullName() }}</div>
    <div>Data: {{ dataSignal() | json }}</div>
  `
})
export class ExampleComponent {
  count = signal(0);
  doubleCount = computed(() => this.count() * 2);

  increment() {
    this.count.update(value => value + 1);
  }
}
```

### 3. 增量水合(Incremental Hydration)稳定化

- **功能**: 服务端渲染应用的增量水合功能正式稳定
- **性能提升**: 显著改善SSR应用的首次加载性能
- **用户体验**: 更快的页面交互响应时间

**示例代码**:

```typescript
// app.config.ts - 配置增量水合
import { ApplicationConfig } from '@angular/core';
import { provideClientHydration, withIncrementalHydration } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    // 启用增量水合
    provideClientHydration(withIncrementalHydration()),
    // 其他providers...
  ]
};

// 组件级别的水合控制
@Component({
  selector: 'app-lazy-component',
  template: `
    <div>
      <h2>延迟水合组件</h2>
      <p>此组件将在需要时才进行水合</p>
    </div>
  `,
  // 标记组件为延迟水合
  hydration: 'defer'
})
export class LazyComponent {
}

// 条件水合
@Component({
  selector: 'app-conditional',
  template: `
    @if (shouldHydrate) {
      <div>条件水合内容</div>
    }
  `
})
export class ConditionalComponent {
  shouldHydrate = signal(false);

  ngOnInit() {
    // 基于条件决定是否水合
    setTimeout(() => {
      this.shouldHydrate.set(true);
    }, 1000);
  }
}
```

### 4. 路由级渲染模式配置

- **新功能**: 支持在路由级别配置渲染模式
- **灵活性**: 允许不同路由使用不同的渲染策略
- **适用场景**: 混合应用架构，部分页面SSR，部分页面CSR

**示例代码**:

```typescript
// app.routes.ts - 路由级渲染配置
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    // 服务端渲染模式
    data: {renderMode: 'server'}
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    // 客户端渲染模式
    data: {renderMode: 'client'}
  },
  {
    path: 'hybrid',
    component: HybridComponent,
    // 混合渲染模式
    data: {renderMode: 'hybrid'}
  },
  {
    path: 'static',
    component: StaticComponent,
    // 静态生成模式
    data: {renderMode: 'prerender'}
  }
];

// 动态渲染模式选择
@Injectable()
export class RenderModeService {
  getRenderMode(route: string): 'server' | 'client' | 'hybrid' {
    // 基于用户设备或其他条件动态选择
    if (this.isMobile() && route === 'dashboard') {
      return 'server'; // 移动设备优先服务端渲染
    }
    return 'client';
  }

  private isMobile(): boolean {
    return window.innerWidth < 768;
  }
}
```

```json
// angular.json - 构建配置
{
  "projects": {
    "your-app": {
      "architect": {
        "build": {
          "options": {
            "renderMode": {
              "routes": {
                "/home": "server",
                "/dashboard": "client",
                "/api/*": "server"
              }
            }
          }
        }
      }
    }
  }
}
```

### 5. Zoneless 应用预览版

- **状态**: 开发者预览版 (Developer Preview)
- **功能**: 无Zone.js的Angular应用运行模式
- **性能**: 减少运行时开销，提升应用性能

**示例代码**:

```typescript
// main.ts - 启用Zoneless模式
import { bootstrapApplication } from '@angular/platform-browser';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    // 启用实验性Zoneless变更检测
    provideExperimentalZonelessChangeDetection(),
    // 其他providers...
  ]
});

// 在Zoneless应用中使用Signal
@Component({
  selector: 'app-zoneless',
  template: `
    <div>
      <h2>Zoneless应用示例</h2>
      <p>计数: {{ count() }}</p>
      <button (click)="increment()">增加</button>
      
      @if (isLoading()) {
        <div>加载中...</div>
      } @else {
        <div>{{ data() }}</div>
      }
    </div>
  `
})
export class ZonelessComponent {
  // 使用Signal进行状态管理
  count = signal(0);
  isLoading = signal(false);
  data = signal<string>('');

  increment() {
    // Signal更新会自动触发变更检测
    this.count.update(value => value + 1);
  }

  async loadData() {
    this.isLoading.set(true);
    try {
      const result = await fetch('/api/data');
      const data = await result.text();
      this.data.set(data);
    } finally {
      this.isLoading.set(false);
    }
  }

  ngOnInit() {
    // 在Zoneless模式下，需要手动触发变更检测
    // 或使用Signal来自动管理状态
    this.loadData();
  }
}

// 手动变更检测（当需要时）
@Component({
  selector: 'app-manual-cd',
  template: `<div>{{ status }}</div>`
})
export class ManualChangeDetectionComponent {
  status = '初始状态';

  constructor(private cdr: ChangeDetectorRef) {
  }

  updateStatus() {
    this.status = '已更新';
    // Zoneless模式下可能需要手动触发
    this.cdr.detectChanges();
  }
}
```

## 🔧 开发工具改进

### 1. Angular DevTools 增强

- **调试体验**: 改进的调试界面和功能
- **Chrome集成**: 与Chrome DevTools深度集成
- **自定义报告**: 在Chrome DevTools中直接显示Angular特定信息

### 2. 类型检查增强

- **Host绑定类型检查**: 组件和指令的host元数据现在支持完整类型检查
- **验证范围**: `@HostBinding` 和 `@HostListener` 装饰器的表达式验证
- **错误捕获**: 更早发现潜在的类型错误

**示例代码**:

```typescript
// 增强的Host绑定类型检查
@Component({
  selector: 'app-typed-host',
  template: '<div>类型安全的Host绑定</div>',
  host: {
    // 现在支持完整类型检查
    '[class.active]': 'isActive',
    '[attr.aria-label]': 'label',
    '[style.color]': 'textColor',
    '(click)': 'onClick($event)',
    '(keydown)': 'onKeyDown($event)'
  }
})
export class TypedHostComponent {
  // 类型检查确保这些属性存在且类型正确
  isActive: boolean = false;
  label: string = '按钮标签';
  textColor: string = '#333';

  onClick(event: MouseEvent): void {
    console.log('点击事件', event);
  }

  onKeyDown(event: KeyboardEvent): void {
    console.log('键盘事件', event);
  }
}

// 使用@HostBinding和@HostListener的类型检查
@Component({
  selector: 'app-decorator-host',
  template: '<div>装饰器Host绑定</div>'
})
export class DecoratorHostComponent {
  @HostBinding('class.highlighted')
  get isHighlighted(): boolean {
    return this.active;
  }

  @HostBinding('attr.role')
  role: string = 'button';

  @HostBinding('style.backgroundColor')
  get backgroundColor(): string {
    return this.active ? '#007bff' : '#f8f9fa';
  }

  @HostListener('click', ['$event'])
  handleClick(event: MouseEvent): void {
    // TypeScript现在会验证event参数类型
    console.log('Mouse event:', event.clientX, event.clientY);
  }

  @HostListener('keydown', ['$event.key'])
  handleKeyDown(key: string): void {
    // 类型检查确保key是string类型
    if (key === 'Enter' || key === ' ') {
      this.toggle();
    }
  }

  active = false;

  toggle(): void {
    this.active = !this.active;
  }
}

// 指令中的类型安全Host绑定
@Directive({
  selector: '[appTypedDirective]',
  host: {
    '[class.directive-active]': 'isDirectiveActive',
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()'
  }
})
export class TypedDirective {
  isDirectiveActive = false;

  onMouseEnter(): void {
    this.isDirectiveActive = true;
  }

  onMouseLeave(): void {
    this.isDirectiveActive = false;
  }
}
```

### 3. CLI 工具改进

- **诊断功能**: 增强的错误诊断和捕获工具
- **开发体验**: 更友好的错误提示和建议

## 📋 样式指南更新

### 文件命名约定变更

- **重大更新**: Angular样式指南发布重大更新
- **简化原则**: 移除大量推荐规则，专注于最重要的规范
- **命名变更**: 文件命名约定改变，移除大部分后缀要求
- **访问地址**: [angular.dev/style-guide](https://angular.dev/style-guide)

## ⚠️ 重大变更 (Breaking Changes)

### 1. 结构指令弃用

- **弃用内容**: `*ngIf`、`*ngFor`、`*ngSwitch` 等结构指令正式弃用
- **替代方案**: 使用新的控制流语法 (`@if`、`@for`、`@switch`)
- **注意**: 只有这三个特定指令被弃用，其他结构指令仍然支持
- **迁移建议**: 逐步迁移现有代码到新语法

**迁移示例**:

```html
<!-- 旧语法 (已弃用) -->
<div *ngIf="user.isLoggedIn; else loginTemplate">
  <span>欢迎, {{ user.name }}!</span>
</div>
<ng-template #loginTemplate>
  <span>请先登录</span>
</ng-template>

<div *ngFor="let item of items; trackBy: trackByFn; let i = index">
  {{ i }}: {{ item.name }}
</div>

<div [ngSwitch]="status">
  <div *ngSwitchCase="'loading'">加载中...</div>
  <div *ngSwitchCase="'success'">成功</div>
  <div *ngSwitchDefault>默认</div>
</div>

<!-- 新语法 (推荐) -->
@if (user.isLoggedIn) {
<div>
  <span>欢迎, {{ user.name }}!</span>
</div>
} @else {
<div>
  <span>请先登录</span>
</div>
}

@for (item of items; track trackByFn($index, item); let i = $index) {
<div>{{ i }}: {{ item.name }}</div>
} @empty {
<div>暂无数据</div>
}

@switch (status) {
@case ('loading') {
<div>加载中...</div>
}
@case ('success') {
<div>成功</div>
}
@default {
<div>默认</div>
}
}
```

**组件迁移示例**:

```typescript
// 迁移前的组件
@Component({
  selector: 'app-old-syntax',
  template: `
    <div class="container">
      <div *ngIf="isLoading; else contentTemplate">
        <div class="spinner">加载中...</div>
      </div>
      
      <ng-template #contentTemplate>
        <ul *ngIf="items.length > 0; else emptyTemplate">
          <li *ngFor="let item of items; trackBy: trackById; let isLast = last"
              [class.last]="isLast">
            <div [ngSwitch]="item.type">
              <span *ngSwitchCase="'text'">📝 {{ item.content }}</span>
              <img *ngSwitchCase="'image'" [src]="item.url" [alt]="item.content">
              <span *ngSwitchDefault>❓ 未知类型</span>
            </div>
          </li>
        </ul>
        
        <ng-template #emptyTemplate>
          <div class="empty">暂无数据</div>
        </ng-template>
      </ng-template>
    </div>
  `
})
export class OldSyntaxComponent {
  isLoading = false;
  items: Item[] = [];

  trackById(index: number, item: Item): any {
    return item.id;
  }
}

// 迁移后的组件
@Component({
  selector: 'app-new-syntax',
  template: `
    <div class="container">
      @if (isLoading) {
        <div class="spinner">加载中...</div>
      } @else {
        @if (items.length > 0) {
          <ul>
            @for (item of items; track item.id; let isLast = $last) {
              <li [class.last]="isLast">
                @switch (item.type) {
                  @case ('text') {
                    <span>📝 {{ item.content }}</span>
                  }
                  @case ('image') {
                    <img [src]="item.url" [alt]="item.content">
                  }
                  @default {
                    <span>❓ 未知类型</span>
                  }
                }
              </li>
            }
          </ul>
        } @else {
          <div class="empty">暂无数据</div>
        }
      }
    </div>
  `
})
export class NewSyntaxComponent {
  isLoading = false;
  items: Item[] = [];
}
```

### 2. TypeScript 表达式支持变更

- **void 属性**: 如果组件有名为 `void` 的属性，需要使用 `{{this.void}}` 语法
- **表达式限制**: 某些TypeScript表达式仍不支持，包括可选链操作符

**示例代码**:

```typescript
// void属性处理
@Component({
  selector: 'app-void-example',
  template: `
    <!-- 错误写法 -->
    <!-- <div>{{ void }}</div> -->
    
    <!-- 正确写法 -->
    <div>{{ this.void }}</div>
    
    <!-- 或者重命名属性避免冲突 -->
    <div>{{ voidValue }}</div>
  `
})
export class VoidExampleComponent {
  void = '这是一个名为void的属性';
  voidValue = '重命名后的属性';
}

// 表达式限制示例
@Component({
  selector: 'app-expression-limits',
  template: `
    <!-- 可选链操作符仍不完全支持 -->
    <!-- 避免使用: {{ user?.profile?.name }} -->
    
    <!-- 推荐写法 -->
    @if (user && user.profile) {
      <div>{{ user.profile.name }}</div>
    }
    
    <!-- 或使用Signal -->
    <div>{{ userName() }}</div>
    
    <!-- 复杂表达式建议在组件中处理 -->
    <div>{{ getDisplayName() }}</div>
  `
})
export class ExpressionLimitsComponent {
  user: { profile?: { name: string } } | null = null;

  // 使用Signal处理复杂逻辑
  userName = computed(() => {
    return this.user?.profile?.name ?? '未知用户';
  });

  // 在组件方法中处理复杂表达式
  getDisplayName(): string {
    if (!this.user) return '游客';
    if (!this.user.profile) return '未设置资料';
    return this.user.profile.name || '匿名用户';
  }
}

// 类型安全的替代方案
@Component({
  selector: 'app-type-safe',
  template: `
    <div>{{ safeUserName }}</div>
    <div>{{ userAge || '年龄未知' }}</div>
  `
})
export class TypeSafeComponent {
  private user: User | null = null;

  get safeUserName(): string {
    return this.user?.profile?.name ?? '未知用户';
  }

  get userAge(): number | null {
    return this.user?.age ?? null;
  }
}

interface User {
  profile?: {
    name: string;
  };
  age?: number;
}
```

### 3. API 移除和变更

- **公共API**: 部分公共API被移除
- **类型定义**: Angular类型定义发生变化
- **依赖更新**: 依赖项版本更新可能包含破坏性变更

## 🛠️ 升级指南

### 升级前准备

1. **备份项目**: 确保代码已提交到版本控制系统
2. **依赖检查**: 检查第三方库的Angular 20兼容性
3. **测试覆盖**: 确保有充分的测试覆盖率

### 升级步骤

1. **更新Angular CLI**:
   ```bash
   npm install -g @angular/cli@20
   ```

2. **更新项目依赖**:
   ```bash
   ng update @angular/core @angular/cli
   ```

3. **代码迁移**:

- 使用 `ng update` 自动迁移
- 手动替换弃用的结构指令
- 更新样式指南相关的文件命名

### 迁移检查清单

- [ ] 替换 `*ngIf` 为 `@if`
- [ ] 替换 `*ngFor` 为 `@for`
- [ ] 替换 `*ngSwitch` 为 `@switch`
- [ ] 检查 `void` 属性使用
- [ ] 更新文件命名约定
- [ ] 测试应用功能完整性

## 🔮 未来展望

### 服务端渲染增强

- **Nitro集成**: 评估Nitro框架集成可能性
- **部署选项**: 更多部署选项支持
- **运行时兼容**: 改进不同运行时的SSR兼容性
- **文件路由**: 基于文件的路由系统

### 持续改进

- **性能优化**: 持续的性能改进和优化
- **开发体验**: 更好的开发者工具和体验
- **生态系统**: 扩展Angular生态系统

## 📚 参考资源

- [Angular官方发布公告](https://blog.angular.dev/announcing-angular-v20-b5c9c06cf301)
- [Angular样式指南](https://angular.dev/style-guide)
- [Angular路线图](https://angular.dev/roadmap)
- [版本发布策略](https://angular.dev/reference/releases)

## 💡 最佳实践建议

1. **渐进式升级**: 不要急于一次性升级所有功能
2. **测试优先**: 每个迁移步骤后进行充分测试
3. **文档更新**: 及时更新项目文档和团队培训
4. **社区资源**: 关注社区最佳实践和经验分享
5. **性能监控**: 升级后持续监控应用性能表现

---

*本文档基于Angular 20正式发布信息整理，建议定期关注官方更新获取最新信息。*
