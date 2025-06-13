<template>
  <div class="w-full">
    <div class="flex items-center space-x-6 mb-6">
      <h1 class="text-5xl font-bold text-[#295f98]">Students</h1>
    </div>

    <div class="content mt-4">
      <!-- Filter Section -->
      <div class="top-head">
        <div class="filtering-section">
          <!-- Status -->
          <select
            v-if="showStatus"
            v-model="selectedStatus"
            class="filter-dropdown"
            @change="$emit('update:selectedStatus', selectedStatus)"
          >
            <option value="">Status (All)</option>
            <option v-for="status in statuses" :key="status" :value="status">
              {{ status }}
            </option>
          </select>

          <!-- Grade -->
          <select
            v-if="showGrade"
            v-model="selectedGrade"
            class="filter-dropdown"
            @change="$emit('update:selectedGrade', selectedGrade)"
          >
            <option value="">Grade Level (All)</option>
            <option v-for="grade in grades" :key="grade" :value="grade">
              Grade {{ grade }}
            </option>
          </select>

          <!-- Curriculum -->
          <select
            v-if="showCurriculum"
            v-model="selectedCurriculum"
            class="filter-dropdown"
            @change="$emit('update:selectedCurriculum', selectedCurriculum)"
          >
            <option value="">Curriculum (All)</option>
            <option
              v-for="curriculum in curriculums"
              :key="curriculum"
              :value="curriculum"
            >
              {{ curriculum }}
            </option>
          </select>

          <!-- Gender -->
          <select
            v-if="showGender"
            v-model="selectedGender"
            class="filter-dropdown"
            @change="$emit('update:selectedGender', selectedGender)"
          >
            <option value="">Gender (All)</option>
            <option
              v-for="gender in genders"
              :key="gender.value"
              :value="gender.value"
            >
              {{ gender.label }}
            </option>
          </select>

          <!-- Track -->
          <select
            v-if="showTrack"
            v-model="selectedTrack"
            class="filter-dropdown"
            @change="$emit('update:selectedTrack', selectedTrack)"
          >
            <option value="">Track (All)</option>
            <option v-for="track in tracks" :key="track" :value="track">
              {{ track }}
            </option>
          </select>

          <!-- Sort by -->
          <select v-model="sortOrder" class="filter-dropdown" style="width: 100px;">
            <option value="latest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>



        </div>

        <!-- Search -->
        <div class="search-bar p-4">
          <div class="relative w-full max-w-md">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by name..."
              class="border border-[#295f98] rounded pl-10 pr-4 py-3 w-full"
            />
            <i
              class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            ></i>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="table-container mt-7">
        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  v-model="selectAll"
                  @change="toggleSelectAll"
                />
              </th>
              <th>Grade Level</th>
              <th>LRN</th>
              <th>Name</th>
              <th>Curriculum</th>
              <th>Track</th>
              <th>Gender</th>
              <th>Birthdate</th>
              <th>Age</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="student in paginatedStudents"
              :key="student.lrn"
              @click="openModal(student)"
              class="cursor-pointer hover:bg-gray-100"
            >
              <td>
                <input
                  type="checkbox"
                  v-model="selectedStudents"
                  :value="student.Student_ID"
                  @click.stop
                />
              </td>
              <td>{{ student.grade }}</td>
              <td>{{ student.lrn }}</td>
              <td>{{ student.name }}</td>
              <td>{{ student.curriculum }}</td>
              <td>{{ student.track }}</td>
              <td>{{ student.gender }}</td>
              <td>{{ student.birthdate }}</td>
              <td>{{ student.age }}</td>
              <td>
                <span :class="statusClass(student.status)">{{
                  student.status
                }}</span>
              </td>
            </tr>
          </tbody>
        </table>

        <StudentModal
          v-if="isModalOpen"
          :student="selectedStudent"
          :showModal="isModalOpen"
          @close="closeModal"
        />
        <RejectModal
          v-if="isRejectModalOpen"
          :studentIds="selectedStudents"
          @close="isRejectModalOpen = false"
          @submit="handleReject"
        />
        <RequestModal
          v-if="isRequestModalOpen"
          :isModalDropOpen="isRequestModalOpen"
          :dropOutFormData="selectedRequestStudent"
          @close="closeRequestModal"
          @submit="handleDropOutSubmit"
        />
      </div>

      <div
        class="flex justify-center items-center mt-4 space-x-1 pt-4 border-t border-gray-300"
      >
        <button
          class="px-3 border border-[#295F98] text-[#295F98] py-1 rounded w-28 disabled:opacity-50 whitespace-nowrap flex items-center justify-center gap-1 cursor-pointer"
          :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)"
        >
          <span>←</span> Previous
        </button>

        <button
          v-for="page in pageNumbers"
          :key="page"
          class="py-1 border border-[#295F98] rounded w-10 text-center"
          :class="{
            'bg-[#295F98] text-white': page === currentPage,
            'text-gray-600': page !== currentPage,
            'cursor-default': page === '...',
            'cursor-pointer': page !== '...',
          }"
          @click="page !== '...' && goToPage(page)"
          :disabled="page === '...'"
        >
          {{ page }}
        </button>

        <button
          class="px-3 border border-[#295F98] text-[#295F98] py-1 rounded w-28 disabled:opacity-50 whitespace-nowrap flex items-center justify-center gap-1 cursor-pointer"
          :disabled="currentPage === totalPages"
          @click="goToPage(currentPage + 1)"
        >
          Next <span>→</span>
        </button>
      </div>

      <!-- Accept/Reject Buttons -->
      <div class="button">
        <button class="red" @click="reject">Decline</button>
        <button class="green" @click="acceptAlert">Accept</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import StudentModal from './components/StudentModal.vue';
