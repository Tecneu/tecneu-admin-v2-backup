export interface MenuItem {
  type: 'separator' | 'link' | 'accordion';
  label?: string;
  route?: string;
  icon?: string;
  children?: MenuItem[];
}
