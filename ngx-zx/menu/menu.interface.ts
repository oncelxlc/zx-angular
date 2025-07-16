export interface MenuItem {
  key: string;
  label: string;
  icon?: string;
  children?: MenuItem[];
  disabled?: boolean;
  type?: "item" | "submenu" | "divider" | "group";
}

export interface MenuConfig {
  mode: "vertical" | "horizontal" | "inline";
  theme: "light" | "dark";
  selectedKey: string;
  openKeys: string[];
  inlineIndent: number;
}
