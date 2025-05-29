<template>
    <Teleport to="body">
        <div v-if="showLis || selectedStudent || showSubmitSuccess" class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
            <div class="w-full max-w-6xl max-h-[90vh] mx-4">
                <div v-if="showLis" class="bg-white rounded-xl shadow-2xl relative">
                    <div class="p-6 border-b border-gray-200">
                        <h2 class="text-2xl font-semibold text-gray-800">Student Grades</h2>
                    </div>
                    <button @click="emit('close')"
                        class="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex cursor-pointer items-center justify-center shadow-lg transition-colors duration-200">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clip-rule="evenodd" />
                        </svg>
                    </button>
                    <div class="overflow-x-auto">
                        <div class="max-h-[60vh] overflow-y-auto">
                            <table class="w-full">
                                <thead class="bg-gray-50 sticky top-0">
                                    <tr class="text-semibold text-gray-700 text-[15px]">
                                        <th class="px-6 py-4 text-left">LRN</th>
                                        <th class="px-6 py-4 text-left">Full Name</th>
                                        <th class="px-6 py-4 text-center" colspan="4">Quarter</th>
                                        <th class="px-6 py-4 text-center">Average</th>
                                        <th class="px-6 py-4 text-center">Remarks</th>
                                    </tr>
                                    <tr class="text-semibold text-gray-700 text-[15px]">
                                        <th class="px-6 py-4"></th>
                                        <th class="px-6 py-4"></th>
                                        <th class="px-6 py-4 text-center">Q1</th>
                                        <th class="px-6 py-4 text-center">Q2</th>
                                        <th class="px-6 py-4 text-center">Q3</th>
                                        <th class="px-6 py-4 text-center">Q4</th>
                                        <th class="px-6 py-4"></th>
                                        <th class="px-6 py-4"></th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-gray-200">
                                    <!-- Loading State -->
                                    <tr v-if="loading">
                                        <td colspan="8" class="px-6 py-4 text-center">Loading...</td>
                                    </tr>
                                    
                                    <!-- Error State -->
                                    <tr v-else-if="error">
                                        <td colspan="8" class="px-6 py-4 text-center text-red-500">{{ error }}</td>
                                    </tr>
                                    
                                    <!-- Empty State -->
                                    <tr v-else-if="!students.length">
                                        <td colspan="8" class="px-6 py-4 text-center">No students found</td>
                                    </tr>
                                    
                                    <!-- Data Rows -->
                                    <tr v-else v-for="(student, index) in students" :key="`${student.student_id}-${index}`" class="hover:bg-gray-50">
                                        <td class="px-6 py-4 whitespace-nowrap">{{ student.lrn }}</td>
                                        <td class="px-6 py-4 whitespace-nowrap">{{ student.firstName }} {{ student.middleName }} {{ student.lastName }}</td>
                                        <td class="px-6 py-4 text-center">{{ student.grades.first || '-' }}</td>
                                        <td class="px-6 py-4 text-center">{{ student.grades.second || '-' }}</td>
                                        <td class="px-6 py-4 text-center">{{ student.grades.third || '-' }}</td>
                                        <td class="px-6 py-4 text-center">{{ student.grades.fourth || '-' }}</td>
                                        <td class="px-6 py-4 text-center font-medium">{{ calculateAverage(student.grades) }}</td>
                                        <td class="px-6 py-4 text-center">
                                            <span :class="{
                                                'px-3 py-1 rounded-full text-sm font-medium': true,
                                                'bg-green-100 text-green-800': getRemarks(student) === 'Passed',
                                                'bg-red-100 text-red-800': getRemarks(student) === 'Failed'
                                            }">
                                                {{ getRemarks(student) }}
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div v-else-if="currentStudent" class="bg-white rounded-xl shadow-2xl relative max-w-4xl mx-auto">
                    <div class="p-6 border-b border-gray-200">
                        <h2 class="text-2xl font-semibold text-gray-800">Student Information</h2>
                    </div>
                    <div class="p-10 flex flex-col gap-5">
                        <div class="flex flex-col gap-3">
                            <div class="flex gap-10">
                                <div class="flex flex-col gap-1">
                                    <div>
                                        <p class="text-blue text-xs font-bold">Student Name</p>
                                        <p class="text-2xl font-medium">{{ currentStudent.firstName }} {{ currentStudent.middleName }} {{ currentStudent.lastName }}</p>
                                    </div>
                                    <div>
                                        <p class="text-blue text-xs font-bold">LRN</p>
                                        <p class="text-2xl font-medium">{{ currentStudent.lrn }}</p>
                                    </div>
                                </div>
                                <div class="flex flex-col gap-1">
                                    <div>
                                        <p class="text-blue text-xs font-bold">Sex</p>
                                        <p class="text-2xl font-medium">{{ currentStudent.sex }}</p>
                                    </div>
                                    <div>
                                        <p class="text-blue text-xs font-bold">Curriculum</p>
                                        <p class="text-2xl font-medium">{{ currentStudent.curriculum }}</p>
                                    </div>
                                </div>
                                <div class="flex flex-col gap-1">
                                    <div>
                                        <p class="text-blue text-xs font-bold">Birthdate</p>
                                        <p class="text-2xl font-medium">{{ currentStudent.birthDate }}</p>
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
                                    <input type="text" class="border w-35 h-9 text-center" v-model="quarterGrade"
                                        readonly />
                                </div>
                                <div>
                                    <p class="text-blue text-xs font-bold">Remarks</p>
                                    <div class="w-35 h-9 border rounded-[5px] items-center justify-center flex">
                                        <p class="font-bold"
                                            :class="{ 'text-[#23AD00]': getRemarks(currentStudent) === 'Passed', 'text-red-500': getRemarks(currentStudent) === 'Failed' }">
                                            {{ getRemarks(currentStudent) }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <p class="text-blue font-semibold text-2xl">Comment</p>
                            <textarea class="w-full h-32 text-left p-2 rounded-[12px] border border-black resize-none"
                                readonly>ADMIN COMMENT...</textarea>
                        </div>

                        <div class="flex justify-end gap-2">
                            <button
                                class="font-light text-lg bg-[#656464] px-6 py-2 text-white rounded-md cursor-pointer hover:bg-[#cecece]"
                                @click="emit('close')">Close</button>
                            <div class="relative group">
                                <button
                                    class="font-light text-lg bg-[#0C5A48] px-6 py-2 text-white rounded-md hover:bg-[#cecece]">
                                    Edit
                                </button>
                                <div
                                    class="tooltip absolute invisible bg-black text-white text-sm rounded-md px-3 py-2 bottom-full mb-2 opacity-0 group-hover:visible w-50 group-hover:opacity-100">
                                    You can only edit once it's not accepted
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <!-- Success Modal -->
                <div v-else-if="showSubmitSuccess" class="bg-white rounded-xl p-8 text-center shadow-xl max-w-sm w-full mx-auto">
                    <h2 class="text-xl font-semibold text-green-600 mb-4">Success!</h2>
                    <p class="text-gray-700">Grades have been successfully submitted.</p>
                    <button @click="emit('close')"
                        class="mt-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                        OK
                    </button>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
import { ref, computed, watchEffect, onMounted } from 'vue';
import { getSubjectGrades } from '@/service/gradeService';
import Swal from 'sweetalert2';

const emit = defineEmits(['close']);

const props = defineProps({
    subject_id: {
        type: String,
        required: false,
        default: null
    },
    class_id: {
        type: String,
        required: false,
        default: null
    },
    showLis: {
        type: Boolean,
        required: true
    },
    showMessage: {
        type: Boolean,
        required: true
    },
    selectedStudent: {
        type: Object,
        required: false,
        default: null
    },
    selectedQuarter: {
        type: String,
        required: true,
    },
    trackStand: {
        type: String,
        required: false,
    },
    subjectName: {
        type: String,
        required: true,
    },
    students: {
        type: Array,
        required: true,
        default: () => []
    }
});

const students = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchStudents = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    if (!props.subject_id) {
      console.warn('No subject_id provided to modal');
      students.value = [];
      return;
    }
    
    console.log('Fetching students for subject_id:', props.subject_id, 'class_id:', props.class_id);
    
    const response = await getSubjectGrades(props.subject_id, props.class_id);
    console.log('API Response:', response);
    
    if (response.status === 'success' && response.data) {
      students.value = response.data.map(student => ({
        student_id: student.Student_ID,
        lrn: student.student?.LRN || '-',
        firstName: student.student?.FirstName || '',
        middleName: student.student?.MiddleName || '',
        lastName: student.student?.LastName || '',
        sex: student.student?.sex || '',
        birthDate: student.student?.birthDate || '',
        curriculum: student.student?.curriculum || '',
        grades: {
          first: student.Q1 || null,
          second: student.Q2 || null,
          third: student.Q3 || null,
          fourth: student.Q4 || null
        },
        status: student.Status || 'pending'
      }));
      console.log('Processed students:', students.value);
    } else {
      throw new Error(response.message || 'Failed to fetch grades');
    }
  } catch (error) {
    console.error('Error fetching grades:', error);
    error.value = error.message || 'Failed to fetch grades. Please try again.';
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message || 'Failed to fetch grades. Please try again.',
      confirmButtonColor: '#dc2626'
    });
  } finally {
    loading.value = false;
  }
};

