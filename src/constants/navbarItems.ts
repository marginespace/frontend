import {
  CircleDollarSign,
  LayoutDashboard,
  BadgeDollarSign,
  TrendingUp,
  File,
  DropdownMore,
} from '@/components/ui/icons';

export const navbarItems = [
  {
    id: 1,
    label: 'Vaults',
    icon: CircleDollarSign,
    link: '/?sortOrder=DESC&sortBy=APY&tag=all',
    pathname: '/',
  },
  {
    id: 2,
    label: 'Dashboard',
    icon: LayoutDashboard,
    link: '/dashboard',
    pathname: '/dashboard',
  },
  {
    id: 3,
    label: 'Cubes',
    icon: BadgeDollarSign,
    link: '/earn?sortOrder=DESC&sortBy=APY&tag=all',
    pathname: '/earn',
  },
  {
    id: 4,
    label: 'Strategies',
    icon: TrendingUp,
    link: '#',
    pathname: '#',
  },
  {
    id: 6,
    icon: DropdownMore,
    nestedItems: [
      {
        id: 7,
        label: 'FAQ',
        link: '/faq',
        icon: CircleDollarSign,
      },
      {
        id: 5,
        label: 'Docs',
        icon: File,
        link: '#',
        pathname: '#',
      },
    ],
  },
];

export type TNavbarItem = (typeof navbarItems)[number];
