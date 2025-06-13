<template>
  <div class="w-full">
    <h1 class="text-5xl font-bold mb-6 text-[#295f98]">Personnel Setup</h1>
    <div class="bg-white shadow-lg border border-gray-200 rounded-lg p-6 mb-6 flex flex-col" style="height: 880px;">
        <div class="flex flex-wrap justify-between items-center mb-4 gap-4">
          <div class="flex gap-4 flex-wrap items-center">
              <div class="filters">
                  <select v-model="selectedAccess" class="filter-dropdown">
                      <option value="">All Access</option>
                      <option value="Admin">Admin</option>
                      <option value="Teacher">Teacher</option>
                  </select>
              </div>

              <div class="relative">
                  <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search..."
                  class="border border-[#295f98] rounded px-10 py-2 "
                  />
                  <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              </div>
          </div>


          <button
            @click="showModal = true"
            class="bg-[#295f98] text-white px-4 py-2 rounded hover:bg-blue-900 whitespace-nowrap cursor-pointer"
          >
            Add Personnel
          </button>

          <!-- Import & Use the Modal -->
          <AddFacultyModal
            v-model="showModal"
            @submit="handleFacultySubmit"
          />
        </div>

        <EditFacultyModal 
          v-if="showEditModal"
          :modelValue="showEditModal"
          :facultyData="editData"
          :subjects="subjects"
          formMode="edit"
          @update:modelValue="showEditModal = false"
          @updated="f"
        />

        <div class="overflow-x-auto flex-1 overflow-y-auto" style="min-height: 0;">
          <table class="w-full table-auto border-collapse">
             <thead>
                <tr class="bg-gray-100">
                  <th class="px-6 py-3 text-left font-medium text-gray-700 border-b border-gray-300">Employee No.</th>
                  <th class="px-6 py-3 text-left font-medium text-gray-700 border-b border-gray-300">Name</th>
                  <th class="px-6 py-3 text-left font-medium text-gray-700 border-b border-gray-300">Qualification</th>
                  <th class="px-6 py-3 text-left font-medium text-gray-700 border-b border-gray-300">Access</th>
                  <th class="px-6 py-3 text-left font-medium text-gray-700 border-b border-gray-300">Email</th>
                  <th class="px-6 py-3 text-left font-medium text-gray-700 border-b border-gray-300">Action</th>
                </tr>
            </thead>
            <tbody>
              <tr v-for="(employee, index) in [...paginatedEmployees].reverse()" :key="index" class="hover:bg-gray-50">
                <td class="px-6 py-4 border-b border-gray-300">{{ employee.empNo }}</td>
                <td class="px-6 py-4 border-b border-gray-300">{{ employee.name }}</td>
                <td class="px-6 py-4 border-b border-gray-300">{{ employee.qualification }}</td>
                <td class="px-6 py-4 border-b border-gray-300">{{ employee.access }}</td>
                <td class="px-6 py-4 border-b border-gray-300">{{ employee.email }}</td>
                <td class="px-6 py-4 border-b border-gray-300 space-x-2">
                  <button @click="openEditModal(employee)" class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 cursor-pointer">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button @click="confirmDelete(employee)" class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 cursor-pointer">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex justify-center items-center mt-4 space-x-1 pt-4 border-t border-gray-300">
          <button
              class="px-3 border border-[#295F98] text-[#295F98] py-1 rounded w-28 disabled:opacity-50 whitespace-nowrap flex items-center justify-center gap-1 cursor-pointer"
              :disabled="currentPage === 1"
              @click="currentPage--"
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
              @click="page !== '...' && (currentPage = page)"
              :disabled="page === '...'"
          >
              {{ page }}
          </button>

          <button
              class="px-3 border border-[#295F98] text-[#295F98] py-1 rounded w-28 disabled:opacity-50 whitespace-nowrap flex items-center justify-center gap-1 cursor-pointer"
              :disabled="currentPage === totalPages"
              @click="currentPage++"
          >
              Next <span>→</span>
          </button>
        </div>

    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';
import AddFacultyModal from './components/AddFacultyModal.vue';
import EditFacultyModal from './components/EditFacultyModal.vue';
import personnelService from '@/service/personnelService';

