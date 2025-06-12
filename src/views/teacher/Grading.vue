<template>
  <div class="flex max-h-[412px] overflow-x-auto scrollbar-hide">
    <!-- Left Section: Student Selection -->
    <div class="px-5 py-3 border-r border-[#d0d0d0] relative">
      <!-- Loading overlay -->
      <div v-if="isLoading" class="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
        <div class="flex flex-col items-center gap-2">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue"></div>
          <p class="text-blue text-sm font-medium">Loading...</p>
        </div>
      </div>

      <div class="flex items-center gap-5">
        <Dropdown :showQuarter="true" v-model="selectedQuarter" />
        <Dropdown :showMarkStatus="true" v-model="selectedMarkStatus" />
        <p class="font-semibold text-lg">{{ formattedDate }}</p>
      </div>

      <!-- Add Excel Import/Export buttons -->
      <div class="flex gap-2 mt-4">
        <button @click="downloadTemplate"
          class="bg-[#30612E] text-white px-5 py-1 rounded-md hover:bg-[#cecece] transition-colors cursor-pointer duration-200">
          <p class="w-full">Download Template</p>
        </button>
        <input
          type="file"
          ref="fileInput"
          accept=".xlsx,.xls"
          class="hidden"
          @change="handleFileUpload"
        />
        <button @click="$refs.fileInput.click()"
          class="bg-[#30612E] text-white px-5 py-1 rounded-md hover:bg-[#cecece] transition-colors cursor-pointer duration-200">
          <p class="w-full">Import Excel</p>
        </button>
      </div>

      <!-- Select All Checkbox -->
      <div class="mt-4 flex items-center justify-end gap-2">
        <label for="select-all" class="ml-2 text-xs">Select All</label>
        <input type="checkbox" class="checkbox mr-[35px]" id="select-all" v-model="selectAll" @change="toggleSelectAll"
          :disabled="isLoading" />
      </div>

      <!-- Displaying Student Names Dynamically -->
      <div class="mt-4 overflow-y-auto overflow-x-auto scrollbar-hide max-h-[230px]">
        <ul v-if="filteredStudents.length > 0">
          <li v-for="(student, index) in filteredStudents" :key="index"
            class="flex justify-between py-2 mr-3 rounded-md transition-colors duration-200 px-2 cursor-pointer" :class="{
              'bg-blue-100 border-blue': isSelectedStudent(student),
              'opacity-50': isLoading
            }" @click="handleStudentClick(student)">
            <div class="flex items-center gap-5">
              <!-- Conditional background color based on grade presence for the current quarter -->
              <div :class="{
                'bg-[#23AD00]': hasGrade(student),
                'bg-red-500': !hasGrade(student)
              }" class="w-5 h-5 rounded-2xl"></div>
              <p class="font-medium text-base truncate max-w-[150px]" :class="{
                'text-blue font-semibold': isSelectedStudent(student),
              }">
                {{
                  student.lastName +
                  ', ' +
                  student.firstName +
                  (student.middleName ? ' ' + student.middleName : '')
                }}
              </p>
            </div>
            <div>
              <input type="checkbox" class="checkbox" v-model="student.selected" @click.stop />
            </div>
          </li>
        </ul>

      </div>

      <div class="flex justify-end mt-2 mr-5">
        <button class="bg-blue px-3 py-2 text-xs font-semibold text-white rounded-sm cursor-pointer"
          :class="{ 'opacity-50 cursor-not-allowed': !canSubmitGrades, 'hover:bg-[#cecece]': canSubmitGrades }"
          @click="submitGrades" :disabled="!canSubmitGrades">
          Submit Grades
        </button>
      </div>
    </div>

    <!-- Right Section: Student Info and Grading -->
    <div class="gap-3 flex flex-col mx-5 my-3 flex-1">
      <p class="text-blue font-semibold text-2xl">STUDENT INFO</p>
      <div class="flex flex-col gap-3">
        <div class="flex gap-10">
          <div class="flex flex-col gap-1">
            <div>
              <p class="text-blue text-xs font-bold">Student Name</p>
              <div class="relative">
                <p class="text-2xl font-medium">
                  {{ selectedStudent ? selectedStudent.firstName + " " +
                    selectedStudent.middleName + " " + selectedStudent.lastName : '(Select a Student)' }}
                </p>
              </div>
            </div>
            <div>
              <p class="text-blue text-xs font-bold">LRN</p>
              <div class="relative">
                <p class="text-2xl font-medium">
                  {{ selectedStudent ? selectedStudent.lrn : 'N/A' }}
                </p>
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-1">
            <div>
              <p class="text-blue text-xs font-bold">Sex</p>
              <div class="relative">
                <p class="text-2xl font-medium">
                  {{ selectedStudent ? selectedStudent.sex : 'N/A' }}
                </p>
              </div>
            </div>
            <div>
              <p class="text-blue text-xs font-bold">Curriculum</p>
              <div class="relative">
                <p class="text-2xl font-medium">
                  {{ getCurriculumLevel() }}
                </p>
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-1">
            <div>
              <p class="text-blue text-xs font-bold">Birthdate</p>
              <div class="relative">
                <p class="text-2xl font-medium">
                  {{ selectedStudent ? selectedStudent.birthDate : 'N/A' }}
                </p>
              </div>
            </div>
            <div>
              <p class="text-blue text-xs font-bold">Academic Track</p>
              <div class="relative">
                <p class="text-2xl font-medium">
                  {{ trackStand }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p class="text-blue font-semibold text-2xl">GRADING</p>
      <div class="flex flex-col gap-3">
        <div class="flex gap-5">
          <div>
            <p class="text-blue text-xs font-bold">Quarter Grade</p>
            <div class="relative">
              <input type="text" class="border-[1px] w-35 h-9 text-center" v-model="Grade" @input="validateGrade"
                maxlength="5" pattern="[0-9]*\.?[0-9]*" inputmode="decimal" :disabled="!canInputGrade || isLoading" />
              <!-- Loading overlay -->
              <div v-if="isLoading" class="absolute inset-0 bg-white/80 flex items-center justify-center">
                <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue"></div>
              </div>
            </div>
          </div>
          <div>
            <p class="text-blue text-xs font-bold">Remarks</p>
            <div class="w-35 h-9 border-[1px] rounded-[5px] items-center justify-center flex">
              <!-- Dynamically show Passed or Failed -->
              <p class="font-bold" :class="remarksClass">{{ remarks }}</p>
            </div>
          </div>
        </div>
        <p class="italic text-xs">You are grading for <span class="font-bold mt-5">{{ selectedQuarter }}</span></p>
      </div>

      <button class="max-w-28 h-8 rounded-md text-white font-semibold text-md hover:bg-[#cecece] cursor-pointer"
        :class="isEditMode ? 'bg-yellow-500' : 'bg-blue'" @click="toggleEditMode">
        {{ isEditMode ? 'Edit' : 'Save' }}
      </button>

      <!-- Pagination Controls -->
      <div class="relative">
        <div class="flex gap-5 top-[-35px] right-15 absolute">
          <div class="flex items-center gap-2 cursor-pointer" :class="{ 'pointer-events-none': currentIndex === 0 }"
            @click="prevStudent">
            <img class="h-4 w-4 rotate-180"
              :src="currentIndex === 0 ? '/assets/img/classes/arrow2.png' : '/assets/img/classes/arrow.png'"
              alt="Previous" />
            <p :style="{ color: currentIndex === 0 ? '#bababa' : 'inherit' }">Previous</p>
          </div>
          <div class="flex items-center gap-2 cursor-pointer"
            :class="{ 'pointer-events-none': currentIndex === studentsInSubject.length - 1 }" @click="nextStudent">
            <p :style="{ color: currentIndex === studentsInSubject.length - 1 ? '#bababa' : 'inherit' }">Next</p>
            <img class="h-4 w-4"
              :src="currentIndex === studentsInSubject.length - 1 ? '/assets/img/classes/arrow2.png' : '/assets/img/classes/arrow.png'"
              alt="Next" />
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Add Excel Preview Modal -->
  <div v-if="showExcelPreview" class="fixed inset-0 flex items-center justify-center z-50" style="background-color: transparent;">
    <div class="bg-white p-6 rounded-lg w-[90%] max-h-[80vh] overflow-hidden flex flex-col shadow-xl">
      <!-- Header -->
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-gray-800">Excel Preview</h2>
        <button @click="showExcelPreview = false" class="text-gray-500 hover:text-gray-700">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Validation Errors -->
      <div v-if="validationErrors.length > 0" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 class="font-bold text-red-700 mb-2">Validation Errors:</h3>
        <ul class="list-disc pl-5 text-red-600">
          <li v-for="(error, index) in validationErrors" :key="index" class="text-sm">{{ error }}</li>
        </ul>
      </div>

      <!-- Table Container -->
      <div class="flex-1 overflow-auto">
        <table class="w-full border-collapse">
          <thead class="bg-gray-50 sticky top-0">
            <tr>
              <th v-for="header in excelHeaders" :key="header" 
                  class="px-4 py-3 text-left text-sm font-semibold text-gray-600 border-b border-gray-200">
                {{ header }}
              </th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600 border-b border-gray-200">
                Status
              </th>
            </tr>
          </thead>
          <tbody class="bg-white">
            <tr v-for="(row, index) in excelData" :key="index" 
                :class="{
                  'bg-red-50': hasRowError(index),
                  'hover:bg-gray-50': !hasRowError(index)
                }"
                class="border-b border-gray-200">
              <td v-for="header in excelHeaders" :key="header" 
                  class="px-4 py-3 text-sm text-gray-700">
                {{ row[header] }}
              </td>
              <td class="px-4 py-3 text-sm">
                <div v-if="hasRowError(index)" class="text-red-600">
                  <ul class="list-disc pl-5">
                    <li v-for="error in getRowErrors(index)" :key="error" class="text-xs">
                      {{ error }}
                    </li>
                  </ul>
                </div>
                <span v-else class="text-green-600">Valid</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer -->
      <div class="mt-4 pt-4 border-t border-gray-200 flex justify-end gap-3">
        <button @click="handleCancel"
          class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
          Cancel
        </button>
        <button @click="saveValidRows"
          class="px-4 py-2 bg-[#30612E] text-white rounded-md hover:bg-[#245020] transition-colors">
          Save Valid Rows
        </button>
      </div>
    </div>
  </div>

  <!-- Move the modal outside the main container -->
  <div v-if="showSubmitSuccess" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
    <div class="bg-white rounded-xl p-8 text-center shadow-xl max-w-sm w-full">
      <h2 class="text-xl font-semibold text-green-600 mb-4">Success!</h2>
      <p class="text-gray-700">Grades have been successfully submitted.</p>
      <button @click="showSubmitSuccess = false"
        class="mt-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer">
        OK
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import Dropdown from '@/components/dropdown.vue';
import { computed } from 'vue';
import { classService } from '@/service/classService';
import { submitGrades as submitGradesToAPI, getSubjectGrades } from '@/service/gradeService';
import Swal from 'sweetalert2';
import { useRoute } from 'vue-router';
import * as XLSX from 'xlsx';

