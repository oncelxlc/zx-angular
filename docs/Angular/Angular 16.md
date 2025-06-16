
# Angular 16 版本更新详解

Angular 16 是 Google 于 2023 年发布的重要版本，带来了多个关键的改进和性能优化。以下是主要变更的详细列表：

## 🚀 1. Signals（实验性）
Angular 16 引入了 Signals，用于简化响应式编程，支持响应式状态管理的新范式。

```ts
import { signal, computed, effect } from '@angular/core';

const count = signal(0);
const doubleCount = computed(() => count() * 2);

effect(() => console.log(doubleCount()));
```

- 替代 RxJS 在组件内的使用场景
- 更简洁的响应式表达

## ⚡ 2. SSR + Hydration 重构
Angular 16 全面改写了服务器端渲染（SSR）和 hydration 的机制：

- 更快的页面首次加载（首次可交互时间减少多达 45%）
- 增量式 Hydration 支持

```ts
provideClientHydration()
```

- Angular Universal 更加无缝集成

## 💾 3. 更快的构建性能
- 使用 esbuild 提高构建速度
- `ng build` 和 `ng serve` 更快、更流畅
- 支持 Vite（实验性）

## 🧠 4. 更好的开发体验
- 支持独立组件的 `@CanActivateFn`, `@ResolveFn`
- 表单增强（typed forms）正式稳定
- Angular DevTools 支持 Signals
- 更好的错误提示与诊断

## 📦 5. 依赖注入增强
- `inject()` 可在构造函数外使用（包括函数组件）
- 支持在类外使用 `DestroyRef`, `EffectRef`

## 🔒 6. 更严格的类型检查
- Typed reactive forms 正式版
- 更全面的类型推导（如 `*ngFor` 结构指令中）

## 🧹 7. 废弃与移除
- 移除 View Engine 支持（完全切换到 Ivy）
- 弃用 `APP_INITIALIZER` 的异步函数返回非 Promise 情况

## 📚 8. 相关工具更新
- Angular CLI 更新支持更高效构建
- Angular DevKit 支持 esbuild

---

## 📌 升级建议

```bash
ng update @angular/core@16 @angular/cli@16
```

## 🔗 参考资料
- [Angular 官方博客](https://blog.angular.io)
- [Angular 16 更新日志](https://github.com/angular/angular/blob/main/CHANGELOG.md)
