import { Link } from '@umijs/max';

const BreadCrumbItem = (route: any, _params: any, routes: any, paths: any) => {
  const last = routes.indexOf(route) === routes.length - 1;
  if (last) {
    return <span>{route.title}</span>;
  }
  return (
    <Link to={route.path.startsWith('/') ? route.path : `/${route.path}`}>
      {route.title}
    </Link>
  );
};

export default BreadCrumbItem;
