<template>
  <div class="flex min-h-screen">
    <Sidebar v-if="!isLoginPage" class="z-50" />
    <div class="flex-1 overflow-hidden">
      <HeaderBar v-if="!isLoginPage" />
      <main :class="{ 'mt-24 px-[38px] pt-[32px]': !isLoginPage }">
        <router-view v-slot="{ Component }">
          <component :is="Component" @logged-in="handleLogin" />
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Sidebar from '@/components/sidebar.vue';
import HeaderBar from '@/components/header.vue';

const router = useRouter();
const route = useRoute();
const isLoginPage = computed(() => route.path === '/login');

const handleLogin = () => {
  router.push('/dashboard');
};
</script>
