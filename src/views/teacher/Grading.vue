<template>
  <div class="flex max-h-[412px] overflow-x-auto scrollbar-hide">
    <!-- Left Section: Student Selection -->
    <div class="px-5 py-3 border-r border-[#d0d0d0]">
      <div class="flex items-center gap-5">
        <Dropdown :showQuarter="true" v-model="selectedQuarter" />
        <Dropdown :showMarkStatus="true" v-model="selectedMarkStatus" />
        <p class="font-semibold text-lg">{{ formattedDate }}</p>
      </div>

      <!-- Select All Checkbox -->
      <div class="mt-4 flex items-center justify-end gap-2">
        <label for="select-all" class="ml-2 text-xs">Select All</label>
        <input type="checkbox" class="checkbox mr-[35px]" id="select-all" v-model="selectAll"
          @change="toggleSelectAll" />
      </div>

      <!-- Displaying Student Names Dynamically -->
      <div v-if="filteredStudents.length > 0" class="mt-4 overflow-y-auto overflow-x-auto scrollbar-hide max-h-[230px]">
        <ul>
          <li v-for="(student, index) in filteredStudents" :key="index"
            class="flex justify-between py-2 mr-3 rounded-md transition-colors duration-200 px-2 cursor-pointer"
            :class="{ 'bg-blue-100 border-blue': isSelectedStudent(student) }"
            @click="handleStudentClick(student)">
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

      <p v-else class="mt-4 text-red-500">
        No students found for this subject.
      </p>

      <div class="flex justify-end mt-2 mr-5">
        <button 
          class="bg-blue px-3 py-2 text-xs font-semibold text-white rounded-sm cursor-pointer"
          :class="{ 'opacity-50 cursor-not-allowed': !canSubmitGrades, 'hover:bg-[#cecece]': canSubmitGrades }"
          @click="submitGrades"
          :disabled="!canSubmitGrades">
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
              <p class="text-2xl font-medium">{{ selectedStudent ? selectedStudent.firstName + " " + 
                selectedStudent.middleName + " " + selectedStudent.lastName : '(Select a Student)' }}</p>
            </div>
            <div>
              <p class="text-blue text-xs font-bold">LRN</p>
              <p class="text-2xl font-medium">{{ selectedStudent ? selectedStudent.lrn : 'N/A' }}</p>
            </div>
          </div>
          <div class="flex flex-col gap-1">
            <div>
              <p class="text-blue text-xs font-bold">Sex</p>
              <p class="text-2xl font-medium">{{ selectedStudent ? selectedStudent.sex : 'N/A' }}</p>
            </div>
            <div>
              <p class="text-blue text-xs font-bold">Curriculum</p>
              <p class="text-2xl font-medium">{{ getCurriculumLevel() }}</p>
            </div>
          </div>
          <div class="flex flex-col gap-1">
            <div>
              <p class="text-blue text-xs font-bold">Birthdate</p>
              <p class="text-2xl font-medium">{{ selectedStudent ? selectedStudent.birthDate : 'N/A' }}</p>
            </div>
            <div>
              <p class="text-blue text-xs font-bold">Academic Track</p>
              <p class="text-2xl font-medium">{{ trackStand }}</p>
            </div>
          </div>
        </div>
      </div>

      <p class="text-blue font-semibold text-2xl">GRADING</p>
      <div class="flex flex-col gap-3">
        <div class="flex gap-5">
          <div>
            <p class="text-blue text-xs font-bold">Quarter Grade</p>
            <input 
              type="text" 
              class="border-[1px] w-35 h-9 text-center" 
              v-model="Grade" 
              @input="validateGrade"
              maxlength="3" 
              pattern="[0-9]*" 
              inputmode="numeric" 
              :disabled="!canInputGrade" />
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

      <button 
        class="max-w-28 h-8 rounded-md text-white font-semibold text-md hover:bg-[#cecece] cursor-pointer"
        :class="isEditMode ? 'bg-yellow-500' : 'bg-blue'"
        @click="toggleEditMode">
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
import { submitGrades as apiSubmitGrades } from '@/service/gradeService';
import Swal from 'sweetalert2';
import { useRoute } from 'vue-router';

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

const quarterMapping = {
  '1st': 'first',
  '2nd': 'second',
  '3rd': 'third',
  '4th': 'fourth',
};

