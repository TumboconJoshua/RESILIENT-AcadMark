<template>
  <div class="flex justify-between m-5">
    <div class="flex justify-between w-90">
      <Dropdown :showSort="true" v-model="selectedSort" />
    </div>

    <div class="flex justify-between gap-5">
      <div>
        <Searchbar v-model="searchQuery" />
      </div>
      <button @click="generateCSV"
        class="bg-[#30612E] text-white px-5 py-1 rounded-md hover:bg-[#cecece] transition-colors cursor-pointer duration-200">
        <p class="w-full">Generate Report</p>
      </button>
    </div>
  </div>

  <div class="p-5 rounded-[5px]">
    <div class="relative">
      <div class="max-h-[600px] overflow-y-auto">
        <table class="w-full border-collapse border-none rounded-[5px]">
          <thead class="bg-gray-100 sticky top-0">
            <tr>
              <th v-for="header in headers" :key="header"
                class="px-4 py-2 text-[#464F60] text-[16px] font-semibold text-center">
                {{ header }}
              </th>
            </tr>
          </thead>
          <tbody class="text-center font-medium">
            <tr v-if="filteredStudents.length === 0">
              <td colspan="9" class="px-4 py-2">No students available.</td>
            </tr>
            <tr v-for="student in filteredStudents" :key="student.lrn">
              <td class="px-4 py-2">{{ student.lrn }}</td>
              <td class="px-4 py-2">{{ student.lastName + ", " + student.firstName + " " +
                student.middleName }}
              </td>
              <td class="px-4 py-2">{{ student.sex }}</td>
              <td class="px-4 py-2">{{ getGradeForQuarter(student, "first") }}</td>
              <td class="px-4 py-2">{{ getGradeForQuarter(student, "second") }}</td>
              <td class="px-4 py-2">{{ getGradeForQuarter(student, "third") }}</td>
              <td class="px-4 py-2">{{ getGradeForQuarter(student, "fourth") }}</td>
              <td class="px-4 py-2">{{ getFinalGrade(student) }}</td>
              <td :class="getRemarks(student) === 'Passed' ? 'text-[#23AD00]' : 'text-[#FF0000]'"
                class="px-4 py-2 font-bold">
                {{ getRemarks(student) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import Dropdown from '@/components/dropdown.vue';
import Searchbar from '@/components/searchbar.vue';
import Swal from 'sweetalert2';
import { getSubjectGrades } from '@/service/gradeService';

const props = defineProps({
  subject_id: {
    type: String,
    required: true,
  },
  subjectName: {
    type: String,
    required: true,
  },
  class_id: {
    type: String,
    required: true,
  },
  trackStand: {
    type: String,
    required: true,
  },
  className: {
    type: String,
    required: true,
  },
  classType: {
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
  gradeLevel: {
    type: String,
    required: true,
  },
});

const headers = ref([
  'LRN', 'Name', 'Gender', '1st Quarter', '2nd Quarter', '3rd Quarter', '4th Quarter', 'Final Grade', 'Remarks'
]);

const students = ref([]);
const selectedSort = ref('default');
const searchQuery = ref('');
const loading = ref(true);
const error = ref(null);

const loadSubjectData = async () => {
  loading.value = true;
  error.value = '';

  try {
    const response = await getSubjectGrades(props.subject_id, props.class_id);
    console.log('API Response:', response);

    if (response?.status === 'success' && Array.isArray(response.data)) {
      students.value = response.data.map((student) => ({
        lrn: student.student?.LRN || '-',
        firstName: student.student?.FirstName || '-',
        middleName: student.student?.MiddleName || '-',
        lastName: student.student?.LastName || '-',
        sex: student.student?.sex || '-',
        status: student.Status || 'pending',
        grades: {
          first: student.Q1 || null,
          second: student.Q2 || null,
          third: student.Q3 || null,
          fourth: student.Q4 || null,
        },
        finalGrade: student.FinalGrade || '-',
        remarks: student.Remarks || '-',
      }));
    } else {
      error.value = 'No students found for this subject and class.';
      students.value = [];
    }
  } catch (err) {
    error.value = 'Failed to load student data. Please try again.';
    console.error('Error loading subject data:', err);
  } finally {
    loading.value = false;
  }
};

const getGradeForQuarter = (student, quarter) => {
  if (!student.status || student.status.toLowerCase() !== 'approved') {
    return '-';
  }

  const grade = student.grades?.[quarter];
  if (!grade || grade === null || grade === undefined || grade === '' || grade === '-' || grade === 'No grade') {
    return '-';
  }
  return grade;
};

const getFinalGrade = (student) => {
  if (!student.status || student.status.toLowerCase() !== 'approved') {
    return '-';
  }

  const grades = ['first', 'second', 'third', 'fourth'];
  let total = 0;
  let gradeCount = 0;
  let hasAnyValidGrade = false;

  for (let quarter of grades) {
    const grade = getGradeForQuarter(student, quarter);
    if (grade !== '-' && !isNaN(parseFloat(grade))) {
      hasAnyValidGrade = true;
      total += parseFloat(grade);
      gradeCount++;
    }
  }

  if (!hasAnyValidGrade) return '-';
  if (gradeCount < 4) return '-';

  return (total / gradeCount).toFixed(2);
};

const getRemarks = (student) => {
  if (!student.status || student.status.toLowerCase() !== 'approved') {
    return '-';
  }

  const finalGrade = getFinalGrade(student);
  if (finalGrade === '-') return '-';
  return parseFloat(finalGrade) >= 74.5 ? 'Passed' : 'Failed';
};

const gradeToNumeric = (grade) => {
  if (grade === '-') return -1;
  if (grade === 'INC') return 0;
  return parseFloat(grade);
};

const filteredStudents = computed(() => {
  let sortedStudents = students.value.filter((student) => {
    const fullName = (
      student.firstName +
      ' ' +
      student.middleName +
      ' ' +
      student.lastName
    ).toLowerCase();
    return fullName.includes(searchQuery.value.toLowerCase());
  });

  switch (selectedSort.value) {
    case 'Sort by A-Z':
      sortedStudents.sort((a, b) => a.lastName.localeCompare(b.lastName));
      break;
    case 'Sort by Z-A':
      sortedStudents.sort((a, b) => b.lastName.localeCompare(a.lastName));
      break;
    case 'Sort by Grade (Highest)':
      sortedStudents.sort((a, b) => {
        const gradeA = getFinalGrade(a);
        const gradeB = getFinalGrade(b);
        return gradeToNumeric(gradeB) - gradeToNumeric(gradeA);
      });
      break;
    case 'Sort by Grade (Lowest)':
      sortedStudents.sort((a, b) => {
        const gradeA = getFinalGrade(a);
        const gradeB = getFinalGrade(b);
        return gradeToNumeric(gradeA) - gradeToNumeric(gradeB);
      });
      break;
    default:
      break;
  }

  return sortedStudents;
});

const generateCSV = () => {
  const date = new Date().toLocaleDateString().replace(/\//g, '-');

  const csvContent = [
    headers.value.join(','),
    ...filteredStudents.value.map((student) =>
      [
        student.lrn,
        `${student.lastName}, ${student.firstName} ${student.middleName}`.trim(),
        student.sex,
        getGradeForQuarter(student, 'first'),
        getGradeForQuarter(student, 'second'),
        getGradeForQuarter(student, 'third'),
        getGradeForQuarter(student, 'fourth'),
        getFinalGrade(student),
        getRemarks(student),
      ].join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute(
    'download',
    `Grades Summary - ${props.subjectName} - ${date}.csv`
  );
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

onMounted(() => {
  loadSubjectData();
});
</script>
