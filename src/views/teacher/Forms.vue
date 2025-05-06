<template>
  <div>
    <div class="flex justify-between">
      <p class="title">Forms</p>

      <p class="text-8xl font-extrabold text-[#d6d6d6] relative top-[-30px] z-0">ADVISORY</p>
    </div>

    <div class="rounded-sm" style="box-shadow: rgba(0, 0, 0, 0.2) 0px 0px 1px 1px;">
      <div class="p-5">
        <searchbar v-model="searchQuery" />
      </div>
      <div class="flex border-t-[1px] border-gray-300">
        <div class="w-[30%] max-h-[580px] overflow-y-auto mb-5 rounded-bl-lg">
          <p class="p-4 text-lg font-semibold">Name</p>
          <div v-if="filteredStudents.length > 0">
            <div class="py-5 px-4 text-gray-800 bg-gray-100 mb-1 cursor-pointer"
              v-for="(student, index) in filteredStudents" :key="index" @click="selectStudent(index)" :class="{
                'bg-gray-300': selectedStudent === student,
                'hover:bg-gray-200': true
              }">
              {{ student.firstName }} {{ student.lastName }}
            </div>
          </div>

          <div v-else class="py-5 px-4 text-gray-500 text-center">
            No students available
          </div>
        </div>

        <div class="flex flex-grow flex-col border-l border-gray-300 mb-5 rounded-br-lg p-5 gap-10">
          <div class="flex gap-20">
            <div class="flex flex-col gap-3">
              <p class="text-2xl font-semibold text-blue">STUDENT INFO</p>
              <div class="flex gap-10">
                <div class="flex flex-col gap-3">
                  <p class="text-xs font-bold text-blue">Student Name</p>
                  <p class="text-2xl font-medium">{{ selectedStudentInfo.firstName }} {{ selectedStudentInfo.lastName }}
                  </p>

                  <p class="text-xs font-bold text-blue">LRN</p>
                  <p class="text-2xl font-medium">{{ selectedStudentInfo.lrn }}</p>
                </div>
                <div class="flex flex-col gap-3">
                  <p class="text-xs font-bold text-blue">Sex</p>
                  <p class="text-2xl font-medium">{{ selectedStudentInfo.sex }}</p>

                  <p class="text-xs font-bold text-blue">Curriculum</p>
                  <p class="text-2xl font-medium">{{ selectedStudentInfo.curriculum }}</p>
                </div>
                <div class="flex flex-col gap-3">
                  <p class="text-xs font-bold text-blue">Birthdate</p>
                  <p class="text-2xl font-medium">{{ selectedStudentInfo.birthDate }}</p>

                  <p class="text-xs font-bold text-blue">Address</p>
                  <p class="text-2xl font-medium">{{ selectedStudentInfo.address }}</p>
                </div>
              </div>
            </div>

            <div class="flex gap-5 items-center">
              <div>
                <p class="text-blue text-xs font-bold">GWA</p>
                <input type="text" class="border-[1px] w-35 h-9 text-center" v-model="Grade" readonly />

              </div>
              <div>
                <p class="text-blue text-xs font-bold">Remarks</p>
                <div class="w-35 h-9 border-[1px] rounded-[5px] items-center justify-center flex">
                  <!-- Dynamically show Passed or Failed -->
                  <p class="font-bold" :class="remarksClass">{{ remarks }}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div class="flex justify-between items-center mb-3">
              <p class="text-2xl font-semibold text-blue">GRADES</p>
              <div class="flex gap-2">
                <button
                  class="bg-blue text-white py-2 px-3 rounded-md text-sm font-semibold cursor-pointer hover:bg-[#cecece]"
                  @click="generateCSV('SF10')">SF10</button>
                <button
                  class="bg-blue text-white py-2 px-3 rounded-md text-sm font-semibold cursor-pointer hover:bg-[#cecece]"
                  @click="generateCSV('SF9')">SF9</button>
              </div>
            </div>

            <div>
              <table v-if="studentSubjects.length > 0" class="w-full table-auto">
                <thead>
                  <tr>
                    <th class="bg-gray-100 text-center p-2 text-sm text-gray-700">SUBJECT</th>
                    <th class="bg-gray-100 text-center p-2 text-sm text-gray-700">1ST QUARTER</th>
                    <th class="bg-gray-100 text-center p-2 text-sm text-gray-700">2ND QUARTER</th>
                    <th class="bg-gray-100 text-center p-2 text-sm text-gray-700">3RD QUARTER</th>
                    <th class="bg-gray-100 text-center p-2 text-sm text-gray-700">4TH QUARTER</th>
                    <th class="bg-gray-100 text-center p-2 text-sm text-gray-700">Final Grade</th>
                    <th class="bg-gray-100 text-center p-2 text-sm text-gray-700">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(subject, index) in studentSubjects" :key="index">
                    <td class="p-2 text-center font-semibold text-gray-800">{{ subject.subjectName || "-" }}</td>
                    <td class="p-2 text-center font-semibold text-gray-800">{{ getGrade(subject.subject_id, 'first') ||
                      'No grade' }}</td>
                    <td class="p-2 text-center font-semibold text-gray-800">{{ getGrade(subject.subject_id, 'second') ||
                      'No grade' }}</td>
                    <td class="p-2 text-center font-semibold text-gray-800">{{ getGrade(subject.subject_id, 'third') ||
                      'No grade' }}</td>
                    <td class="p-2 text-center font-semibold text-gray-800">{{ getGrade(subject.subject_id, 'fourth') ||
                      'No grade' }}</td>
                    <td class="p-2 text-center font-semibold text-gray-800">{{ calculateGWA(subject.subject_id) ||
                      'No grade' }}</td>
                    <td class="p-2 text-center font-semibold text-gray-800">{{ getRemarks(subject.subject_id) }}</td>
                  </tr>
                </tbody>
              </table>

              <div v-else class="py-5 text-center text-gray-500">
                No subjects available
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import searchbar from '@/components/searchbar.vue';

