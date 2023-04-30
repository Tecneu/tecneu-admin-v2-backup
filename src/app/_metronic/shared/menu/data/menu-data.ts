import {MenuItem} from "../models/menu-item.interface";

export const MENU_ITEMS: MenuItem[] = [
  {
    type: 'link',
    route: '/dashboard',
    label: 'MENU.DASHBOARD',
    icon: 'element-11',
  },
  {
    type: 'link',
    route: '/builder',
    label: 'Layout Builder',
    icon: 'switch',
  },
  {
    type: 'separator',
    label: 'Crafted',
  },
  {
    type: 'accordion',
    label: 'Pages',
    icon: 'element-plus',
    children: [
      {
        type: 'accordion',
        label: 'Profile',
        children: [
          {
            type: 'link',
            route: '/crafted/pages/profile/overview',
            label: 'Overview',
          },
          {
            type: 'link',
            route: '/crafted/pages/profile/projects',
            label: 'Projects',
          },
          {
            type: 'link',
            route: '/crafted/pages/profile/campaigns',
            label: 'Campaigns',
          },
          {
            type: 'link',
            route: '/crafted/pages/profile/documents',
            label: 'Documents',
          },
          {
            type: 'link',
            route: '/crafted/pages/profile/connections',
            label: 'Connections',
          },
        ],
      },
      {
        type: 'accordion',
        label: 'Wizards',
        children: [
          {
            type: 'link',
            route: '/crafted/pages/wizards/horizontal',
            label: 'Horizontal',
          },
          {
            type: 'link',
            route: '/crafted/pages/wizards/vertical',
            label: 'Vertical',
          },
        ],
      },
    ],
  },
  {
    type: 'accordion',
    label: 'Accounts',
    icon: 'profile-circle',
    children: [
      {
        type: 'link',
        route: '/crafted/account/overview',
        label: 'Overview',
      },
      {
        type: 'link',
        route: '/crafted/account/settings',
        label: 'Settings',
      },
    ],
  },
  {
    type: 'accordion',
    label: 'Errors',
    icon: 'phone',
    children: [
      {
        type: 'link',
        route: '/error/404',
        label: 'Error 404',
      },
      {
        type: 'link',
        route: '/error/500',
        label: 'Error 500',
      },
    ],
  },
  {
    type: 'accordion',
    label: 'Widgets',
    icon: 'element-7',
    children: [
      {
        type: 'link',
        route: '/crafted/widgets/lists',
        label: 'Lists',
      },
      {
        type: 'link',
        route: '/crafted/widgets/statistics',
        label: 'Statistics',
      },
      {
        type: 'link',
        route: '/crafted/widgets/charts',
        label: 'Charts',
      },
      {
        type: 'link',
        route: '/crafted/widgets/mixed',
        label: 'Mixed',
      },
      {
        type: 'link',
        route: '/crafted/widgets/tables',
        label: 'Tables',
      },
      {
        type: 'link',
        route: '/crafted/widgets/feeds',
        label: 'Feeds',
      },
    ]
  },
  {
    type: 'separator',
    label: 'Apps',
  },
  {
    type: 'accordion',
    label: 'Chat',
    icon: 'message-text-2',
    children: [
      {
        type: 'link',
        route: '/apps/chat/private-chat',
        label: 'Private Chat',
      },
      {
        type: 'link',
        route: '/apps/chat/group-chat',
        label: 'Group Chat',
      },
      {
        type: 'link',
        route: '/apps/chat/drawer-chat',
        label: 'Drawer Chat',
      }
    ]
  }
]
