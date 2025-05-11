<template>
  <div class="fixed top-0 left-0 w-full bg-blue shadow-md z-1">
    <div class="flex items-center px-5 py-2 sm:ml-40 md:ml-60"
      :class="{ 'justify-between': isDashboard, 'justify-end': !isDashboard }">
      <h1 v-if="isDashboard" class="sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-white">
        Welcome Teacher {{ teacherFirstName }}!
      </h1>
      <img class="h-[80px] md:h-[100px] lg:h-[120px]" src="/assets/img/logo.png" alt="Logo" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import teacherData from '@/data/teachers.json';

const route = useRoute();
const teacherFirstName = ref('');

const isDashboard = computed(() => route.path === '/dashboard');

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user) {
    const teacher = teacherData.teachers.find(t => t.teacher_ID === user.teacher_ID);
    if (teacher) {
      teacherFirstName.value = teacher.firstName;
    }
  }
});
</script>