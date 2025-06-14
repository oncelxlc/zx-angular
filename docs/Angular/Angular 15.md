# Angular 15 更新详解

Angular 15 于 2022 年 11 月发布，带来了大量提升开发体验、构建效率与性能的新特性，特别是正式支持独立组件架构（Standalone Components）。

---

## 🌟 重要更新概览

- ✅ **Standalone Components 正式发布**
- ✅ 简化路由配置
- ✅ 新增指令组合 API（实验性）
- ✅ `NgOptimizedImage` 图片优化指令
- ✅ CLI 与测试支持全面增强
- ✅ 全面使用 MDC 构建 Material UI
- ✅ 更强类型推导与错误提示
- ✅ 实验性支持 ESBuild

---

## 📦 核心框架（@angular/core）

### 1. 独立组件正式发布

```ts
@Component({
  standalone: true,
  selector: 'app-hello',
  template: `<h1>Hello Standalone!</h1>`,
})
export class HelloComponent {}
```

使用独立组件启动应用：

```ts
import { bootstrapApplication } from '@angular/platform-browser';

bootstrapApplication(AppComponent);
```

---

### 2. 指令和管道也可 Standalone

```ts
@Directive({
  standalone: true,
  selector: '[highlight]',
})
export class HighlightDirective {}
```

---

### 3. 简化路由配置（支持 lazy-load 独立组件）

```ts
const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home.component').then(m => m.HomeComponent),
  },
];
```

---

### 4. 指令组合 API（Directive Composition API）*实验性*

将多个指令合并成一个复合指令：

```ts
@Directive({
  selector: '[enhanced]',
  hostDirectives: [NgIf, NgFor],
})
class EnhancedDirective {}
```

---

### 5. NgOptimizedImage 图片优化指令

提升图片加载性能与可访问性：

```html
<img ngSrc="assets/banner.jpg" width="600" height="400" />
```

功能包括：
- 懒加载
- 自动格式选择
- 构建时尺寸校验

---

## ⚙️ Angular CLI 更新

### 6. 支持生成独立组件

```bash
ng generate component hello --standalone
```

### 7. 更简化的项目结构与路由支持

- 支持默认创建 standalone 应用
- 路由配置更简洁

---

## 💅 Angular Material（@angular/material）

### 8. 全面切换到 MDC 架构

- 所有组件使用 Material Design Components 实现
- 更现代化的样式和增强的无障碍支持

---

## 🧪 测试增强

### 9. TestBed 支持独立组件导入

```ts
TestBed.configureTestingModule({
  imports: [HelloComponent],
});
```

无需定义模块即可进行单元测试。

---

## 🧠 类型安全增强

### 10. 更强模板类型推导与 IDE 支持

- 更好的类型检查提示
- 推荐使用 `strict` 模式
- 更好地支持 RxJS 类型推导

---

## 🛠 构建优化与工具链更新

### 11. 实验性支持 ESBuild

- 构建速度更快
- 适用于微前端与 SSR 场景

### 12. SSR（Angular Universal）优化

- 更快的首次渲染（FCP）
- 支持 `bootstrapApplication()` 与 standalone 架构

---

## ❌ 弃用与移除项

| 功能/API | 状态 | 建议 |
|----------|------|------|
| `platformBrowserDynamic().bootstrapModule()` | 可选弃用 | 使用 `bootstrapApplication()` |
| `ng generate module` | 可选弃用 | 使用 standalone 架构 |
| View Engine | 已移除 | Ivy 成为唯一渲染引擎 |

---

## 📚 升级指南

升级命令：

```bash
ng update @angular/core@15 @angular/cli@15
```

建议步骤：
- 渐进式迁移至独立组件架构
- 升级 Angular Material
- 启用 `strict` 模式
- 清理弃用 API 使用

---

## 🔗 官方资源

- [🔗 Angular 15 发布博客](https://blog.angular.io/angular-v15-is-now-available-df7be7f2f4c8)
- [🔗 升级指南](https://update.angular.io/)
- [🔗 独立组件文档](https://angular.io/guide/standalone-components)

---
