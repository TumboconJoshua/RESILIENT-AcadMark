<template>
  <div class="flex flex-col gap-10 py-5 px-5 overflow-x-hidden ssm:w-[75vw] sm:w-[80vw] md:w-[84vw] max-w-[84vw]">
    <h1 class="title">Dashboard</h1>

    <div class="flex ssm:flex-col sm:w-full md:flex-row justify-between ssm:gap-3 md:gap-10">
      <div class="p-5 border-blue border-2 ssm:w-full md:w-1/2 rounded-2xl overflow-hidden">
        <p class="font-semibold text-[32px]">Advisory Class</p>

        <div class="flex ssm:flex-col md:flex-row gap-10 p-5 items-center">
          <div
            class="flex items-center border-2 gap-5 border-blue ssm:px-5 ssm:py-2 md:px-10 md:py-17 rounded-2xl ssm:w-full ssm:justify-center ssm:items-center md:w-auto">
            <div class="text-center">
              <p class="font-medium text-5xl">{{ advisoryStats.total }}</p>
              <p>Total Students</p>
            </div>
            <div><img src="/assets/img/dashboard/total.png" alt="" class="w-auto"></div>
          </div>

          <div class="flex md:flex-col ssm:flex-row gap-5 ssm:justify-between md:items-center w-full">
            <div class="flex items-center border-2 border-blue gap-2 px-2 py-5 rounded-xl w-full">
              <img src="/assets/img/dashboard/male.png" alt="" class="w-auto ssm:w-7">
              <p class="text-[40px] ssm:text-[30px] font-medium">{{ advisoryStats.male }}</p>
              <p class="text-base">Male Students</p>
            </div>

            <div class="flex items-center border-2 border-blue gap-2 px-2 py-5 rounded-xl w-full">
              <img src="/assets/img/dashboard/female.png" alt="" class="w-auto ssm:w-7">
              <p class="text-[40px] ssm:text-[30px] font-medium">{{ advisoryStats.female }}</p>
              <p class="text-base">Female Students</p>
            </div>
          </div>
        </div>
      </div>

      <div class="ssm:w-full md:w-1/2 border border-[#cecece] p-5 rounded-2xl overflow-hidden"
        style="box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;">
        <p class="font-semibold text-[32px]">Subject Class</p>

        <div class="flex flex-row gap-10 p-5 items-center">
          <div
            class="w-40 aspect-square rounded-full border-15 border-blue text-center flex flex-col justify-center items-center p-4">
            <p class="text-3xl font-semibold leading-tight">{{subjectClasses.reduce((sum, cls) => sum + cls.count, 0)}}
            </p>
            <p class="text-base leading-tight">TOTAL</p>
            <p class="text-base leading-tight">STUDENTS</p>
          </div>

          <div class="flex flex-col gap-2 w-full overflow-hidden">
            <div class="grid grid-cols-2 max-[1790px]:grid-cols-1 gap-5">
              <div v-for="(classItem, idx) in subjectClasses" :key="idx"
                class="flex border border-[#cecece] gap-3 py-2 pr-4 rounded-lg w-full overflow-hidden"
                style="box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;">
                <div class="flex items-center">
                  <div class="h-full w-[7px] bg-blue rounded-full mr-2 ml-2"></div>
                  <p class="font-medium text-[32px]">{{ classItem.count }}</p>
                </div>
                <div class="overflow-hidden">
                  <p class="text-lg truncate">{{ classItem.name }}</p>
                  <p class="text-base text-[#7b7b7b] leading-none truncate">{{ classItem.subject }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="p-5 border border-[#cecece] rounded-2xl w-full overflow-hidden"
      style="box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;">
      <div>
        <p class="font-semibold text-[32px]">Summary of Grades</p>
      </div>

      <div class="flex justify-center gap-10 items-center my-5 flex-wrap">
        <div class="flex gap-2">
          <div class="rounded-full w-5 h-5 bg-blue"></div>
          <p class="text-blue text-base">90-100 Grade</p>
        </div>

        <div class="flex gap-2">
          <div class="rounded-full w-5 h-5 bg-[#0C5A48]"></div>
          <p class="text-[#0C5A48] text-base">85-89 Grade</p>
        </div>

        <div class="flex gap-2">
          <div class="rounded-full w-5 h-5 bg-[#D0D000]"></div>
          <p class="text-[#D0D000] text-base">80-84 Grade</p>
        </div>

        <div class="flex gap-2">
          <div class="rounded-full w-5 h-5 bg-[#FF9204]"></div>
          <p class="text-[#FF9204] text-base">75-79 Grade</p>
        </div>

        <div class="flex gap-2">
          <div class="rounded-full w-5 h-5 bg-[#D30000]"></div>
          <p class="text-[#D30000] text-base">75 Below Grade</p>
        </div>
      </div>

      <div class="h-[400px] overflow-hidden">
        <BarChart chartId="gradeChart" :labels="gradeChartData.labels" :datasets="gradeChartData.datasets"
          :options="gradeChartOptions" :height="400" />
      </div>
    </div>

    <div class="flex ssm:flex-col md:flex-row justify-between gap-10 w-full">
      <div class="ssm:w-full md:w-1/2 p-5 border border-[#cecece] rounded-2xl flex flex-col gap-5 overflow-hidden"
        style="box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;">
        <p class="font-semibold text-[32px]">Total Submitted Grades</p>

        <div class="flex items-center justify-center gap-5">
          <div class="flex gap-3">
            <div class="bg-blue w-5 h-5 rounded-full"></div>
            <p class="text-blue text-base">Advisory Class</p>
          </div>

          <div class="flex gap-3">
            <div class="bg-[#0C5A48] w-5 h-5 rounded-full"></div>
            <p class="text-[#0C5A48] text-base">Subject Class</p>
          </div>
        </div>

        <div class="h-[600px] overflow-hidden">
          <BarChart chartId="submittedGradesChart" :labels="submittedGradesData.labels"
            :datasets="submittedGradesData.datasets" :options="submittedGradesOptions" :height="600" />
        </div>
      </div>

      <div class=" ssm:w-full md:w-1/2 p-5 border border-[#cecece] rounded-2xl overflow-hidden"
        style="box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;">
        <p class="font-semibold text-[32px]">Recent Submitted Grades</p>

        <div class="overflow-x-auto mt-5 w-full">
          <table v-if="recentSubmittedGrades.length > 0" class="w-full">
            <thead>
              <tr class="bg-gray-100">
                <th class="p-3 text-center text-base">LRN</th>
                <th class="p-3 text-center text-base">Name</th>
                <th class="p-3 text-center text-base">Class Type</th>
                <th class="p-3 text-center text-base">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(grade, index) in recentSubmittedGrades" :key="index"
                class="border-b border-[#cecece] hover:bg-gray-50">
                <td class="p-3 text-center text-base">{{ grade.lrn }}</td>
                <td class="p-3 text-center text-base">{{ grade.name }}</td>
                <td class="p-3 text-center text-base">{{ grade.classType }}</td>
                <td class="p-3 text-center text-base">{{ grade.status }}</td>
              </tr>
            </tbody>
          </table>
          <div v-else class="flex flex-col items-center justify-center py-10 text-gray-500">
            <img src="/assets/img/dashboard/no-data.png" alt="No Data" class="w-32 h-32 mb-4 opacity-50" />
            <p class="text-lg font-medium">No Submitted Grades Yet</p>
            <p class="text-ssm">You haven't submitted any grades for review.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="p-5 border border-[#cecece] rounded-2xl w-full overflow-hidden"
      style="box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;">
      <p class="font-semibold text-[32px]">Recent Graded</p>

      <div class="overflow-x-auto mt-5 w-full">
        <table v-if="recentGraded.length > 0" class="w-full">
          <thead>
            <tr class="bg-gray-100">
              <th class="p-3 text-center text-base">LRN</th>
              <th class="p-3 text-center text-base">Name</th>
              <th class="p-3 text-center text-base">Curriculum</th>
              <th class="p-3 text-center text-base">Track/Strand</th>
              <th class="p-3 text-center text-base">Class Type</th>
              <th class="p-3 text-center text-base">Subject</th>
              <th class="p-3 text-center text-base">Grade</th>
              <th class="p-3 text-center text-base">Remarks</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(grade, index) in recentGraded" :key="index" class="border-b border-[#cecece] hover:bg-gray-50">
              <td class="p-3 text-center text-base">{{ grade.lrn }}</td>
              <td class="p-3 text-center text-base">{{ grade.name }}</td>
              <td class="p-3 text-center text-base">{{ grade.curriculum }}</td>
              <td class="p-3 text-center text-base">{{ grade.trackStand }}</td>
              <td class="p-3 text-center text-base">{{ grade.classType }}</td>
              <td class="p-3 text-center text-base">{{ grade.subjectName }}</td>
              <td class="p-3 text-center text-base">{{ grade.grade }}</td>
              <td class="p-3 text-center text-base">{{ grade.remarks }}</td>
            </tr>
          </tbody>
        </table>
        <div v-else class="flex flex-col items-center justify-center py-10 text-gray-500">
          <img src="/assets/img/dashboard/no-data.png" alt="No Data" class="w-32 h-32 mb-4 opacity-50" />
          <p class="text-lg font-medium">No Grades Recorded Yet</p>
          <p class="text-ssm">You haven't recorded any grades for your students.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch, onUnmounted } from 'vue';
import BarChart from '@/components/barchart.vue';
import classData from '@/data/class.json';
import subjectData from '@/data/subjects.json';
import studentData from '@/data/students.json';

const advisoryStats = computed(() => {
  const advisoryClass = classData.find(cls => cls.classType === 'Advisory');
  if (!advisoryClass) return { total: 0, male: 0, female: 0 };

  const advisorySubject = subjectData.find(sub => sub.subject_id === advisoryClass.subject_id);
  if (!advisorySubject) return { total: 0, male: 0, female: 0 };

  const advisoryStudents = studentData.filter(student =>
    advisorySubject.student_id.includes(student.student_id)
  );

  const maleCount = advisoryStudents.filter(student => student.sex === 'Male').length;
  const femaleCount = advisoryStudents.filter(student => student.sex === 'Female').length;

  return {
    total: advisoryStudents.length,
    male: maleCount,
    female: femaleCount
  };
});

const subjectClasses = computed(() => {
  const subjectClasses = classData.filter(cls => cls.classType === 'Subject');

  return subjectClasses.map(cls => {
    const subject = subjectData.find(sub => sub.subject_id === cls.subject_id);
    const studentCount = subject ? subject.student_id.length : 0;

    return {
      count: studentCount,
      name: cls.className,
      subject: subject ? subject.subjectName : 'Unknown Subject'
    };
  });
});

const gradeChartData = computed(() => {
  const classNames = [...new Set(classData.map(cls => cls.className))];

  const gradeRanges = {
    '90-100': Array(classNames.length).fill(0),
    '85-89': Array(classNames.length).fill(0),
    '80-84': Array(classNames.length).fill(0),
    '75-79': Array(classNames.length).fill(0),
    'Below 75': Array(classNames.length).fill(0)
  };

  const recentGrades = JSON.parse(localStorage.getItem('recentGrades') || '[]');

  recentGrades.forEach(grade => {
    const className = grade.className;
    const gradeValue = parseFloat(grade.grade);
    const classIndex = classNames.indexOf(className);

    if (classIndex !== -1) {
      if (gradeValue >= 90) {
        gradeRanges['90-100'][classIndex]++;
      } else if (gradeValue >= 85) {
        gradeRanges['85-89'][classIndex]++;
      } else if (gradeValue >= 80) {
        gradeRanges['80-84'][classIndex]++;
      } else if (gradeValue >= 75) {
        gradeRanges['75-79'][classIndex]++;
      } else {
        gradeRanges['Below 75'][classIndex]++;
      }
    }
  });

  return {
    labels: classNames,
    datasets: [
      {
        data: gradeRanges['90-100'],
        backgroundColor: '#295F98',
        borderRadius: 50
      },
      {
        data: gradeRanges['85-89'],
        backgroundColor: '#0C5A48',
        borderRadius: 50
      },
      {
        data: gradeRanges['80-84'],
        backgroundColor: '#FFFF00',
        borderRadius: 50
      },
      {
        data: gradeRanges['75-79'],
        backgroundColor: '#FF9204',
        borderRadius: 50
      },
      {
        data: gradeRanges['Below 75'],
        backgroundColor: '#D30000',
        borderRadius: 50
      }
    ]
  };
});

const gradeChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      }
    },
    y: {
      beginAtZero: true,
      grid: {
        color: '#000000',
        drawBorder: false
      }
    }
  },
  barThickness: 40,
  maxBarThickness: 35
};

