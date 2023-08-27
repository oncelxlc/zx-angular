# 开发 UI 时使用的相关命令

## 创建组件

name 为组件名,projectName 为项目名, `--path=[path]` 更换组件创建位置, `--changeDetection=OnPush` 更换逐渐的检查变更方式为 *OnPush*

``` bash
  nx g @nx/angular:component --name=[name] --project=[projectName] --export=true --standalone=true
```

## 创建 pipe

``` bash
nx g @nx/angualr:pipe #pipe
```
