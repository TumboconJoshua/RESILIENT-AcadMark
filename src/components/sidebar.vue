<template>
  <div
    class="sm:w-[1/5] md:w-1/5 lg:w-1/6 max-w-[220px] w-auto bg-blue md:pt-15 sm:pt-5 rounded-tr-[30px] sticky top-0 h-screen flex flex-col"
    style="box-shadow: rgba(0, 0, 0, 0.56) 0px 22px 70px 4px; flex-shrink: 0;">

    <div class="flex flex-col items-center m-4 gap-8">
      <img :src="imageSrc" alt="Teacher" class="w-[130px] h-[130px] rounded-full object-contain" />
      <p class="text-white text-center font-normal text-[16px]">{{ fullName }}</p>
      <div class="w-full border-b border-[#A6ACAF]"></div>
    </div>

    <nav class="flex flex-col w-full mt-5 relative flex-1">
      <div class="absolute left-0 w-full bg-[#3E6FA2] transitions-all duration-300 rounded-r-lg"
        :style="{ top: `${activeIndex * 57}px`, height: '50px' }"></div>

      <router-link v-for="(link, index) in links" :key="index" :to="link.path" class="nav-link relative"
        :class="{ 'active': activeIndex === index }" @click="activeIndex = index">
        <img :src="link.icon" :alt="link.name" class="w-6 h-6 mr-2 sm:hidden md:block" />
        <span class="font-semibold text-[16px]">{{ link.name }}</span>
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
const currentTeacher = ref(null);

const isAdmin = localStorage.getItem('isAdmin') === 'true';

const teacherLinks = ref([
  { name: "Dashboard", path: "/dashboard", icon: "/assets/img/sidebar/dashboard.png" },
  { name: "Classes", path: "/classes", icon: "/assets/img/sidebar/classes.png" },
  { name: "Forms", path: "/forms", icon: "/assets/img/sidebar/form.png" },
  { name: "Profile", path: "/profile", icon: "/assets/img/sidebar/form.png" }
]);

const adminLinks = ref([
  { name: "Dashboard", path: "/admin/dashboard", icon: "/assets/img/sidebar/dashboard.png" },
  { name: "Add Student", path: "/admin/add-student", icon: "/assets/img/sidebar/add.png" },
  { name: "Record", path: "/admin/record", icon: "/assets/img/sidebar/classes.png" },
  { name: "Manage Class", path: "/admin/add-class", icon: "/assets/img/sidebar/manageClass.png" },
  { name: "Masterlist", path: "/admin/master-list", icon: "/assets/img/sidebar/masterlist.png" },
]);


const links = computed(() => {
  return isAdmin ? adminLinks.value : teacherLinks.value;
});

const fullName = computed(() => {
  if (!currentTeacher.value) return '';
  const middleInitial = currentTeacher.value.middleName ? currentTeacher.value.middleName[0] + '.' : '';
  return `${currentTeacher.value.firstName} ${middleInitial} ${currentTeacher.value.lastName}`;
});

const updateImageFromStorage = () => {
  const teacherID = localStorage.getItem('teacherID');
  if (!teacherID) return;

  const teachers = JSON.parse(localStorage.getItem('teachers') || '[]');
  const teacher = teachers.find(t => t.teacher_ID === teacherID);
  if (teacher?.avatar) imageSrc.value = teacher.avatar;
};

watch(() => localStorage.getItem('teachers'), updateImageFromStorage, { deep: true });

onMounted(() => {
  const teacherID = localStorage.getItem('teacherID');
  if (!teacherID) return;

  let teachers = JSON.parse(localStorage.getItem('teachers') || '[]');
  if (teachers.length === 0) teachers = teacherData.teachers;

  const teacher = teachers.find(t => t.teacher_ID === teacherID);
  if (teacher) {
    currentTeacher.value = teacher;
    imageSrc.value = teacher.avatar || "/assets/img/profile/avatar.png";
  }

  setInterval(updateImageFromStorage, 1000);
});

const confirmLogout = () => {
  localStorage.clear();
  router.push('/login');
};
</script>