const quarterMapping = {
    "1st": "first",
    "2nd": "second",
    "3rd": "third",
    "4th": "fourth"
};

const calculateAverage = (grades) => {
    if (!grades) return '-';
    
    const allGradesEmpty = [grades.first, grades.second, grades.third, grades.fourth].every(grade => grade === '-' || grade === '' || grade === null);

    if (allGradesEmpty) {
        return '-';
    }

    const anyGradeMissing = [grades.first, grades.second, grades.third, grades.fourth].some(grade => grade === '-' || grade === '' || grade === null);

    if (anyGradeMissing) {
        return 'INC';
    }

    const gradeValues = Object.values(grades)
        .map(grade => grade !== '-' && grade !== '' && grade !== null ? parseFloat(grade) : NaN)
        .filter(val => !isNaN(val));

    if (gradeValues.length === 0) {
        return 'INC';
    }

    const total = gradeValues.reduce((acc, curr) => acc + curr, 0);
    return (total / gradeValues.length).toFixed(2);
};

const getRemarks = (student) => {
    if (!student.grades) return '-';
    
    // Check if all quarters have valid grades
    const allQuartersComplete = ['first', 'second', 'third', 'fourth'].every(quarter => {
        const grade = student.grades[quarter];
        return grade && grade !== '-' && grade !== '' && grade !== null;
    });

    // If any quarter is missing, return '-'
    if (!allQuartersComplete) {
        return '-';
    }

    const quarterGrade = calculateAverage(student.grades);

    // Only show Passed/Failed if we have a valid numeric grade
    if (quarterGrade === '-' || quarterGrade === null || quarterGrade === '' || quarterGrade === 'INC') {
        return '-';
    }

    return parseFloat(quarterGrade) >= 75 ? 'Passed' : 'Failed';
};

onMounted(() => {
  console.log('Modal mounted, props:', props);
  if (props.subject_id) {
    fetchStudents();
  } else {
    console.warn('No subject_id provided to modal');
  }
});

const quarterGrade = computed(() => {
    if (currentStudent.value) {
        const quarterKey = quarterMapping[props.selectedQuarter];
        return currentStudent.value.grades[quarterKey] || '-';
    }
    return '-';
});

watchEffect(() => {
  if (props.subject_id && props.selectedStudent) {
    fetchStudents();
  }
});

// Add this computed property to get the current student data
const currentStudent = computed(() => {
  if (!props.selectedStudent || !students.value) return null;
  return students.value.find(student => student.student_id === props.selectedStudent.Student_ID);
});
</script>
