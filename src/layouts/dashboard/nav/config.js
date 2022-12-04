// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'trang chủ',
    path: '/',
    icon: icon('ic_analytics'),
  },
  {
    title: 'tạo bài viết',
    path: '/bai-viet',
    icon: icon('ic_blog'),
  }
];

export default navConfig;
