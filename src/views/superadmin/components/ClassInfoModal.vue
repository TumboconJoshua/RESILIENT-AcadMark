<template>
  <div v-if="modelValue" class="fixed inset-0 z-[100] flex items-center justify-center"
    :style="{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }" @click.self="$emit('update:modelValue', false)">
    <div class="bg-white p-6 rounded-md w-[1000px] shadow-lg max-w-full">
      <form @submit.prevent="handleSubmit" class="space-y-4 p-2">
        <h2 class="text-xl text-[#295f98] font-semibold mb-6">Class Info</h2>

        <div class="grid grid-cols-2 gap-6">
          <!-- Left Column -->
          <div class="space-y-4">
            <div>
              <h1 class="font-semibold text-[#295f98]">Class Adviser</h1>
              <p class="text-[1.5rem] text-black-700">{{ props.classInfo.adviser }}</p>
            </div>
            <div>
              <h1 class="font-semibold text-[#295f98]">Curriculum</h1>
              <p class="text-[1.5rem] text-black-700">
                {{
                  props.classInfo.curriculum === 'JHS' ? 'Junior High School' :
                    props.classInfo.curriculum === 'SHS' ? 'Senior High School' :
                      props.classInfo.curriculum
                }}
              </p>
            </div>

            <div>
              <h1 class="font-semibold text-[#295f98]">Class Section</h1>
              <p class="text-[1.5rem] text-black-700">{{ props.classInfo.section }}</p>
            </div>
          </div>

          <!-- Right Column -->
          <div class="space-y-4">
            <div>
              <h1 class="font-semibold text-[#295f98]">Grade Level</h1>
              <p class="text-[1.5rem] text-black-700">Grade {{ props.classInfo.grade }}</p>
            </div>
            <div>
              <h1 class="font-semibold text-[#295f98]">Track</h1>
              <p class="text-[1.5rem] text-black-700">{{ props.classInfo.track }}</p>
            </div>
            <div>
              <h1 class="font-semibold text-[#295f98]">
                Recently Added Student
              </h1>
              <!-- Replace with actual logic if available -->
              <p class="text-[1.5rem] text-black-700">{{ props.classInfo.student || 'N/A' }}</p>
            </div>
          </div>
        </div>

        <!-- Section Separator -->
        <h2 class="text-xl text-[#295f98] font-semibold mt-4">Comments</h2>
        <textarea v-model="props.classInfo.comments" rows="5" placeholder="Enter comments or additional notes here..."
          class="w-full mt-2 p-3 border border-gray-300 rounded-md shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#295f98]"></textarea>


        <!-- Buttons -->
        <div class="button" v-if="props.classInfo.status === 'Pending'">
          <button type="button" @click="confirmReject" class="red">
            Reject
          </button>
          <button type="button" @click="confirmAccept" class="green">
            Accept
          </button>
        </div>
      </form>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, watch } from 'vue';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { acceptClass, rejectClass } from '@/service/studentClassService';


const props = defineProps({
  modelValue: Boolean,
  classInfo: Object,
})


const emit = defineEmits(['update:modelValue', 'submit']);
const comment = ref('');

async function confirmReject() {
  if (!props.classInfo.comments || !props.classInfo.comments.trim()) {
    Swal.fire('Missing Comment', 'Please provide a comment before rejecting.', 'warning');
    return;
  }

  Swal.fire({
    title: 'Are you sure?',
    text: 'Do you want to reject this class?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#aaa',
    confirmButtonText: 'Yes, reject it!',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const payload = {
          class_id: props.classInfo.class_id,
          comments: props.classInfo.comments,
        };

        console.log('Rejecting class with payload:', payload);

        const response = await rejectClass(payload);

        if (!response.error) {
          emit('submit'); // Notify parent to refresh the list
          emit('update:modelValue', false); // Close modal

          Swal.fire('Rejected!', 'The class has been rejected.', 'success');
        } else {
          Swal.fire('Error', 'Something went wrong while rejecting the class.', 'error');
        }
      } catch (error) {
        console.error('Error during rejectClass API call:', error);
        Swal.fire('Error', 'An unexpected error occurred.', 'error');
      }
    }
  });
}



async function confirmAccept() {
  Swal.fire({
    title: 'Confirm Acceptance',
    text: 'Do you want to accept this class?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#0c5a48',
    cancelButtonColor: '#aaa',
    confirmButtonText: 'Yes, accept it!',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        console.log('Sending class IDs to accept:', [props.classInfo.class_id]);

        const response = await acceptClass([props.classInfo.class_id]);

        console.log('Response from acceptClass API:', response);

        if (!response.error) {
          emit('submit'); // notify parent to refresh list

          // Close modal explicitly (optional)
          emit('update:modelValue', false);

          Swal.fire('Accepted!', 'The class has been accepted.', 'success');
        } else {
          Swal.fire('Error', 'Something went wrong while accepting the class.', 'error');
        }
      } catch (error) {
        console.error('Error during acceptClass API call:', error);
        Swal.fire('Error', 'An unexpected error occurred.', 'error');
      }
    }

  });

}


</script>

<style scoped>
.floating-label {
  position: relative;
  display: flex;
  flex-direction: column;
}

.floating-label .input {
  padding: 0.75rem 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.375rem;
  background: white;
  appearance: none;
}

.floating-label label {
  position: absolute;
  left: 0.5rem;
  top: 0.75rem;
  background: white;
  color: #888;
  padding: 0 0.25rem;
  transition: all 0.2s ease;
  pointer-events: none;
}

.floating-label input:focus+label,
.floating-label select:focus+label,
.floating-label.filled label {
  transform: translateY(-1.5rem);
  font-size: 0.75rem;
  color: #2563eb;
}

.custom-arrow {
  position: absolute;
  top: 50%;
  right: 0.75rem;
  pointer-events: none;
  width: 1rem;
  height: 1rem;
  background-image: url('data:image/svg+xml;utf8,<svg fill="%23888888" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>');
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  transform: translateY(-50%);
  transition: background-image 0.2s ease;
}

.floating-label select:focus+label+.custom-arrow {
  background-image: url('data:image/svg+xml;utf8,<svg fill="%232563eb" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>');
}

.button {
  width: 100%;
  display: flex;
  justify-content: end;
  gap: 15px;
}

.red,
.green {
  padding: 5px 30px;
  align-items: center;
  color: #ffffff;
  border-radius: 5px;
  cursor: pointer;
  border: none;
  font-weight: 600;
  font-size: 1rem;
  display: inline-flex;
  justify-content: center;
  user-select: none;
  transition: background-color 0.3s ease;
}

.red {
  background-color: #d30000;
}

.red:hover {
  background-color: #d95353;
}

.green {
  background-color: #0c5a48;
}

.green:hover {
  background-color: #0a4b3b;
}
</style>