import RejectModal from './components/RejectModal.vue';
import RequestModal from './components/RequestModal.vue';
import Swal from 'sweetalert2';
import {
  getAllStudentsData,
  getStudentById,
  acceptStudent,
  declineStudent,
} from '@/service/superadminService';

// State
const students = ref([]);
const selectedStudent = ref(null);
const isModalOpen = ref(false);
const isRejectModalOpen = ref(false);
const selectedStudents = ref([]);
const selectAll = ref(false);
const isRequestModalOpen = ref(false);
const selectedRequestStudent = ref(null);

const currentPage = ref(1);
const pageSize = 10;

// Modal logic
const openModal = async (student) => {

  try {
    if (student.status === 'Drop-Out') {
      // Open RequestModal
      const fullStudent = await getStudentById(student.Student_ID);
      console.log("DATAWADAWDAWD:", fullStudent)
      selectedRequestStudent.value = fullStudent;
      isRequestModalOpen.value = true;
    } else {
      // Open StudentModal
      const fullStudent = await getStudentById(student.Student_ID);
      selectedStudent.value = fullStudent;
      isModalOpen.value = true;
    }
  } catch (error) {
    console.error('Error fetching student:', error);
  }
};

const closeRequestModal = () => {
  isRequestModalOpen.value = false;
  selectedRequestStudent.value = null;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedStudent.value = null;
};

// Refresh students
const refreshStudents = async () => {
  try {
    const response = await getAllStudentsData();
    students.value = response.data.map((student) => ({
      Student_ID: student.Student_ID,
      grade: student.Grade_Level,
      lrn: student.LRN,
      name: `${student.FirstName} ${student.MiddleName ? student.MiddleName[0] + '.' : ''} ${student.LastName}${student.Suffix ? ', ' + student.Suffix : ''}`,
      curriculum: student.Curriculum,
      track: student.Track,
      gender: student.Sex,
      birthdate: student.BirthDate,
      age: student.Age,
      status: student.Status,
      created_at: student.created_at,
    }));
  } catch (error) {
    console.error('Failed to load students:', error);
  }
};

onMounted(refreshStudents);

// Filtering
const statuses = ['Pending', 'Accepted', 'Declined'];
const grades = ['7', '8', '9', '10'];
const curriculums = ['JHS', 'SHS'];
const genders = [
  { label: 'Male', value: 'M' },
  { label: 'Female', value: 'F' },
];
const tracks = ['STEM', 'ABM', 'TVL', 'HUMSS'];
const selectedStatus = ref('');
const sortOrder = ref('latest');
const selectedGrade = ref('');
const selectedCurriculum = ref('');
const selectedGender = ref('');
const selectedTrack = ref('');
const searchQuery = ref('');

const showStatus = ref(true);
const showGrade = ref(true);
const showCurriculum = ref(true);
const showGender = ref(true);
const showTrack = ref(true);

const filteredStudents = computed(() => {
  let result = students.value.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesStatus = !selectedStatus.value || student.status === selectedStatus.value;
    const matchesGrade = !selectedGrade.value || parseInt(student.grade) === parseInt(selectedGrade.value);
    const matchesCurriculum = !selectedCurriculum.value || student.curriculum === selectedCurriculum.value;
    const matchesGender = !selectedGender.value || student.gender === selectedGender.value;
    const matchesTrack = !selectedTrack.value || student.track === selectedTrack.value;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesGrade &&
      matchesCurriculum &&
      matchesGender &&
      matchesTrack
    );
  });

  // ✅ Sort by created_at
result.sort((a, b) => {
  const dateA = new Date(a.created_at);
  const dateB = new Date(b.created_at);
  return sortOrder.value === 'oldest' ? dateA - dateB : dateB - dateA;
});


  return result;
});



