# Angular 19 版本详细变化文档

## 概述

Angular 19 于 2024年11月19日发布，这是一个重要的版本更新，引入了许多新功能和改进，旨在提升应用性能、简化开发流程并增强开发者体验。本版本的重点是反应式编程、性能优化和开发工具的改进。

## 主要新特性

### 1. 新的反应式原语：linkedSignal（实验性）

Angular 19 引入了 `linkedSignal`，这是一个可写的信号，能够响应源信号的变化并基于计算值重置自身。

```typescript
export declare function linkedSignal<S, D>(options: {
  source: () => S;
  computation: (source: NoInfer<S>, previous?: {
    source: NoInfer<S>;
    value: NoInfer<D>;
  }) => D;
  equal?: ValueEqualityFn<NoInfer<D>>;
}): WritableSignal<D>;
```

**使用示例：**
```typescript
protected readonly colorOptions = signal<Color[]>([
  { id: 1, name: 'Red' },
  { id: 2, name: 'Green' },
  { id: 3, name: 'Blue' }
]);

protected favoriteColorId = linkedSignal<Color[], number | null>({
  source: this.colorOptions,
  computation: (source, previous) => {
    if(previous?.value) {
      return source.some(color => color.id === previous.value) ? previous.value : null;
    }
    return null;
  }
});
```

### 2. 新的资源管理 API：resource（实验性）

Angular 引入了 `resource()` API，用于管理异步操作，具有内置的竞态条件防护、加载状态跟踪、错误处理等功能。

```typescript
fruitId = signal<string>('apple-id-1');

fruitDetails = resource({
  request: this.fruitId,
  loader: async (params) => {
    const fruitId = params.request;
    const response = await fetch(`https://api.example.com/fruit/${fruitId}`, {
      signal: params.abortSignal
    });
    return await response.json() as Fruit;
  }
});

// 访问资源状态
protected isFruitLoading = this.fruitDetails.isLoading;
protected fruit = this.fruitDetails.value;
protected error = this.fruitDetails.error;
```

**RxJS 互操作性：**
```typescript
fruitDetails = rxResource({
  request: this.fruitId,
  loader: (params) => this.httpClient.get<Fruit>(`https://api.example.com/fruit/${params.request}`)
});
```

### 3. effect() 函数的重要更新

- **移除 `allowSignalWrites` 标志**：现在默认允许在 effect 中设置信号
- **执行时机变更**：effects 现在作为变更检测周期的一部分执行，而不是微任务队列

```typescript
// Angular 19 中不再需要 allowSignalWrites 标志
effect(() => {
  console.log(this.users());
  // 现在可以直接设置信号
  this.someSignal.set(newValue);
});
```

### 4. 新的模板变量语法：@let（稳定版）

Angular 19 中 `@let` 语法成为稳定功能，允许在模板中定义和重用变量。

```html
@let userName = 'Jane Doe';
<h1>Welcome, {{ userName }}</h1>

<input #userInput type="text">
@let greeting = 'Hello, ' + userInput.value;
<p>{{ greeting }}</p>

@let userData = userObservable$ | async;
<div>User details: {{ userData.name }}</div>
```

### 5. 渐进式水合（Incremental Hydration）（实验性）

基于 defer 块的新水合方式，允许按需水合应用程序的部分内容。

**配置启用：**
```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(
      withIncrementalHydration()
    )
  ]
};
```

**使用示例：**
```html
@defer (hydrate on hover) {
  <app-hydrated-cmp />
}
```

**支持的触发器类型：**
- `idle`
- `interaction`
- `immediate`
- `timer(ms)`
- `hover`
- `viewport`
- `never`
- `when {{ condition }}`

### 6. 新的 afterRenderEffect 函数（实验性）

用于处理组件渲染完成后的副作用。

```typescript
counter = signal(0);

constructor() {
  afterRenderEffect(() => {
    console.log('after render effect', this.counter());
  });
  
  afterRender(() => {
    console.log('after render', this.counter());
  });
}
```

## 路由改进

### 1. RouterOutlet 新增 routerOutletData 输入

提供了父组件向子组件传递数据的新方式。

**父组件：**
```html
<router-outlet [routerOutletData]="routerOutletData()" />
```

**子组件：**
```typescript
export class ChildComponent {
  readonly routerOutletData: Signal<MyType> = inject(ROUTER_OUTLET_DATA);
}
```

### 2. RouterLink 支持 UrlTree

RouterLink 指令现在接受 UrlTree 对象类型。

```html
<a [routerLink]="homeUrlTree">Home</a>
```

### 3. 默认查询参数处理策略

可以在 `provideRouter()` 配置中直接设置默认的查询参数处理策略。

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withRouterConfig({
      defaultQueryParamsHandling: 'preserve'
    }))
  ]
};
```

### 4. 服务器路由配置（实验性）

新的服务器路由配置 API，允许开发者定义特定路由的渲染方式。

```typescript
import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRouteConfig: ServerRoute[] = [
  { path: '/login', renderMode: RenderMode.Server },
  { path: '/fruits', renderMode: RenderMode.Prerender },
  { path: '/**', renderMode: RenderMode.Client }
];
```

