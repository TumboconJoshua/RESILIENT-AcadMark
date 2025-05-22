<template>
  <div
    class="sm:w-[1/5] md:w-1/5 lg:w-1/6 max-w-[220px] w-auto bg-blue md:pt-15 sm:pt-5 rounded-tr-[30px] sticky top-0 h-screen flex flex-col"
    style="box-shadow: rgba(0, 0, 0, 0.56) 0px 22px 70px 4px; flex-shrink: 0;">

    <div class="flex flex-col items-center m-4 gap-6">
      <div class="w-[130px] h-[130px] rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
        <img :src="imageSrc" alt="Teacher" class="w-full h-full object-cover" />
      </div>
      <div class="flex flex-col items-center gap-1.5">
        <p class="text-white text-center font-medium text-[20px]">{{ fullName }}</p>
        <p class="text-white text-center font-normal text-[16px]">{{ position }}</p>
      </div>
      <div class="w-full border-b-[0.5px] border-[#A6ACAF]"></div>
    </div>

    <nav class="flex flex-col w-full mt-5 relative flex-1">
      <div class="absolute left-0 w-full bg-[#3E6FA2] transitions-all duration-300 rounded-r-lg"
        :style="{ top: `${getActiveBarPosition()}px`, height: '42px' }"></div>

      <router-link v-for="(link, index) in links" :key="index" :to="link.path" class="nav-link relative py-2"
        :class="{ 'active': isLinkActive(link) }" @click="activeIndex = index">
        <i :class="[link.icon, 'w-6', 'h-6', 'mr-2', 'sm:hidden', 'md:block']"></i>
        <span class="font-semibold text-[17px]">{{ link.name }}</span>
      </router-link>
    </nav>

    <div class="mt-auto mb-8">
      <button @click="showLogoutModal = true"
        class="nav-link hover:text-red-500 transition-colors duration-200 flex items-center justify-center cursor-pointer">
        <img src="/assets/img/sidebar/logout.png" alt="Logout" class="w-6 h-6 mr-2" />
        <span class="font-semibold text-[16px]">Logout</span>
      </button>
    </div>

    <div v-if="showLogoutModal" class="modal-overlay">
      <div class="modal-content max-w-md z-50">
        <h2 class="text-xl font-bold mb-4 text-blue">Confirm Logout</h2>
        <p class="mb-6 text-gray">Are you sure you want to logout?</p>
        <div class="flex justify-end gap-3">
          <button @click="showLogoutModal = false"
            class="px-4 py-2 text-gray-600 hover:text-gray-800 font-semibold cursor-pointer">
            Cancel
          </button>
          <button @click="confirmLogout"
            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 font-semibold cursor-pointer">
            Logout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from 'vue-router';
import teacherData from '@/data/teachers.json';

const router = useRouter();
const activeIndex = ref(0);
const showLogoutModal = ref(false);

const imageSrc = ref("/assets/img/profile/avatar.png");

const isAdmin = localStorage.getItem('isAdmin') === 'true';

const teacherLinks = ref([
  { name: "Dashboard", path: "/dashboard", icon: "/assets/img/sidebar/dashboard.png" },
  { name: "Classes", path: "/classes", icon: "/assets/img/sidebar/classes.png" },
  { name: "Forms", path: "/forms", icon: "/assets/img/sidebar/form.png" },
  { name: "Profile", path: "/profile", icon: "/assets/img/sidebar/form.png" }
]);

const adminLinks = ref([
  { name: "Dashboard", path: "/admin/dashboard", icon: "fa-solid fa-chart-pie" },
  { name: "Add Student", path: "/admin/add-student", icon: "fa-solid fa-user-plus" },
  { name: "Record", path: "/admin/record", icon: "fa-solid fa-book" },
  { name: "Manage Class", path: "/admin/add-class", icon: "fa-solid fa-chalkboard" },
  { name: "Masterlist", path: "/admin/master-list", icon: "fa-solid fa-list" },
]);

const superadminLinks = ref([
  { name: "Dashboard", path: "/superadmin/dashboard", icon: "fa-solid fa-chart-pie" },
  { name: "Personnel", path: "/superadmin/personnel", icon: "fa-solid fa-users" },
  { name: "Grades", path: "/superadmin/grades", icon: "fa-solid fa-chart-line" },
  { name: "Students", path: "/superadmin/students", icon: "fa-solid fa-user-graduate" },
  { name: "Classes", path: "/superadmin/classes", icon: "fa-solid fa-chalkboard" },
  { name: "Lesson Plan", path: "/superadmin/lessonplan", icon: "fa-solid fa-clipboard-list" },
  { name: "Settings", path: "/superadmin/settings", icon: "fa-solid fa-book" },

]);

const links = computed(() => {
  return isAdmin ? adminLinks.value : teacherLinks.value;
});

const fullName = computed(() => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const middleInitial = user.middleName ? user.middleName[0] + '.' : '';
  const fullName = `${user.firstName} ${middleInitial} ${user.lastName}`;
  return fullName;
});

const updateImageFromStorage = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user.avatar) {
    imageSrc.value = user.avatar;
  }
};

watch(() => localStorage.getItem('user'), updateImageFromStorage, { deep: true });

// Listen for the avatarUpdated event
window.addEventListener('avatarUpdated', updateImageFromStorage);

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user.avatar) {
    imageSrc.value = user.avatar;
  }
});

const confirmLogout = () => {
  localStorage.clear();
  router.push('/login');
};

// --------------- New code to keep activeIndex synced with route ---------------
const updateActiveIndex = () => {
  // Find the index of the link that matches the current route or its parent
  activeIndex.value = links.value.findIndex(link => {
    if (link.path === '/classes') {
      return route.path === '/classes' ||
        (route.path.includes('/class') && !route.path.includes('/superadmin')) ||
        (route.path.includes('/classlist') && !route.path.includes('/superadmin'));
    }
    return route.path === link.path;
  });
};

// Watch for route changes and update activeIndex immediately on mount
watch(route, updateActiveIndex, { immediate: true });

const isLinkActive = (link) => {
  // Special handling for Classes section
  if (link.path === '/classes') {
    // Check if we're in any of the classes-related views, but not superadmin
    return route.path === '/classes' ||
      (route.path.includes('/class') && !route.path.includes('/superadmin')) ||
      (route.path.includes('/classlist') && !route.path.includes('/superadmin'));
  }
  return route.path === link.path;
};

const getActiveBarPosition = () => {
  const classesIndex = links.value.findIndex(link => link.path === '/classes');
  // Check if we're in any of the classes-related views, but not superadmin
  if (route.path === '/classes' ||
    (route.path.includes('/class') && !route.path.includes('/superadmin')) ||
    (route.path.includes('/classlist') && !route.path.includes('/superadmin'))) {
    return classesIndex * 50;
  }
  return activeIndex.value * 50;
};

</script>