// Pagination: Slice filteredStudents according to currentPage and pageSize
const paginatedStudents = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredStudents.value.slice(start, start + pageSize);
});

// Calculate total pages
const totalPages = computed(() => {
  return Math.ceil(filteredStudents.value.length / pageSize);
});

// Methods to change page
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

// Watch filters and search to reset page to 1
watch(
  [
    selectedStatus,
    selectedGrade,
    selectedCurriculum,
    selectedGender,
    selectedTrack,
    searchQuery,
    sortOrder,
  ],
  () => {
    currentPage.value = 1;
  }
);

// Checkbox logic
const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedStudents.value = students.value.map((s) => s.Student_ID);
  } else {
    selectedStudents.value = [];
  }
};

watch(selectedStudents, (val) => {
  selectAll.value = val.length === students.value.length;
});

// Status classes
const statusClass = (status) => {
  switch (status.toLowerCase()) {
    case 'accepted':
      return 'text-green-600 font-semibold';
    case 'pending':
      return 'text-yellow-600 font-semibold';
    case 'declined':
      return 'text-red-600 font-semibold';
    case 'drop-out':
      return 'text-gray-500 font-semibold';
    default:
      return '';
  }
};

// Reject logic
const reject = () => {
  if (selectedStudents.value.length === 0) {
    Swal.fire(
      'No Students Selected',
      'Please select students to reject.',
      'warning'
    );
    return;
  }
  isRejectModalOpen.value = true;
};

const handleReject = async ({ comment }) => {
  try {
    for (const id of selectedStudents.value) {
      await declineStudent(id, comment); // backend should expect { comment }
    }
    await refreshStudents();
    selectedStudents.value = [];
    Swal.fire(
      'Rejected!',
      'Selected students have been rejected.',
      'success'
    );
  } catch (err) {
    Swal.fire('Error', 'Failed to reject students.', 'error');
  } finally {
    isRejectModalOpen.value = false;
  }
};

// Accept logic
const acceptAlert = async () => {
  if (selectedStudents.value.length === 0) {
    Swal.fire(
      'No Students Selected',
      'Please select students to accept.',
      'warning'
    );
    return;
  }

  const confirm = await Swal.fire({
    title: 'Are you sure?',
    text: `Accept ${selectedStudents.value.length} student(s)?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#007bff',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Yes, Accept',
    cancelButtonText: 'Cancel',
  });

  if (confirm.isConfirmed) {
    try {
      for (const id of selectedStudents.value) {
        await acceptStudent(id);
      }
      await refreshStudents();
      selectedStudents.value = [];
      Swal.fire(
        'Accepted!',
        'Selected students have been accepted.',
        'success'
      );
    } catch (err) {
      Swal.fire('Error', 'Failed to accept students.', 'error');
    }
  }
};
</script>


<style scoped>
  .dropdown-container {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .filter-dropdown {
    padding: 10px 15px;
    width: 210px;
    border: 1px solid #295f98;
    border-radius: 5px;
    font-size: 14px;
    background: #fff;
    font-weight: bold;
    color: #295f98;
    cursor: pointer;
    appearance: none;
    background-repeat: no-repeat;
    background-position: right 10px center;
    padding-right: 30px;
    transition: all 0.3s ease-in-out;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='18' height='18' fill='%23295f98'><path d='M14 7l-5 5 5 5V7z'/></svg>");
  }

  .filter-dropdown:focus {
    outline: none;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='18' height='18' fill='%23295f98'><path d='M7 10l5 5 5-5H7z'/></svg>");
  }

  .filtering-section {
    display: flex;
    gap: 20px;
    flex-wrap: nowrap;
    align-items: center;
    margin-left: 15px;
  }

  .content {
    background-color: #ffffff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border: 2px solid #eeeeee;
    padding: 10px;
    border-radius: 5px;
  }

  .top-head {
    display: flex;
    width: 100%;
    justify-content: space-between;
  }

  .table-container {
    flex: 1; /* Fills the remaining space */
    margin-bottom: 16px;
    background: #fff;
    overflow-y: auto;
    overflow-x: hidden;
    max-height: 700px;
    margin-left: 15px;
    margin-top: 0;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th,
  td {
    padding: 15px;
    text-align: center;
    font-size: 14px;
  }

  th {
    padding-top: 20px;
    background: #f6f6f6;
    color: #000;
    position: sticky;
    top: 0;
    z-index: 1;
  }

  tr {
    cursor: pointer;
  }

  tr:hover {
    background-color: #f6f6f6;
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
  .red:hover {
    background-color: #ff0000;
  }
  .green:hover {
    background-color: #0c5a48;
  }
</style>
