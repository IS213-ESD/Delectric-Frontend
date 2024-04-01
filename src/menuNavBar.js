import {
  mdiMenu,
  mdiClockOutline,
  mdiCloud,
  mdiCrop,
  mdiAccount,
  mdiCogOutline,
  mdiEmail,
  mdiLogout,
  mdiThemeLightDark,
  mdiGithub,
  mdiReact,
  mdiFaceManProfile,
} from '@mdi/js';

export default [
  // {
  //   icon: mdiMenu,
  //   label: 'Sample menu',
  //   menu: [
  //     {
  //       icon: mdiClockOutline,
  //       label: 'Item One'
  //     },
  //     {
  //       icon: mdiCloud,
  //       label: 'Item Two'
  //     },
  //     {
  //       isDivider: true
  //     },
  //     {
  //       icon: mdiCrop,
  //       label: 'Item Last'
  //     }
  //   ]
  // },
  {
    isCurrentUser: true,
    menu: [
      {
        icon: mdiAccount,
        label: 'My Profile',
        to: '/profile',
      },

      {
        icon: mdiLogout,
        label: 'Log Out',
        isLogout: true,
      },
    ],
  },
  {
    icon: mdiGithub,
    label: 'GitHub',
    isDesktopNoLabel: true,
    href: 'https://github.com/IS213-ESD',
    target: '_blank',
  },
];