const searchQuery = ref('');
const students = ref([]);
const subjects = ref([]);
const selectedStudent = ref(null);
const studentSubjects = ref([]);
const Grade = ref('');

onMounted(() => {
  const storedStudents = localStorage.getItem('students');
  const storedSubjects = localStorage.getItem('subjects');

  students.value = storedStudents ? JSON.parse(storedStudents) : [];
  subjects.value = storedSubjects ? JSON.parse(storedSubjects) : [];

  if (subjects.value.length > 0) {
    const firstSubject = subjects.value[0];
    students.value = students.value.filter(student =>
      firstSubject.student_id.includes(student.student_id)
    );

    if (students.value.length > 0) {
      selectStudent(0);
    }
  }
});

const filteredStudents = computed(() => {
  return students.value.filter(student =>
    student.firstName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    student.lastName.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const selectStudent = (index) => {
  selectedStudent.value = students.value[index];
  const studentId = selectedStudent.value.student_id;
  studentSubjects.value = subjects.value.filter(subject =>
    subject.student_id.includes(studentId)
  );
};

const selectedStudentInfo = computed(() => {
  return selectedStudent.value || {
    firstName: '',
    lastName: '',
    lrn: '',
    sex: '',
    curriculum: '',
    birthDate: '',
    academicTrack: ''
  };
});

const remarks = computed(() => {
  if (!Grade.value || isNaN(parseFloat(Grade.value))) {
    return 'No grade';
  }
  return parseFloat(Grade.value) >= 75 ? 'Passed' : 'Failed';
});

const remarksClass = computed(() => {
  return remarks.value === 'Passed' ? 'text-green-600' : 'text-red-600';
});

const calculateAverageGrade = computed(() => {
  if (!selectedStudent.value || studentSubjects.value.length === 0) {
    return '';
  }

  const finalGrades = studentSubjects.value.map(subject => {
    const gwa = calculateGWA(subject.subject_id);
    return gwa !== 'No grade' && gwa !== 'INC' ? parseFloat(gwa) : null;
  }).filter(grade => grade !== null);

  if (finalGrades.length === 0) {
    return '';
  }

  const average = finalGrades.reduce((sum, grade) => sum + grade, 0) / finalGrades.length;
  return average.toFixed(2);
});

watch(selectedStudent, () => {
  Grade.value = calculateAverageGrade.value;
});

watch(studentSubjects, () => {
  Grade.value = calculateAverageGrade.value;
}, { deep: true });

const generateCSV = (type) => {
  const student = selectedStudent.value;

  if (!student) return;

  if (type === 'SF10') {
    const csvContent = [
      ['First Name', 'Last Name', 'LRN', 'Sex', 'Curriculum', 'Birthdate', 'Address'],
      [student.firstName, student.lastName, student.lrn, student.sex, student.curriculum, student.birthDate, student.address]
    ];
    downloadCSV(csvContent, 'SF10_Learners_Info.csv');
  } else if (type === 'SF9') {
    const csvContent = [
      ['Subject', '1st Quarter', '2nd Quarter', '3rd Quarter', '4th Quarter', 'Final Grade', 'Remarks']
    ];

    studentSubjects.value.forEach(subject => {
      csvContent.push([
        subject.subjectName || '-',
        getGrade(subject.subject_id, 'first'),
        getGrade(subject.subject_id, 'second'),
        getGrade(subject.subject_id, 'third'),
        getGrade(subject.subject_id, 'fourth'),
        calculateGWA(subject.subject_id),
        getRemarks(subject.subject_id)
      ]);
    });

    downloadCSV(csvContent, 'SF9_Report_Card.csv');
  }
};

const getGrade = (subjectId, quarter) => {
  const key = `subject_${subjectId}`;
  const subjectData = JSON.parse(localStorage.getItem(key)) || [];
  const student = subjectData.find(student => student.student_id === selectedStudent.value.student_id);

  if (student) {
    return student.grades ? student.grades[quarter] : 'No grade';
  }
  return 'No grade';
};

const calculateGWA = (subjectId) => {
  const key = `subject_${subjectId}`;
  const subjectData = JSON.parse(localStorage.getItem(key)) || [];

  if (subjectData.length === 0) {
    return 'No grade';
  }

  const student = subjectData.find(student => student.student_id === selectedStudent.value.student_id);

  if (student && student.grades) {
    const grades = [
      student.grades['first'],
      student.grades['second'],
      student.grades['third'],
      student.grades['fourth']
    ];

    // Check if all grades are empty or invalid
    if (grades.every(grade => grade === undefined || !grade || grade === null || grade === '' || grade === '-' || grade === 'No grade')) {
      return 'No grade';
    }

    // Filter out invalid grades and convert to numbers
    const validGrades = grades
      .filter(grade => grade !== undefined && grade && grade !== null && grade !== '' && grade !== '-' && grade !== 'No grade')
      .map(grade => parseFloat(grade));

    // If there's at least one valid grade, calculate the average
    if (validGrades.length > 0) {
      const average = validGrades.reduce((sum, grade) => sum + grade, 0) / validGrades.length;
      return isNaN(average) ? 'No grade' : average.toFixed(2);
    }
  }

  return 'No grade';
};

const getRemarks = (subjectId) => {
  const gwa = calculateGWA(subjectId);

  if (gwa === "No grade" || gwa === "INC" || parseFloat(gwa) <= 75) {
    return "Failed";
  }

  return "Passed";
};

const downloadCSV = (csvContent, fileName) => {
  const blob = new Blob([csvContent.map(row => row.join(',')).join('\n')], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', fileName);
  link.click();
};
</script>