## 开发体验改进

### 1. 默认独立组件

Angular 19 中，`standalone: true` 成为组件、指令和管道的默认设置。

```typescript
// Angular 19 中默认为独立组件
@Component({
  imports: [],
  selector: 'home',
  template: './home-component.html'
})
export class HomeComponent {}

// 非独立组件需要显式标记
@Component({
  selector: 'home',
  template: './home-component.html',
  standalone: false
})
export class NonStandaloneComponent {}
```

### 2. 新的迁移工具

**依赖注入迁移：**
```bash
ng g @angular/core:inject
```

从构造函数注入迁移到 inject() 函数：
```typescript
// 迁移前
constructor(private productService: ProductService) {}

// 迁移后
private productService = inject(ProductService);
```

**路由懒加载迁移：**
```bash
ng g @angular/core:route-lazy-loading
```

```typescript
// 迁移前
{ path: 'products', component: ProductsComponent }

// 迁移后
{ 
  path: 'products', 
  loadComponent: () => import('./products/products.component').then(m => m.ProductsComponent)
}
```

### 3. 初始化器提供者函数

新的辅助函数简化初始化器设置：

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(() => {
      console.log('app initialized');
    }),
    provideEnvironmentInitializer(() => {
      console.log('environment initialized');
    }),
    providePlatformInitializer(() => {
      console.log('platform initialized');
    })
  ]
};
```

## 测试改进

### 1. fakeAsync 中的自动 flush()

Angular 19 中，`fakeAsync()` 测试在结束时自动执行 `flush()` 函数。

```typescript
it('async test description', fakeAsync(() => {
  // 测试代码
  // 不再需要手动调用 flush()
}));
```

## 开发工具增强

### 1. 新的 Angular 诊断

新增两个诊断功能：

- **未调用函数**：标记事件绑定中未调用的函数
- **未使用的独立导入**：识别导入但未使用的独立组件、指令或管道

### 2. 严格独立标志

新的 `strictStandalone` 标志强制使用独立组件。

```json
{
  "angularCompilerOptions": {
    "strictStandalone": true
  }
}
```

### 3. Playwright 支持

Angular CLI 现在支持 Playwright 作为 e2e 测试选项。

```bash
ng e2e
ng add playwright-ng-schematics
```

### 4. Angular Language Service 增强

支持最新功能：
- 未使用独立导入的诊断
- @input 到 signal-input 的迁移
- signal 查询的迁移
- 模板内未导入指令的自动完成

## RxJS 互操作性改进

### 1. toSignal 的等值函数

`toSignal` 函数现在支持自定义等值函数：

```typescript
const arraySubject$ = new Subject<number[]>();

const arraysAreEqual = (a: number[], b: number[]): boolean => {
  return a.length === b.length && a.every((value, index) => value === b[index]);
};

const arraySignal = toSignal(arraySubject$, {
  initialValue: [1, 2, 3],
  equals: arraysAreEqual
});
```

## TypeScript 支持

### 1. 版本支持

- 新增支持 TypeScript 5.6
- 移除对 5.5 以下版本的支持

### 2. 关键特性

- **推断类型谓词**：TypeScript 自动推断类型谓词
- **常量索引访问的控制流收窄**：改进对 `obj[key]` 表达式的类型收窄
- **禁止空值和真值检查**：对始终为真的检查发出错误

### 3. 隔离模块支持

支持 TypeScript 的 `isolatedModules`，可提升生产构建性能达 10%：

```json
{
  "compilerOptions": {
    "isolatedModules": true
  }
}
```

## 性能优化

### 1. Zoneless 支持增强

- 服务器端渲染中的 zoneless 支持
- 改进的边缘情况处理
- 提供 schematic 来搭建 zoneless 项目

### 2. 热模块替换（HMR）

改进的热模块替换支持，提升开发体验。

## 新组件和功能

### 1. 时间选择器组件

新增时间选择器组件，提供更好的时间输入体验。

## 向后兼容性

### 1. 自动迁移

`ng update` 过程中会自动调整 standalone 标志设置，确保兼容性。

### 2. 渐进式采用

大多数新功能都是可选的或实验性的，允许渐进式采用。

## 总结

Angular 19 是一个重要的版本更新，重点关注：

1. **反应式编程**：linkedSignal、resource API 等新的反应式原语
2. **性能优化**：渐进式水合、zoneless 支持、构建时间优化
3. **开发体验**：默认独立组件、改进的迁移工具、增强的诊断
4. **现代化**：TypeScript 5.6 支持、隔离模块、新的模板语法

这些改进使 Angular 应用更快、更高效，同时为开发者提供了更好的开发体验。实验性功能为未来版本的创新奠定了基础，体现了 Angular 团队对持续改进的承诺。

## 升级建议

1. **评估当前项目**：检查使用的 Angular 版本和 TypeScript 版本
2. **渐进式升级**：首先升级到 Angular 19，然后逐步采用新功能
3. **测试充分**：特别关注 effect() 函数的变更和独立组件的默认行为
4. **利用迁移工具**：使用提供的 schematics 来自动化迁移过程
5. **实验性功能**：在非生产环境中试用实验性功能，为未来版本做准备
