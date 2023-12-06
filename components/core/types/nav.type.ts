/**
 * 导航列表
 * @description level -- 用来控制次级导航缩进
 */
export interface ZxNavList {
  level?: number;
  title: string;
  icon?: string;
  open?: boolean;
  selected?: boolean;
  disabled?: boolean;
  children?: ZxNavList[];
}
