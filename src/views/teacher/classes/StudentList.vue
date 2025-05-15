<!-- StudentList.vue -->
<template>
  <div>
    <div class="back-button-container mb-6">
      <button
        @click="$emit('back')"
        class="flex items-center text-blue font-medium"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back
      </button>
    </div>

    <div class="student-list-container mb-6">
      <div class="flex justify-between items-center">
        <div class="flex gap-4">
          <select
            v-model="genderFilter"
            class="border border-gray-300 rounded-md p-2"
          >
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="All">All</option>
          </select>
          <select
            v-model="sortOrder"
            class="border border-gray-300 rounded-md p-2"
          >
            <option value="Latest">Latest</option>
            <option value="Oldest">Oldest</option>
          </select>
        </div>

        <div class="relative flex-1 mx-4 w">
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Search..."
            class="border border-gray-300 rounded-md py-2 px-3 pl-10 w-62"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <div class="flex gap-2">
          <button class="bg-gray-200 p-2 rounded">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
          </button>
          <button class="bg-red-500 p-2 rounded">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
          <button class="bg-blue-500 p-2 rounded">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </button>
          <button class="bg-green-500 p-2 rounded">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="student-list-container">
    <div class="border border-gray-300 rounded-lg overflow-hidden">
      <table class="w-full text-left">
        <thead>
          <tr class="bg-gray-100">
            <th class="py-3 px-4 font-medium">LRN</th>
            <th class="py-3 px-4 font-medium">FULL NAME</th>
            <th class="py-3 px-4 font-medium">GENDER</th>
            <th class="py-3 px-4 font-medium">Birthdate</th>
            <th class="py-3 px-4 font-medium">Age</th>
            <th class="py-3 px-4 font-medium">Address</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="student in filteredStudents"
            :key="student.lrn"
            class="border-t hover:bg-gray-50"
          >
            <td class="py-3 px-4">{{ student.lrn }}</td>
            <td class="py-3 px-4">{{ student.fullName }}</td>
            <td class="py-3 px-4">{{ student.gender }}</td>
            <td class="py-3 px-4">{{ student.birthdate }}</td>
            <td class="py-3 px-4">{{ student.age }}</td>
            <td class="py-3 px-4">{{ student.address }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'StudentList',
    props: {
      selectedCard: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        genderFilter: 'Female',
        sortOrder: 'Latest',
        searchTerm: '',
        students: Array(10)
          .fill()
          .map(() => ({
            lrn: '10693001001',
            fullName: 'Bueno, Ryan Joshua E.',
            gender: 'F',
            birthdate: '03/21/2001',
            age: '21',
            address: 'Brgy. Sta. Rita, Olongapo City',
          })),
      };
    },
    computed: {
      filteredStudents() {
        let result = [...this.students];

        // Apply gender filter if not 'All'
        if (this.genderFilter !== 'All') {
          const genderCode = this.genderFilter === 'Female' ? 'F' : 'M';
          result = result.filter((student) => student.gender === genderCode);
        }

        // Apply search filter if searchTerm exists
        if (this.searchTerm.trim()) {
          const term = this.searchTerm.toLowerCase();
          result = result.filter(
            (student) =>
              student.fullName.toLowerCase().includes(term) ||
              student.lrn.includes(term) ||
              student.address.toLowerCase().includes(term)
          );
        }

        // Apply sorting
        if (this.sortOrder === 'Latest') {
          // For demo, no actual sorting since all dates are the same
          // In real app, would sort by date
        } else {
          result.reverse();
        }

        return result;
      },
    },
  };
</script>

<style scoped>
  .student-list-container {
    background-color: white;
    padding: 24px;
    border-radius: 8px;
    box-shadow:
      0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
</style>