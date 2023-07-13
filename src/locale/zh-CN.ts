import localeLogin from '@/views/admin/login/locale/zh-CN';
import localeRegister from '@/views/admin/register/locale/zh-CN';
import localeForget from '@/views/admin/forget-password/locale/zh-CN';

import localeWorkplace from '@/views/admin/dashboard/locale/zh-CN';

import localeSuccess from '@/views/admin/result/success/locale/zh-CN';
import localeError from '@/views/admin/result/error/locale/zh-CN';

import locale403 from '@/views/admin/exception/403/locale/zh-CN';
import locale404 from '@/views/admin/exception/404/locale/zh-CN';
import locale500 from '@/views/admin/exception/500/locale/zh-CN';

import localeUserSetting from '@/views/admin/user/info/locale/zh-CN';

import localeSettings from './zh-CN/settings';

export default {
  'menu.dashboard': '仪表盘',
  'menu.server.dashboard': '仪表盘-服务端',
  'menu.server.workplace': '工作台-服务端',
  'menu.server.monitor': '实时监控-服务端',
  'menu.list': '列表页',
  'menu.result': '结果页',
  'menu.exception': '异常页',
  'menu.form': '表单页',
  'menu.profile': '详情页',
  'menu.visualization': '数据可视化',
  'menu.user': '用户相关',
  'menu.arcoWebsite': 'Arco Design',
  'menu.faq': '常见问题',
  'navbar.docs': '文档中心',
  'navbar.action.locale': '切换为中文',
  ...localeSettings,
  ...localeLogin,
  ...localeRegister,
  ...localeForget,
  ...localeWorkplace,

  ...localeSuccess,
  ...localeError,
  ...locale403,
  ...locale404,
  ...locale500,
  ...localeUserSetting,
};
