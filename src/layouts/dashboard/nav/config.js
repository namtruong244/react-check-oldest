// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'bài viết',
    path: '/bai-viet',
    icon: icon('ic_file'),
  },
  {
    title: 'tạo bài viết',
    path: '/tao-bai-viet',
    icon: icon('ic_blog'),
  },
  {
    title: 'thống kê',
    path: '/thong-ke',
    icon: icon('ic_analytics'),
  },
  // {
  //   title: 'Hướng dẫn',
  //   path: '/huong-dan',
  //   icon: icon('ic_user'),
  // }
];

export default navConfig;
