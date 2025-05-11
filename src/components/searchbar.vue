<template>
    <div
        class="w-full border border-[#E0E0E0] flex items-center rounded-[8px] mr-5 shadow-[rgba(0,0,0,0.05)_0px_6px_24px_0px,rgba(0,0,0,0.08)_0px_0px_0px_1px,rgba(0,0,0,0.1)_0px_0px_5px_0px,rgba(0,0,0,0.1)_0px_0px_1px_0px]">
        <img src="/assets/img/classes/search.png" alt="search" class="mx-2 w-7 h-7" />
        <input type="text" class="border-none outline-none p-2 placeholder-[#6C6C6C] w-full text-sm font-semibold h-10"
            placeholder="Search..." v-model="searchQuery" />
    </div>
</template>

<script setup>
import { ref, watch, defineEmits } from 'vue';

const emit = defineEmits();
const searchQuery = ref('');

watch(searchQuery, (newQuery) => {
    emit('update:modelValue', newQuery);
});
</script>
