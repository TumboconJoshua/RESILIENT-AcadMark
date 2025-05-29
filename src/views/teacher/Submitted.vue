<template>
  <div class="max-h-[412px]">
    <div class="flex justify-between px-5 py-3">
      <Dropdown :showQuarter="true" v-model="selectedQuarter" />
      <div class="w-1/3">
        <Searchbar v-model="searchQuery" />
      </div>
    </div>

    <div class="overflow-auto px-5">
      <table class="w-full border-collapse text-center text-sm">
        <thead class="bg-gray-100 text-[#464F60] text-[15px] font-semibold">
          <tr>
            <th class="p-2 w-1/12">LRN</th>
            <th class="p-2 w-1/12">NAME</th>
            <th class="p-2 w-1/12">GENDER</th>
            <th class="p-2 w-1/12">AGE</th>
            <th class="p-2 w-1/12">{{ selectedQuarter.toUpperCase() }} QUARTER GRADE</th>
            <th class="p-2 w-1/12">STATUS</th>
          </tr>
        </thead>
        <tbody class="font-medium text-[15px]">
          <tr v-if="loading">
            <td colspan="6" class="p-2 text-center">
              <div class="flex justify-center items-center">
                <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue"></div>
                <span class="ml-2">Loading...</span>
              </div>
            </td>
          </tr>
          <tr v-else-if="paginatedStudents.length === 0">
            <td colspan="6" class="p-2 text-center">
              {{ error || 'No students available.' }}
            </td>
          </tr>
          <tr v-for="grade in paginatedStudents" :key="grade.Grade_ID" class="hover:bg-gray-200 cursor-pointer"
            @click="openModal(grade)">
            <td class="p-2 w-1/12">
              {{ grade.student?.LRN || 'N/A' }}
            </td>
            <td class="p-2 w-1/12 whitespace-nowrap">
              {{ `${grade.student?.LastName || 'N/A'}, ${grade.student?.FirstName || 'N/A'} ${grade.student?.MiddleName || ''}` }}
            </td>
            <td class="p-2 w-1/12">{{ grade.student?.sex || 'N/A' }}</td>
            <td class="p-2 w-1/12">{{ getAge(grade.student?.birthDate) }}</td>
            <td class="p-2 w-1/12">
              {{ (grade.Status === 'Approved' || grade.Status === 'Declined') ? getGradeForQuarter(grade, quarterMapping[selectedQuarter]) : '-' }}
            </td>
            <td class="p-2 w-1/12">
              <span :class="{
                'text-yellow-500': grade.Status === 'Pending',
                'text-green-500': grade.Status === 'Approved',
                'text-red-500': grade.Status === 'Declined'
              }">
                {{ grade.Status || 'Pending' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Modal 
      v-if="showMessage" 
      :showMessage="showMessage" 
      @close="closeModal"
      :trackStand="trackStand"
      :selectedStudent="selectedStudent"
      :selectedQuarter="selectedQuarter"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import Dropdown from '@/components/dropdown.vue';
import Searchbar from '@/components/searchbar.vue';
import Modal from '@/components/modal.vue';
import { getSubjectGrades } from '@/service/gradeService';
import Swal from 'sweetalert2';

const props = defineProps({
  subject_id: {
    type: String,
    required: true,
  },
  trackStand: {
    type: String,
    required: true,
  },
  currentPage: {
    type: Number,
    required: true,
  },
  itemsPerPage: {
    type: Number,
    required: true,
  },
  class_id: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['update:currentPage', 'update:totalItems', 'close']);

const students = ref([]);
const selectedQuarter = ref('1st');
const searchQuery = ref('');
const showMessage = ref(false);
const selectedStudent = ref(null);
const loading = ref(false);
const error = ref('');

const quarterMapping = {
  '1st': 'first',
  '2nd': 'second',
  '3rd': 'third',
  '4th': 'fourth',
};

const refreshSubmittedData = () => {
  loadSubjectData();
};

// Expose this method to the parent component
defineExpose({
  refreshSubmittedData,
});

const loadSubjectData = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    console.log('Loading subject data for subject_id:', props.subject_id, 'and class_id:', props.class_id);
    const response = await getSubjectGrades(props.subject_id, props.class_id);
    console.log('Raw API response:', response);

    if (response.status === 'success' && response.data && Array.isArray(response.data)) {
      console.log('Processing students data:', response.data);
      
      students.value = response.data.map((student) => {
        console.log('Processing student:', student);
        
        return {
          ...student,
          grades: {
            first: student.grades?.first || null,
            second: student.grades?.second || null,
            third: student.grades?.third || null,
            fourth: student.grades?.fourth || null,
          },
        };
      });

      console.log('Final students array:', students.value);
    } else {
      console.error('Invalid response format:', response);
      error.value = 'Failed to load student data';
    }

    emit('update:currentPage', 1);
    emit('update:totalItems', students.value.length);
  } catch (error) {
    console.error('Error loading subject data:', error);
    error.value = error.message || 'Failed to load student data. Please try again.';
    emit('update:currentPage', 1);
    emit('update:totalItems', 0);
    
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.value,
      confirmButtonColor: '#dc2626'
    });
  } finally {
    loading.value = false;
  }
};

const filteredStudents = computed(() => {
  if (!searchQuery.value) {
    return students.value;
  }
  return students.value.filter((student) => {
    return (
      student.firstName
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });
});

const paginatedStudents = computed(() => {
  if (filteredStudents.value.length === 0) {
    return [];
  }

  const startIndex = (props.currentPage - 1) * props.itemsPerPage;
  const endIndex = startIndex + props.itemsPerPage;
  return filteredStudents.value.slice(startIndex, endIndex);
});

const getGradeForQuarter = (student, quarter) => {
  const grade = student.grades?.[quarter];
  if (!grade || grade === null || grade === undefined || grade === '') {
    return '-';
  }
  return grade;
};

const getFinalGrade = (grades) => {
  const quarters = [grades.first, grades.second, grades.third, grades.fourth].filter(Boolean);
  return quarters.length === 4 ? (quarters.reduce((a, b) => a + b, 0) / 4).toFixed(2) : '-';
};

const getRemarks = (grades) => {
  const finalGrade = getFinalGrade(grades);
  if (finalGrade === '-') return '-';
  return parseFloat(finalGrade) >= 75 ? 'Passed' : 'Failed';
};

const getRemarksClass = (grades) => {
  const remarks = getRemarks(grades);
  return {
    'text-green-500': remarks === 'Passed',
    'text-red-500': remarks === 'Failed'
  };
};

const getAge = (birthDate) => {
  if (!birthDate) return 'N/A';
  const birth = new Date(birthDate);
  const ageDifMs = Date.now() - birth.getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

const openModal = (student) => {
  selectedStudent.value = student;
  showMessage.value = true;
};

const closeModal = () => {
  showMessage.value = false;
};

onMounted(() => {
  loadSubjectData();
});
</script>