const props = defineProps({
  trackStand: String,
  subject_id: String,
  classType: String,
  subjectName: String,
  className: String,
  gradeLevel: [String, Number],
  currentPage: Number,
  itemsPerPage: Number,
  class_id: String,
});

const today = new Date();
const formattedDate = ref(
  `${today.getMonth() + 1}/${today.getDate()}/${String(today.getFullYear()).slice(-2)}`
);
const selectAll = ref(false);
const studentsInSubject = ref([]);
const selectedStudent = ref(null);
const currentIndex = ref(0);
const Grade = ref('');
const selectedQuarter = ref('1st');
const selectedMarkStatus = ref('');
const showSubmitSuccess = ref(false);
const isEditMode = ref(false);
const route = useRoute();
const isLoading = ref(false);
const fileInput = ref(null);
const showExcelPreview = ref(false);
const excelData = ref([]);
const excelHeaders = ref(['LRN', 'Name', 'Gender', 'Q1', 'Q2', 'Q3', 'Q4']);
const validationErrors = ref([]);

const quarterMapping = {
  '1st': 'first',
  '2nd': 'second',
  '3rd': 'third',
  '4th': 'fourth',
};

const loadGrade = async () => {
  if (selectedStudent.value) {
    isLoading.value = true;
    try {
      const response = await getSubjectGrades(props.subject_id, props.class_id);
      if (response.status === 'success' && response.data) {
        const studentGrade = response.data.find(
          grade => grade.Student_ID === selectedStudent.value.student_id
        );

        if (studentGrade) {
          const gradeKey = quarterMapping[selectedQuarter.value];
          Grade.value = studentGrade.grades[gradeKey] || '';
        }
      }
    } catch (error) {
      console.error('Error loading grade:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load grade. Please try again.',
        confirmButtonColor: '#dc2626'
      });
    } finally {
      isLoading.value = false;
    }
  }
};

