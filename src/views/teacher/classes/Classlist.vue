<template>
  <div>
    <div class="flex justify-between px-5 py-3 items-center">
      <!-- <button class="btn-primary px-8 py-2 mx-12 mt-5 rounded-md" @click="goToSummary">
        <p class="text-white font-semibold text-xs">LIS</p>
      </button> -->

      <div class="w-1/3">
        <searchbar v-model="searchQuery" />
      </div>
    </div>

    <p v-if="!class_id" class="text-red-500">Error: Class ID is required.</p>

    <div v-else>
      <div v-if="loading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
      <div v-else-if="error" class="text-red-500 text-center p-4">
        {{ error }}
      </div>
      <div v-else>
        <p v-if="filteredStudents.length === 0">No students available for this subject.</p>
        <div v-else>
          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th class="table-header">LRN</th>
                  <th class="table-header">Full Name</th>
                  <th class="table-header">Gender</th>
                  <th class="table-header">Birthdate</th>
                  <th class="table-header">Age</th>
                  <th class="table-header">Contact Number</th>
                  <th class="table-header">Address</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(student, index) in filteredStudents" :key="`${student.student_id}-${student.class_id}-${index}`">
                  <td class="table-cell">{{ student.lrn }}</td>
                  <td class="table-cell">{{ student.firstName }} {{ student.middleName }} {{ student.lastName }}</td>
                  <td class="table-cell">{{ student.sex }}</td>
                  <td class="table-cell">{{ student.birthDate }}</td>
                  <td class="table-cell">{{ calculateAge(student.birthDate) }}</td>
                  <td class="table-cell">{{ student.contactNumber }}</td>
                  <td class="table-cell">{{ student.address || 'No address provided' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div>
        <modal v-if="showLis" :subject_id="subject_id" :class_id="class_id" :showLis="showLis" :showMessage="false" :selectedStudent="null"
          :selectedQuarter="'1st'" :trackStand="trackStand" :subjectName="subjectName" :students="studentsInSubject"
          @close="showLis = false" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, inject } from 'vue';
import modal from '@/components/modal.vue';
import searchbar from '@/components/searchbar.vue';
import { classService } from '@/service/classService';
import { useRoute } from 'vue-router';

const props = defineProps({
  class_id: {
    type: String,
    required: false,
    default: null
  },
  subjectName: String,
  trackStand: {
    type: String,
    required: true
  },
  subject_id: {
    type: String,
    required: true
  }
});

const route = useRoute();
const class_id = route.params.class_id; // Will be "2" from your URL
const studentsInSubject = ref([]);
const showLis = ref(false);
const searchQuery = ref("");
const loading = ref(true);
const error = ref(null);

const switchTab = inject('switchTab');

const goToSummary = () => {
  switchTab('SummaryOfGrades');
};

const filteredStudents = computed(() => {
  if (!searchQuery.value) {
    return studentsInSubject.value;
  }
  return studentsInSubject.value.filter(student => {
    const fullName = `${student.firstName} ${student.middleName} ${student.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.value.toLowerCase());
  });
});

const calculateAge = (birthdate) => {
  const today = new Date();
  const birthDate = new Date(birthdate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const month = today.getMonth();
  if (
    month < birthDate.getMonth() ||
    (month === birthDate.getMonth() && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

const fetchStudents = async () => {
  try {
    loading.value = true;
    error.value = null;
    const response = await classService.getClassStudents(class_id);
    if (response.status === 'success') {
      studentsInSubject.value = response.data;
    } else {
      error.value = response.message || 'Failed to fetch students';
    }
  } catch (err) {
    error.value = err.message || 'An error occurred while fetching students';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  if (class_id) {
    fetchStudents();
  }
});
</script>