const submittedGradesData = computed(() => {
  const recentSubmit = JSON.parse(localStorage.getItem('recentSubmit') || '[]');

  const counts = {
    advisory: { APPROVED: 0, PENDING: 0, DECLINED: 0 },
    subject: { APPROVED: 0, PENDING: 0, DECLINED: 0 }
  };

  recentSubmit.forEach(submission => {
    if (!submission || !submission.classType || !submission.status) return;

    const classType = submission.classType.toLowerCase();
    const status = submission.status.toUpperCase();

    if (counts[classType] && counts[classType][status] !== undefined) {
      counts[classType][status]++;
    }
  });

  return {
    labels: ['APPROVED', 'PENDING', 'DECLINED'],
    datasets: [
      {
        data: [
          counts.advisory.APPROVED,
          counts.advisory.PENDING,
          counts.advisory.DECLINED
        ],
        backgroundColor: '#295F98',
      },
      {
        data: [
          counts.subject.APPROVED,
          counts.subject.PENDING,
          counts.subject.DECLINED
        ],
        backgroundColor: '#0C5A48',
      }
    ]
  };
});

const submittedGradesOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      }
    },
    y: {
      beginAtZero: true,
      grid: {
        color: '#000000',
        drawBorder: false
      }
    }
  },
  barPercentage: 3,
  categoryPercentage: 0.2,
};

