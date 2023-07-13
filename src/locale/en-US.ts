import localeLogin from '@/views/admin/login/locale/en-US';
import localeRegister from '@/views/admin/register/locale/en-US';
import localeForget from '@/views/admin/forget-password/locale/en-US';

import localeWorkplace from '@/views/admin/dashboard/locale/en-US';

import localeSuccess from '@/views/admin/result/success/locale/en-US';
import localeError from '@/views/admin/result/error/locale/en-US';

import locale403 from '@/views/admin/exception/403/locale/en-US';
import locale500 from '@/views/admin/exception/500/locale/en-US';

import localeUserSetting from '@/views/admin/user/info/locale/en-US';

import localeSettings from './en-US/settings';

export default {
  'menu.dashboard': 'Dashboard',
  'menu.server.dashboard': 'Dashboard-Server',
  'menu.server.workplace': 'Workplace-Server',
  'menu.server.monitor': 'Monitor-Server',
  'menu.list': 'List',
  'menu.result': 'Result',
  'menu.exception': 'Exception',
  'menu.form': 'Form',
  'menu.profile': 'Profile',
  'menu.visualization': 'Data Visualization',
  'menu.user': 'User Center',
  'menu.arcoWebsite': 'Arco Design',
  'menu.faq': 'FAQ',
  'navbar.docs': 'Docs',
  'navbar.action.locale': 'Switch to English',
  ...localeSettings,
  ...localeLogin,
  ...localeRegister,
  ...localeForget,
  ...localeWorkplace,

  ...localeSuccess,
  ...localeError,
  ...locale403,
  ...locale500,
  ...localeUserSetting,
};
