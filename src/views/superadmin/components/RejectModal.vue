<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div
      class="bg-white w-full max-w-md rounded-2xl shadow-lg px-6 py-5 transition-transform transform scale-100"
    >
      <h2 class="text-2xl font-semibold text-gray-800 mb-4">Decline Student(s)</h2>

      <label for="comment" class="block text-sm font-medium text-gray-700 mb-1">
        Reason for rejection:
      </label>
      <textarea
        id="comment"
        v-model="comment"
        placeholder="Please provide a reason..."
        class="w-full border border-gray-300 rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 resize-none"
        rows="5"
      ></textarea>

      <div class="flex justify-end gap-3 mt-6">
        <button
          @click="$emit('close')"
          class="px-4 py-2 rounded-lg text-gray-700 border border-gray-300 hover:bg-gray-100 transition"
        >
          Cancel
        </button>
        <button
          @click="submit"
          :disabled="!comment.trim()"
          class="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Submit
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['close', 'submit']);
const comment = ref('');

const submit = () => {
  if (!comment.value.trim()) {
    return;
  }
  emit('submit', { comment: comment.value.trim() });
};
</script>