const loadGrade = () => {
  if (selectedStudent.value) {
    const gradeKey = quarterMapping[selectedQuarter.value];
    const localStorageKey = `grade_${selectedStudent.value.student_id}_${props.subject_id}_${gradeKey}`;
    const storedGrade = localStorage.getItem(localStorageKey);
    
    // Check previous quarters
    const checkResult = checkPreviousQuarters(selectedStudent.value, selectedQuarter.value);
    if (!checkResult.canGrade) {
      // Disable the input if previous quarters are not graded
      isEditMode.value = true; // This will disable the input
      Grade.value = ''; // Clear the grade value
    } else {
      // Enable the input if all previous quarters are graded
      isEditMode.value = false;
      Grade.value = storedGrade || selectedStudent.value.grades[gradeKey] || '';
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
  return parseFloat(Grade.value) <= 75 ? 'Failed' : 'Passed';
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

function saveGradesToLocalStorage() {
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

  const gradeKey = quarterMapping[selectedQuarter.value];
  const localStorageKey = `grade_${selectedStudent.value.student_id}_${props.subject_id}_${gradeKey}`;
  
  // Check if grade is below 73
  if (parseFloat(Grade.value) < 73) {
    Swal.fire({
      title: 'Warning: Low Grade',
      text: `Are you sure you want to give ${selectedStudent.value.firstName} ${selectedStudent.value.lastName} a grade of ${Grade.value}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, save grade',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.setItem(localStorageKey, Grade.value);
        selectedStudent.value.grades[gradeKey] = Grade.value;
        Swal.fire('Success', 'Grade saved to local storage!', 'success');
      }
    });
  } else {
    localStorage.setItem(localStorageKey, Grade.value);
    selectedStudent.value.grades[gradeKey] = Grade.value;
    Swal.fire('Success', 'Grade saved to local storage!', 'success');
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
    const localStorageKey = `grade_${student.student_id}_${props.subject_id}_${gradeKey}`;
    const storedGrade = localStorage.getItem(localStorageKey);
    const grade = storedGrade || student.grades[gradeKey];
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

  const gradesData = selectedStudents.map((student) => ({
    Student_ID: student.student_id,
    Subject_ID: props.subject_id,
    Teacher_ID: JSON.parse(localStorage.getItem('user')).teacher_ID,
    Class_ID: classId,
    Q1: student.grades.first || null,
    Q2: student.grades.second || null,
    Q3: student.grades.third || null,
    Q4: student.grades.fourth || null,
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
    try {
      await apiSubmitGrades(gradesData, classId);
      Swal.fire('Success', 'Grades submitted successfully!', 'success');
    } catch (error) {
      console.error('Error:', error.response?.data);
      Swal.fire('Error', error.response?.data?.message || 'Failed to submit grades.', 'error');
    }
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
  return finalGrade ? (finalGrade >= 75 ? 'Passed' : 'Failed') : null;
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
  return parseFloat(Grade.value) <= 75 ? 'text-red-500' : 'text-green-500';
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
  try {
    const classId = props.class_id || route.params.class_id;
    if (!classId) {
      console.error('Class ID is missing');
      return;
    }

    const response = await classService.getClassStudents(classId);
    console.log('Fetched grades from database:', response);

    if (response.status === 'success' && response.data && Array.isArray(response.data)) {
      // Update students with grades from database
      studentsInSubject.value = response.data.map((student) => {
        const grades = {
          first: student.grades?.first || null,
          second: student.grades?.second || null,
          third: student.grades?.third || null,
          fourth: student.grades?.fourth || null
        };

        // Merge with localStorage grades if they exist
        Object.keys(quarterMapping).forEach(quarter => {
          const gradeKey = quarterMapping[quarter];
          const localStorageKey = `grade_${student.student_id}_${props.subject_id}_${gradeKey}`;
          const storedGrade = localStorage.getItem(localStorageKey);
          
          if (storedGrade) {
            grades[gradeKey] = storedGrade;
          }
        });

        return {
          ...student,
          selected: false,
          grades: grades
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
    await fetchGradesFromDatabase();
  } catch (error) {
    console.error('Error loading subject data:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to load student data. Please try again.',
      confirmButtonColor: '#dc2626'
    });
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
  Grade.value = Grade.value.replace(/[^0-9]/g, '');
  const numValue = parseInt(Grade.value);
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

// Modify the hasGrade computed property to prioritize localStorage
const hasGrade = computed(() => {
  return (student) => {
    const gradeKey = quarterMapping[selectedQuarter.value];
    // Always check localStorage first
    const localStorageKey = `grade_${student.student_id}_${props.subject_id}_${gradeKey}`;
    const storedGrade = localStorage.getItem(localStorageKey);
    
    // Return true if there's a valid grade in localStorage or student.grades
    return (storedGrade !== null && storedGrade !== '') || 
           (student.grades[gradeKey] !== null && student.grades[gradeKey] !== '');
  };
});

// Add a watcher for the Grade input
watch(Grade, (newValue) => {
  if (selectedStudent.value) {
    const gradeKey = quarterMapping[selectedQuarter.value];
    // Update the selected student's grade in the grades object
    selectedStudent.value.grades[gradeKey] = newValue;
    
    // Save to localStorage immediately
    const localStorageKey = `grade_${selectedStudent.value.student_id}_${props.subject_id}_${gradeKey}`;
    localStorage.setItem(localStorageKey, newValue);
  }
}, { immediate: true });

// Add a new function to check if previous quarters are graded
function checkPreviousQuarters(student, currentQuarter) {
  const quarterOrder = ['1st', '2nd', '3rd', '4th'];
  const currentIndex = quarterOrder.indexOf(currentQuarter);
  
  // Check all previous quarters
  for (let i = 0; i < currentIndex; i++) {
    const prevQuarter = quarterOrder[i];
    const gradeKey = quarterMapping[prevQuarter];
    const localStorageKey = `grade_${student.student_id}_${props.subject_id}_${gradeKey}`;
    const storedGrade = localStorage.getItem(localStorageKey);
    const grade = storedGrade || student.grades[gradeKey];
    
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
</script>