const isSelectedStudent = (student) => {
  return (
    selectedStudent.value &&
    student.student_id === selectedStudent.value.student_id
  );
};

function toggleSelectAll() {
  studentsInSubject.value.forEach((student) => {
    student.selected = selectAll.value;
  });
}

const remarks = computed(() => {
  if (!Grade.value) {
    return '';
  }
  return parseFloat(Grade.value) <= 74.4 ? 'Failed' : 'Passed';
});

function nextStudent() {
  if (currentIndex.value < studentsInSubject.value.length - 1) {
    currentIndex.value++;
  }
}

function toggleEditMode() {
  if (!isEditMode.value) {
    // When clicking Save, save the grades to localStorage
    saveGradesToLocalStorage();
  }
  isEditMode.value = !isEditMode.value;
}

async function saveGradesToLocalStorage() {
  if (!selectedStudent.value) return;

  // Check previous quarters before saving
  const checkResult = checkPreviousQuarters(selectedStudent.value, selectedQuarter.value);
  if (!checkResult.canGrade) {
    Swal.fire({
      icon: 'warning',
      title: 'Cannot Grade',
      text: `Please grade Quarter ${checkResult.missingQuarter} first before grading Quarter ${selectedQuarter.value}.`,
      confirmButtonColor: '#3085d6'
    });
    return;
  }

  try {
    // Get existing grades for the student
    const existingGrades = selectedStudent.value.grades;

    const gradeData = {
      Student_ID: selectedStudent.value.student_id,
      Subject_ID: props.subject_id,
      Teacher_ID: JSON.parse(localStorage.getItem('user')).teacher_ID,
      Class_ID: props.class_id,
      Q1: selectedQuarter.value === '1st' ? Grade.value : existingGrades.first,
      Q2: selectedQuarter.value === '2nd' ? Grade.value : existingGrades.second,
      Q3: selectedQuarter.value === '3rd' ? Grade.value : existingGrades.third,
      Q4: selectedQuarter.value === '4th' ? Grade.value : existingGrades.fourth
    };

    // Check if grade is below 73
    if (parseFloat(Grade.value) < 73) {
      const result = await Swal.fire({
        title: 'Warning: Low Grade',
        text: `Are you sure you want to give ${selectedStudent.value.firstName} ${selectedStudent.value.lastName} a grade of ${Grade.value}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, save grade',
        cancelButtonText: 'Cancel'
      });

      if (!result.isConfirmed) {
        return;
      }
    }

    const response = await submitGradesToAPI([gradeData], props.class_id);

    if (response.status === 'success') {
      Swal.fire('Success', 'Grade saved successfully!', 'success');
      // Refresh the grades after saving
      await fetchGradesFromDatabase();
    } else {
      throw new Error(response.message || 'Failed to save grade');
    }
  } catch (error) {
    console.error('Error saving grade:', error);
    let errorMessage = 'Failed to save grade. Please try again.';

    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: errorMessage,
      confirmButtonColor: '#dc2626'
    });
  }
}

const selectedStudents = computed(() => {
  return studentsInSubject.value.filter(student => student.selected);
});

// Add a new computed property to check if submission is allowed
const canSubmitGrades = computed(() => {
  const selectedStudents = studentsInSubject.value.filter(student => student.selected);
  if (selectedStudents.length === 0) return false;

  // Check if all selected students have grades in sequence
  return selectedStudents.every(student => {
    const checkResult = checkPreviousQuarters(student, selectedQuarter.value);
    return checkResult.canGrade;
  });
});

async function submitGrades() {
  if (!canSubmitGrades.value) {
    Swal.fire({
      icon: 'warning',
      title: 'Cannot Submit',
      text: 'Please ensure all selected students have grades in sequence before submitting.',
      confirmButtonColor: '#3085d6'
    });
    return;
  }

  const classId = props.class_id || route.params.class_id;
  if (!classId) {
    Swal.fire('Error', 'Class ID is missing.', 'error');
    return;
  }

  // Get selected students
  const selectedStudents = studentsInSubject.value.filter(student => student.selected);

  // Check if any selected students have null grades
  const studentsWithNullGrades = selectedStudents.filter(student => {
    const gradeKey = quarterMapping[selectedQuarter.value];
    const grade = student.grades[gradeKey];
    return !grade || grade === '';
  });

  if (studentsWithNullGrades.length > 0) {
    Swal.fire({
      icon: 'error',
      title: 'Cannot Submit',
      text: `The following students have no grades: ${studentsWithNullGrades.map(student =>
        `${student.firstName} ${student.lastName}`
      ).join(', ')}`,
      confirmButtonColor: '#dc2626'
    });
    return;
  }

  try {
    const gradesData = selectedStudents.map((student) => ({
      Student_ID: student.student_id,
      Subject_ID: props.subject_id,
      Teacher_ID: JSON.parse(localStorage.getItem('user')).teacher_ID,
      Class_ID: classId,
      Q1: student.grades.first || null,
      Q2: student.grades.second || null,
      Q3: student.grades.third || null,
      Q4: student.grades.fourth || null
    }));

    // Show confirmation pop-up
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to submit grades for the selected students.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, submit!',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      const response = await submitGradesToAPI(gradesData, classId);

      if (response.status === 'success') {
        Swal.fire('Success', 'Grades submitted successfully!', 'success');
        // Refresh the grades after submission
        await fetchGradesFromDatabase();
      } else {
        throw new Error(response.message || 'Failed to submit grades');
      }
    }
  } catch (error) {
    console.error('Error:', error);
    let errorMessage = 'Failed to submit grades. Please try again.';

    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: errorMessage,
      confirmButtonColor: '#dc2626'
    });
  }
}

function calculateFinalGrade(grades) {
  if (grades.first && grades.second && grades.third && grades.fourth) {
    const final =
      (parseFloat(grades.first) +
        parseFloat(grades.second) +
        parseFloat(grades.third) +
        parseFloat(grades.fourth)) /
      4;
    return parseFloat(final.toFixed(2));
  }
  return null;
}

function calculateRemarks(grades) {
  const finalGrade = calculateFinalGrade(grades);
  return finalGrade ? (finalGrade >= 75.5 ? 'Passed' : 'Failed') : null;
}

function prevStudent() {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
}

const remarksClass = computed(() => {
  if (!Grade.value) {
    return '';
  }
  return parseFloat(Grade.value) <= 74.4 ? 'text-red-500' : 'text-green-500';
});

watch(selectedQuarter, loadGrade);
watch(currentIndex, () => {
  if (studentsInSubject.value.length > 0) {
    selectedStudent.value = studentsInSubject.value[currentIndex.value];
    loadGrade();
  }
});

// Add a new function to fetch grades from database
async function fetchGradesFromDatabase() {
  isLoading.value = true;
  try {
    const classId = props.class_id || route.params.class_id;
    if (!classId) {
      console.error('Class ID is missing');
      return;
    }

    // Get students
    const studentsResponse = await classService.getClassStudents(classId);

    // Get grades
    const gradesResponse = await getSubjectGrades(props.subject_id, classId);

    if (studentsResponse.status === 'success' && studentsResponse.data && Array.isArray(studentsResponse.data)) {
      // Update students with grades from API
      studentsInSubject.value = studentsResponse.data.map((student) => {
        const studentGrade = gradesResponse.data?.find(
          grade => grade.Student_ID === student.student_id
        );

        return {
          ...student,
          selected: false,
          grades: studentGrade?.grades || {
            first: null,
            second: null,
            third: null,
            fourth: null
          }
        };
      });

      // Update selected student if exists
      if (selectedStudent.value) {
        const updatedStudent = studentsInSubject.value.find(
          s => s.student_id === selectedStudent.value.student_id
        );
        if (updatedStudent) {
          selectedStudent.value = updatedStudent;
          loadGrade();
        }
      }
    }
  } catch (error) {
    console.error('Error fetching grades:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to fetch grades. Please try again.',
      confirmButtonColor: '#dc2626'
    });
  } finally {
    isLoading.value = false;
  }
}

// Add a watcher for route changes
watch(
  () => route.query,
  () => {
    fetchGradesFromDatabase();
  },
  { immediate: true }
);

// Modify the existing loadSubjectData function
async function loadSubjectData() {
  try {
    isLoading.value = true;
    await fetchGradesFromDatabase();
    
    // Force a re-render of the student list
    studentsInSubject.value = [...studentsInSubject.value];
    
    // Update filtered students
    filteredStudents.value = [...filteredStudents.value];
    
    // If there's a selected student, update their data
    if (selectedStudent.value) {
      const updatedStudent = studentsInSubject.value.find(
        s => s.student_id === selectedStudent.value.student_id
      );
      if (updatedStudent) {
        selectedStudent.value = updatedStudent;
        await loadGrade();
      }
    }
  } catch (error) {
    console.error('Error loading subject data:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to load student data. Please try again.',
      confirmButtonColor: '#dc2626'
    });
  } finally {
    isLoading.value = false;
  }
}

// Add a function to refresh data periodically
let refreshInterval;

onMounted(() => {
  loadSubjectData();
  // Refresh data every 30 seconds
  refreshInterval = setInterval(fetchGradesFromDatabase, 30000);
});

onUnmounted(() => {
  // Clear the interval when component is unmounted
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
  
  // Clean up any remaining data
  excelData.value = [];
  validationErrors.value = [];
  showExcelPreview.value = false;
  
  // Reset file input
  if (fileInput.value) {
    fileInput.value.value = '';
  }
});

function setStudentInfo(index) {
  currentIndex.value = index;
  selectedStudent.value = studentsInSubject.value[index];
  loadGrade();
}

function validateGrade(event) {
  // First check if input is allowed
  if (!canInputGrade.value) {
    Swal.fire({
      icon: 'warning',
      title: 'Cannot Grade',
      text: `Please grade Quarter ${checkPreviousQuarters(selectedStudent.value, selectedQuarter.value).missingQuarter} first before grading Quarter ${selectedQuarter.value}.`,
      confirmButtonColor: '#3085d6'
    });
    Grade.value = ''; // Clear the input
    return;
  }

  // Then proceed with normal grade validation
  // Allow only numbers and one decimal point
  Grade.value = Grade.value.replace(/[^0-9.]/g, '');

  // Ensure only one decimal point
  const parts = Grade.value.split('.');
  if (parts.length > 2) {
    Grade.value = parts[0] + '.' + parts.slice(1).join('');
  }

  // Limit to 2 decimal places
  if (parts.length > 1 && parts[1].length > 2) {
    Grade.value = parts[0] + '.' + parts[1].slice(0, 2);
  }

  const numValue = parseFloat(Grade.value);
  if (numValue > 100) {
    Grade.value = '100';
  }
}

const filteredStudents = computed(() => {
  return studentsInSubject.value.filter((student) => {
    const studentGrade =
      student.grades[quarterMapping[selectedQuarter.value]];

    if (selectedMarkStatus.value === 'Marked') {
      return studentGrade !== null && studentGrade !== '';
    } else if (selectedMarkStatus.value === 'Unmarked') {
      return studentGrade === null || studentGrade === '';
    }
    return true;
  });
});

const getCurriculumLevel = () => {
  if (!props.gradeLevel) return 'N/A';
  const grade = parseInt(props.gradeLevel);
  return grade <= 10 ? 'JHS' : 'SHS';
};

async function refreshGrades() {
  try {
    await loadSubjectData();
  } catch (error) {
    console.error('Error refreshing grades:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to refresh grades. Please try again.',
      confirmButtonColor: '#dc2626'
    });
  }
}

function validateGradeData(gradeData) {
  const errors = [];

  if (!gradeData.Student_ID) {
    errors.push('Student ID is required');
  }
  if (!gradeData.Subject_ID) {
    errors.push('Subject ID is required');
  }
  if (!gradeData.Teacher_ID) {
    errors.push('Teacher ID is required');
  }

  // Validate quarter grades
  ['Q1', 'Q2', 'Q3', 'Q4'].forEach(quarter => {
    if (gradeData[quarter] !== null) {
      const grade = parseFloat(gradeData[quarter]);
      if (isNaN(grade) || grade < 0 || grade > 100) {
        errors.push(`${quarter} must be a number between 0 and 100`);
      }
    }
  });

  return errors;
}

function checkUserAuth() {
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    Swal.fire({
      icon: 'error',
      title: 'Authentication Error',
      text: 'Please log in again to continue.',
      confirmButtonColor: '#dc2626'
    });
    return false;
  }

  try {
    const user = JSON.parse(userStr);
    if (!user.teacher_ID) {
      Swal.fire({
        icon: 'error',
        title: 'Authentication Error',
        text: 'Teacher ID not found. Please log in again.',
        confirmButtonColor: '#dc2626'
      });
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error parsing user data:', error);
    Swal.fire({
      icon: 'error',
      title: 'Authentication Error',
      text: 'Invalid user data. Please log in again.',
      confirmButtonColor: '#dc2626'
    });
    return false;
  }
}

function handleStudentClick(student) {
  // Toggle student selection
  student.selected = !student.selected;
  setStudentInfo(studentsInSubject.value.findIndex(s => s.student_id === student.student_id));

  // Enable edit mode when selecting a student
  isEditMode.value = false; // This will enable the input since we inverted the disabled logic
}

// Update the hasGrade computed property to prioritize API data
const hasGrade = computed(() => {
  return (student) => {
    const gradeKey = quarterMapping[selectedQuarter.value];
    return student.grades[gradeKey] !== null && student.grades[gradeKey] !== '';
  };
});

// Update the checkPreviousQuarters function to use API data
function checkPreviousQuarters(student, currentQuarter) {
  const quarterOrder = ['1st', '2nd', '3rd', '4th'];
  const currentIndex = quarterOrder.indexOf(currentQuarter);

  // Check all previous quarters
  for (let i = 0; i < currentIndex; i++) {
    const prevQuarter = quarterOrder[i];
    const gradeKey = quarterMapping[prevQuarter];
    const grade = student.grades[gradeKey];

    if (!grade || grade === '') {
      return {
        canGrade: false,
        missingQuarter: prevQuarter
      };
    }
  }

  return { canGrade: true };
}

// Add a new computed property to check if input is allowed
const canInputGrade = computed(() => {
  if (!selectedStudent.value) return false;

  const checkResult = checkPreviousQuarters(selectedStudent.value, selectedQuarter.value);
  return checkResult.canGrade;
});

const downloadTemplate = () => {
  const template = [
    {
      LRN: '123456789012',
      Q1: 85,
      Q2: 88,
      Q3: 90,
      Q4: 87
    }
  ];

  const ws = XLSX.utils.json_to_sheet(template);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Template");
  XLSX.writeFile(wb, "grades_template.xlsx");
};

const validateExcelData = (data) => {
  const errors = [];
  // Format LRNs to ensure consistent comparison
  const validLRNs = new Set(studentsInSubject.value.map(s => String(s.lrn).trim().replace(/^0+/, '')));

  data.forEach((row, index) => {
    if (!row.LRN) {
      errors.push(`Row ${index + 1}: LRN is required`);
    } else {
      // Format the input LRN the same way
      const formattedLRN = String(row.LRN).trim().replace(/^0+/, '');
      if (!validLRNs.has(formattedLRN)) {
        errors.push(`Row ${index + 1}: Invalid LRN ${row.LRN} - Student not found in this class`);
      }
    }

    // Validate quarter grades
    ['Q1', 'Q2', 'Q3', 'Q4'].forEach(quarter => {
      if (row[quarter] !== '') {
        const grade = parseFloat(row[quarter]);
        if (isNaN(grade)) {
          errors.push(`Row ${index + 1}: ${quarter} must be a number`);
        } else if (grade < 0 || grade > 100) {
          errors.push(`Row ${index + 1}: ${quarter} must be between 0 and 100`);
        }
      }
    });
  });

  return errors;
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet);

      if (jsonData.length === 0) {
        Swal.fire('Error', 'Excel file is empty', 'error');
        return;
      }

      // Map the data to include Name, Gender, and quarter grades
      const mappedData = jsonData.map(row => {
        // Format LRN to ensure consistent comparison
        const formattedLRN = String(row.LRN).trim().replace(/^0+/, '');
        const student = studentsInSubject.value.find(s => 
          String(s.lrn).trim().replace(/^0+/, '') === formattedLRN
        );
        
        return {
          LRN: row.LRN,
          Name: student ? `${student.lastName}, ${student.firstName} ${student.middleName}`.trim() : '',
          Gender: student ? student.sex : '',
          Q1: row.Q1 || '',
          Q2: row.Q2 || '',
          Q3: row.Q3 || '',
          Q4: row.Q4 || ''
        };
      });

      validationErrors.value = validateExcelData(mappedData);
      excelData.value = mappedData;
      showExcelPreview.value = true;
    } catch (error) {
      console.error('Error reading Excel file:', error);
      Swal.fire('Error', 'Failed to read Excel file', 'error');
    }
  };
  reader.readAsArrayBuffer(file);
};

const hasRowError = (index) => {
  return validationErrors.value.some(error => error.includes(`Row ${index + 1}`));
};

const getRowErrors = (index) => {
  return validationErrors.value
    .filter(error => error.includes(`Row ${index + 1}`))
    .map(error => error.replace(/^Row \d+: /, ''));
};

const saveValidRows = async () => {
  try {
    // Get all rows with their validation status
    const processedRows = excelData.value.map((row, index) => {
      const rowErrors = validationErrors.value.filter(error => 
        error.startsWith(`Row ${index + 1}:`)
      );
      return {
        row,
        isValid: rowErrors.length === 0,
        errors: rowErrors
      };
    });

    // Filter valid rows for submission
    const validGradesData = processedRows
      .filter(({ isValid }) => isValid)
      .map(({ row }) => {
        const student = studentsInSubject.value.find(s => 
          String(s.lrn).trim().replace(/^0+/, '') === String(row.LRN).trim().replace(/^0+/, '')
        );
        
        // Calculate final grade if all quarters are present
        let finalGrade = null;
        if (row.Q1 && row.Q2 && row.Q3 && row.Q4) {
          finalGrade = (parseFloat(row.Q1) + parseFloat(row.Q2) + 
                       parseFloat(row.Q3) + parseFloat(row.Q4)) / 4;
        }

        // Determine remarks based on final grade
        let remarks = null;
        if (finalGrade !== null) {
          remarks = finalGrade >= 75 ? 'Passed' : 'Failed';
        }

        return {
          Student_ID: student?.student_id,
          Subject_ID: props.subject_id,
          Teacher_ID: JSON.parse(localStorage.getItem('user')).teacher_ID,
          Class_ID: props.class_id,
          Q1: row.Q1 ? parseFloat(row.Q1) : null,
          Q2: row.Q2 ? parseFloat(row.Q2) : null,
          Q3: row.Q3 ? parseFloat(row.Q3) : null,
          Q4: row.Q4 ? parseFloat(row.Q4) : null,
          FinalGrade: finalGrade,
          Remarks: remarks,
          Status: 'Pending'
        };
      });

    if (validGradesData.length === 0) {
      Swal.fire('Error', 'No valid rows to save', 'error');
      return;
    }

    // Show confirmation dialog
    const result = await Swal.fire({
      title: 'Save Valid Rows',
      html: `
        <div class="text-left">
          <p>You have ${validGradesData.length} valid rows and ${excelData.value.length - validGradesData.length} invalid rows.</p>
          <p>Do you want to save only the valid rows?</p>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, save valid rows',
      cancelButtonText: 'No, cancel',
      confirmButtonColor: '#30612E',
      cancelButtonColor: '#d33'
    });

    if (!result.isConfirmed) {
      return;
    }

    const response = await submitGradesToAPI(validGradesData, props.class_id);
    
    if (response.status === 'success') {
      // Close the preview modal
      showExcelPreview.value = false;
      
      // Reset the file input
      if (fileInput.value) {
        fileInput.value.value = '';
      }
      
      // Clear the excel data
      excelData.value = [];
      validationErrors.value = [];

      // Force a complete refresh of all data
      await loadSubjectData();
      
      // Add a small delay to ensure data is loaded
      setTimeout(async () => {
        // Update the selected student's grade if one is selected
        if (selectedStudent.value) {
          const updatedStudent = studentsInSubject.value.find(
            s => s.student_id === selectedStudent.value.student_id
          );
          if (updatedStudent) {
            selectedStudent.value = updatedStudent;
            await loadGrade();
          }
        }

        // Force a re-render of the student list
        studentsInSubject.value = [...studentsInSubject.value];

        // Show success message after data is refreshed
        Swal.fire({
          title: 'Success',
          html: `
            <div class="text-left">
              <p class="text-green-600 font-semibold">Grades imported successfully!</p>
              <p>Saved ${validGradesData.length} out of ${excelData.value.length} rows.</p>
              ${response.errors ? `<p class="text-red-600 mt-4">${response.errors}</p>` : ''}
            </div>
          `,
          icon: 'success',
          confirmButtonColor: '#30612E',
          width: '600px'
        });
      }, 500); // 500ms delay to ensure data is loaded
    } else {
      throw new Error(response.message || 'Failed to import grades');
    }
  } catch (error) {
    console.error('Error saving valid rows:', error);
    Swal.fire('Error', error.message || 'Failed to save grades', 'error');
  }
};

// Add a new function to handle cancel
const handleCancel = async () => {
  // Close the preview modal
  showExcelPreview.value = false;
  
  // Reset the file input
  if (fileInput.value) {
    fileInput.value.value = '';
  }
  
  // Clear the excel data
  excelData.value = [];
  validationErrors.value = [];

  // Force a refresh of the data
  await loadSubjectData();
};
</script>