const recentSubmittedGrades = ref([]);

const recentGraded = ref([]);

onMounted(() => {
  // Store the initial data in localStorage if not already present
  if (!localStorage.getItem('subjects')) {
    localStorage.setItem('subjects', JSON.stringify(subjectData));
  }

  if (!localStorage.getItem('students')) {
    localStorage.setItem('students', JSON.stringify(studentData));
  }

  // Load data from localStorage
  loadDashboardData();

  // Set up event listener for storage changes
  window.addEventListener('storage', handleStorageChange);
});

// Add a function to load dashboard data
function loadDashboardData() {
  // Load submitted grades
  const submittedGrades = JSON.parse(localStorage.getItem('recentSubmit') || '[]');
  recentSubmittedGrades.value = submittedGrades.slice(0, 12).map(grade => ({
    lrn: grade.lrn,
    name: `${grade.lastName}, ${grade.firstName} ${grade.middleName}`,
    classType: grade.classType,
    status: grade.status
  }));

  // Load graded entries
  const graded = JSON.parse(localStorage.getItem('recentGrades') || '[]');
  recentGraded.value = graded.slice(0, 10).map(grade => ({
    lrn: grade.lrn,
    name: `${grade.lastName}, ${grade.firstName} ${grade.middleName}`,
    curriculum: grade.curriculum === 'SHS' ? 'Senior High School' :
      grade.curriculum === 'JHS' ? 'Junior High School' :
        grade.curriculum,
    trackStand: grade.trackStand,
    classType: grade.classType,
    subjectName: grade.subjectName,
    grade: grade.grade,
    remarks: grade.remarks
  }));
}

// Handle storage events to update data when it changes
function handleStorageChange(e) {
  if (e.key === 'recentSubmit' || e.key === 'recentGrades') {
    loadDashboardData();
  }
}

onUnmounted(() => {
  window.removeEventListener('storage', handleStorageChange);
});
</script>
