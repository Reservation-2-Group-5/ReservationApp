export default [{
  label: 'Home',
  icon: 'pi pi-fw pi-home',
  route: '/',
  auth: false,
}, {
  label: 'Inventory',
  icon: 'pi pi-fw pi-list',
  route: '/inventory',
  auth: 'user',
}, {
  label: 'Rooms',
  icon: 'pi pi-fw pi-building',
  route: '/rooms',
  auth: 'user',
}, {
  label: 'Login',
  icon: 'pi pi-fw pi-user',
  route: '/login',
  auth: 'guest',
}, {
  label: 'Admin',
  icon: 'pi pi-fw pi-wrench',
  route: '/admin',
  auth: 'admin',
}, {
  label: 'Logout',
  icon: 'pi pi-fw pi-user',
  route: '/logout',
  auth: 'user',
}];