export default {
  components: {
    AddFacultyModal,
    EditFacultyModal,
  },
  data() {
    return {
      showModal: false,
      showEditModal: false,
      editData: null,
      currentPage: 1,
      perPage: 10,
      selectedAccess: '',
      searchQuery: '',
      employees: [],
      subjects: [],
      selectedSubjectId: '',
    };
  },
  mounted() {
    this.fetchEmployees();
    this.fetchSubjects();
  },
  
  methods: {
    async fetchSubjects() {
      try {
        const data = await personnelService.getSubjects();
        this.subjects = Array.isArray(data) ? data : data.data || [];
      } catch (error) {
        console.error('Failed to fetch subjects:', error);
        Swal.fire('Error', 'Could not load subjects.', 'error');
      }
    },

    async fetchEmployees() {
      try {
        const response = await personnelService.getAllTeachers();
        const teacherList = Array.isArray(response.data) ? response.data : [];
        this.employees = teacherList.map(item => {
          const t = item.teacher;
          return {
            empNo: t.EmployeeNo,
            name: `${t.FirstName} ${t.LastName}`,
            qualification: t.Educational_Attainment || '',
            access: t.Position,
            email: t.Email,
            original: {
              ...t,
              subjects: item.subjects || [],
              advisory_classes: item.advisory_classes || [],
              id: t.Teacher_ID,
            },
          };
        });
      } catch (error) {
        console.error('Failed to fetch employees:', error);
        Swal.fire('Error', 'Could not load employee data.', 'error');
      }
    },

  
   handleFacultySubmit(data) {
      console.log('Faculty submitted:', data);
    },

    async openEditModal(employee) {
      if (!this.subjects.length) {
        await this.fetchSubjects();
      }
      this.editData = {
        ...employee.original,
        assigned_subjects: employee.original.subjects || []
      };
      this.showEditModal = true;
    },

    handleFacultyEdit(updatedData) {
      const index = this.employees.findIndex(emp => emp.empNo === updatedData.EmployeeNo);
      if (index !== -1) {
        this.employees[index] = {
          ...this.employees[index],
          name: `${updatedData.FirstName} ${updatedData.LastName}`,
          qualification: updatedData.Educational_Attainment || '',
          access: updatedData.Position,
          email: updatedData.Email,
          original: { ...updatedData, id: updatedData.Teacher_ID },
        };
      }
      this.showEditModal = false;
    },
   async confirmDelete(employee) {
      Swal.fire({
        title: 'Are you sure?',
        text: `Delete employee ${employee.name}? This action cannot be undone.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const teacherId = employee.original?.id || employee.original?.Teacher_ID;
            await personnelService.deleteTeacher(teacherId);
            this.employees = this.employees.filter(emp => emp.empNo !== employee.empNo);
            Swal.fire('Deleted!', 'Employee has been deleted.', 'success');
          } catch (error) {
            Swal.fire('Error', 'Failed to delete employee.', 'error');
          }
        }
      });
    },
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredEmployees.length / this.perPage);
    },
    paginatedEmployees() {
      const start = (this.currentPage - 1) * this.perPage;
      return this.filteredEmployees.slice(start, start + this.perPage);
    },
    filteredEmployees() {
      const query = this.searchQuery.toLowerCase();
      return this.employees.filter((employee) => {
        const matchesAccess =
          this.selectedAccess === '' || employee.access === this.selectedAccess;

        const matchesSearch =
          employee.empNo.toLowerCase().includes(query) ||
          employee.name.toLowerCase().includes(query) ||
          employee.qualification.toLowerCase().includes(query) ||
          employee.access.toLowerCase().includes(query) ||
          employee.email.toLowerCase().includes(query);

        return matchesAccess && matchesSearch;
      });
    },
    pageNumbers() {
      const pages = [];
      const total = this.totalPages;
      const current = this.currentPage;

      if (total <= 7) {
        for (let i = 1; i <= total; i++) pages.push(i);
      } else {
        pages.push(1);
        if (current > 3) pages.push('...');
        const start = Math.max(2, current - 1);
        const end = Math.min(total - 1, current + 1);
        for (let i = start; i <= end; i++) pages.push(i);
        if (current < total - 2) pages.push('...');
        pages.push(total);
      }
      return pages;
    },
  },
};
</script>

<style scoped>
.filters {
  display: flex;
  gap: 10px;
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
  position: relative;
  background-repeat: no-repeat;
  background-position: right 10px center;
  padding-right: 30px;
  transition: all 0.3s ease-in-out;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='18' height='18' fill='%23295f98'><path d='M7 10l5 5 5-5H7z'/></svg>");
}

.filter-dropdown:focus {
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='18' height='18' fill='%23295f98'><path d='M7 14l5-5 5 5H7z'/></svg>");
}
</style>
