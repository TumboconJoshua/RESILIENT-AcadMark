import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '@/views/teacher/Dashboard.vue';
import Classes from '@/views/teacher/classes/Classes.vue';
import Class from '@/views/teacher/classes/Class.vue';
import Forms from '@/views/teacher/Forms.vue';
import Profile from '@/views/teacher/Profile.vue';
import Login from '@/views/Login.vue';
import adminDashboard from '@/views/admin/Dashboard.vue';
import MasterList from '@/views/admin/MasterList.vue';
import AddClass from '@/views/admin/AddClass.vue';
import Record from '@/views/admin/Record.vue';
import AddStudent from '@/views/admin/AddStudent.vue';

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: '/classes',
    name: 'classes',
    component: Classes,
    meta: { requiresAuth: true },
  },
  {
    path: '/class/:trackStand/:className/:subjectName/:gradeLevel/:subject_id/:classType',
    name: 'class',
    component: Class,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/forms',
    name: 'forms',
    component: Forms,
    meta: { requiresAuth: true },
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile,
    meta: { requiresAuth: true },
  },
  // Admin routes
  {
    path: '/admin/dashboard',
    name: 'admin-dashboard',
    component: adminDashboard,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/master-list',
    name: 'admin-master-list',
    component: MasterList,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/add-class',
    name: 'admin-add-class',
    component: AddClass,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/record',
    name: 'admin-record',
    component: Record,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/add-student',
    name: 'admin-add-student',
    component: AddStudent,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const user = localStorage.getItem('user');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  if (to.path === '/login' && user) {
    next('/dashboard');
    return;
  }

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!user) {
      next('/login');
    } else if (
      to.matched.some((record) => record.meta.requiresAdmin) &&
      !isAdmin
    ) {
      next('/dashboard'); // Redirect non-admin users to dashboard
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
