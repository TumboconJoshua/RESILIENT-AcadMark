<template>
  <div v-if="isModalDropOpen" class="fixed inset-0 z-50 bg-black/50 flex justify-center items-center p-[5%]">
    <div class="bg-white p-10 gap-5 max-h-[90vh] w-[700px] overflow-y-auto rounded-lg">
      <div class="flex justify-between items-center mb-4">
        <p class="font-semibold text-2xl text-blue">REQUEST FOR DROP-OUT</p>
      </div>

      <form class="flex flex-col gap-5" @submit.prevent="dropOutStudent">
        <!-- Info Fields -->
        <div class="grid grid-cols-2 gap-4">
          <div class="floating-label">
            <input type="text" class="input" placeholder=" " :value="dropOutFormData.Grade_Level" readonly />
            <label>Grade Level</label>
          </div>
          <div class="floating-label">
            <input type="text" class="input" placeholder=" " :value="dropOutFormData.Curriculum" readonly />
            <label>Curriculum</label>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="floating-label">
            <input type="text" class="input" placeholder=" " :value="dropOutFormData.Track" readonly />
            <label>Track</label>
          </div>
          <div class="floating-label">
            <input type="text" class="input" placeholder=" " :value="dropOutFormData.LRN" readonly />
            <label>LRN</label>
          </div>
        </div>

        <div class="floating-label">
          <input type="text" class="input" placeholder=" " :value="fullName" readonly />
          <label>Full Name</label>
        </div>

        <!-- Reason -->
        <div class="flex flex-col gap-2">
          <label class="text-blue font-semibold text-2xl" for="comment">REASON FOR DROP-OUT</label>
          <textarea rows="5" class="border border-gray-300 rounded-lg p-2" placeholder="Comment the reason here"
            v-model="dropOutFormData.drop_out_comments" required disabled></textarea>
        </div>

        <!-- Buttons -->
        <div class="form-actions">
          <button type="button" class="cancel-btn" @click="rejectAlert">Reject</button>
          <button type="submit" class="submit-btn">Accept</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'
import { acceptDropStudent, rejectDropStudent } from '@/service/studentService'
import Swal from 'sweetalert2';

const props = defineProps({
  isModalDropOpen: Boolean,
  dropOutFormData: Object
})

const emit = defineEmits(['close', 'submit'])

const closeDropModal = () => {
  emit('close')
}


const dropOutStudent = async () => {
  try {
    const studentId = props.dropOutFormData.Student_ID;
    const response = await acceptDropStudent(studentId);

    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: response.message || 'Student marked as Drop-Out successfully.',
      timer: 2000,
      showConfirmButton: false,
    });

    emit('submit', props.dropOutFormData); // notify parent of submission
    emit('close'); // notify parent to close modal
    setTimeout(() => {
      window.location.reload();
    }, 500);
  } catch (error) {
    console.error('Failed to approve drop out:', error);

    Swal.fire({
      icon: 'error',
      title: 'Error!',
      text: error.message || 'Failed to mark student as Drop-Out.',
    });
  }
};

const rejectAlert = async () => {
  try {
    const studentId = props.dropOutFormData.Student_ID;
    const response = await rejectDropStudent(studentId);

    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: response.message || 'Student status updated to Pending.',
      timer: 2000,
      showConfirmButton: false,
    });

    emit('submit', props.dropOutFormData); // notify parent of submission
    emit('close'); // notify parent to close modal
    setTimeout(() => {
      window.location.reload();
    }, 500);
  } catch (error) {
    console.error('Failed to reject drop out:', error);

    Swal.fire({
      icon: 'error',
      title: 'Error!',
      text: error.message || 'Failed to update student status.',
    });
  }
};


// computed fullName combining FirstName, MiddleName, LastName, Suffix
const fullName = computed(() => {
  if (!props.dropOutFormData) return ''
  const { FirstName, MiddleName, LastName, Suffix } = props.dropOutFormData
  return [FirstName, MiddleName, LastName, Suffix].filter(Boolean).join(' ')
})
</script>

<style scoped>
.input {
  border: 1px solid #ccc;
  padding: 0.5rem;
  width: 100%;
  border-radius: 0.375rem;
  background: white;
}
.floating-label {
  position: relative;
  display: flex;
  flex-direction: column;
}
.floating-label label {
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: #666;
}
.cancel-btn,
.submit-btn {
  padding: 5px 30px;
  align-items: center;
  color: #ffffff;
  border-radius: 5px;
  cursor: pointer;
}

.cancel-btn {
  background-color: #D30000;
}

.submit-btn {
  background-color: #0C5A48;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 30px;
}
</style>
