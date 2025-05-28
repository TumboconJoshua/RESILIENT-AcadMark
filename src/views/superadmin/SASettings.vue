<template>
  <div class="w-full">
    <h1 class="text-5xl font-bold mb-6">Settings</h1>

    <div class="mx-auto bg-white p-8 rounded-2xl w-full w-full mb-6">

       <div class="flex justify-between p-8 rounded-xl mb-6" style="box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;">
            <div v-for="tab in tabs" :key="tab" class="w-[48%] cursor-pointer"
                :class="activeTab === tab ? 'border-blue border-b-2' : ''" @click="activeTab = tab">
                <p class="text-center pb-2 font-semibold text-lg" :class="activeTab === tab.value ? 'text-blue' : ''">
                    {{ tab }}
                </p>
            </div>
        </div>
      



      <div class="text-xl text-center">
        <div v-if="activeTab === 'Subjects'">
            <div class="mx-auto bg-white shadow-lg p-8 rounded-2xl w-full w-full mb-6 border border-gray-200">
                <form>
                    <div class="grid grid-cols-2 gap-4 mb-4">
   <div class="floating-label mb-4">
    <input
      type="text"
      class="input"
      placeholder=" "
      v-model="newSubjectCode"
    />
    <label>Subject Code</label>
  </div>

  <div class="floating-label mb-4">
    <input
      type="text"
      class="input"
      placeholder=" "
      v-model="newSubjectName"
    />
    <label>Subject Name</label>
  </div>
</div>

<div class="grid grid-cols-2 gap-4 mb-4">
  <div class="floating-label mb-4">
    <input
      type="text"
      class="input"
      placeholder=" "
      v-model="newSubjectGradeLevel"
    />
    <label>Grade Level</label>
  </div>
</div>

          <div class="button">
  <button 
    type="button"
    @click="confirmAddSubject"
    class="green">
    Add Subject
  </button>
        </div>
                </form>
            </div>

            <div class="mx-auto bg-white shadow-lg p-8 rounded-2xl w-full border border-gray-200 h-[940px] flex flex-col">
                <div class="mb-4 flex items-center justify-between gap-4">
                    <div class="relative">
                        <input
                            v-model="searchQuery"
                            type="text"
                            placeholder="Search..."
                            class="border border-[#295f98] rounded px-10 py-2 text-lg"
                            />
                        <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    </div>

                    <div class="flex gap-4">
                        <select v-model="selectedId" class="filter-dropdown">
                        <option value="">All</option>
                        <option v-for="subject in uniqueIds" :key="subject" :value="subject">{{ subject }}</option>
                        </select>

                        <select v-model="selectedCode" class="filter-dropdown">
                        <option value="">All</option>
                        <option v-for="subject in uniqueCodes" :key="subject" :value="subject">{{ subject }}</option>
                        </select>

                        <select v-model="selectedGrade" class="filter-dropdown">
                        <option value="">All</option>
                        <option v-for="grade in uniqueGrades" :key="grade" :value="grade">{{ grade }}</option>
                        </select>
                    </div>
                </div>


                <!-- Scrollable Table Section -->
                <div class="overflow-y-auto flex-grow">
                    <table class="min-w-full divide-y divide-gray-200 text-left">
                        <thead class="bg-gray-100 text-gray-700 text-sm uppercase">
                            <tr>
                                <th class="px-6 py-3">Subject ID</th>
                                <th class="px-6 py-3">Subject Code</th>
                                <th class="px-6 py-3">Subject Name</th>
                                <th class="px-6 py-3">Grade Level</th>
                                <th class="px-6 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            <tr v-for="subject in paginatedSubjects" :key="subject.id">
                                <td class="px-6 py-4 whitespace-nowrap text-lg">{{ subject.id }}</td>
                                <td class="px-6 py-4 text-lg">{{ subject.code }}</td>
                                <td class="px-6 py-4 text-lg">{{ subject.name }}</td>
                                <td class="px-6 py-4 text-lg">{{ subject.grade }}</td>
                                <td class="px-6 py-4 flex space-x-2 text-lg">
                                    <button
                                        class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 cursor-pointer"
                                        @click="confirmDeleteSubject(subject.id)">
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination at the bottom -->
                <div class="flex justify-center items-center mt-4 space-x-1 pt-4 border-t border-gray-300">
                    <button
                        class="px-3 text-lg border border-[#295F98] text-[#295F98] py-1 rounded w-28 disabled:opacity-50 whitespace-nowrap flex items-center justify-center gap-1 cursor-pointer"
                        :disabled="currentPage === 1"
                        @click="currentPage--">
                        <span>←</span> Previous
                    </button>

                    <button
                        v-for="page in pageNumbers"
                        :key="page"
                        class="py-1 text-lg border border-[#295F98] rounded w-10 text-center"
                        :class="{
                            'bg-[#295F98] text-white': page === currentPage,
                            'text-gray-600': page !== currentPage,
                            'cursor-default': page === '...',
                            'cursor-pointer': page !== '...',
                        }"
                        @click="page !== '...' && (currentPage = page)"
                        :disabled="page === '...'">
                        {{ page }}
                    </button>

                    <button
                        class="px-3 text-lg border border-[#295F98] text-[#295F98] py-1 rounded w-28 disabled:opacity-50 whitespace-nowrap flex items-center justify-center gap-1 cursor-pointer"
                        :disabled="currentPage === totalPages"
                        @click="currentPage++">
                        Next <span>→</span>
                    </button>
                </div>
            </div>
        </div>

        <div v-else-if="activeTab === 'Section'">
          <div class="mx-auto bg-white shadow-lg p-8 rounded-2xl w-full w-full mb-6 border border-gray-200">
                <form>
  <div class="grid grid-cols-4 gap-4 mb-8">
    <!-- High School (Curriculum) -->
    <div class="floating-label">
      <select class="input" v-model="selectedHighSchool" required>
        <option value=""></option>
        <option v-for="school in highSchool" :key="school" :value="school">
          {{ school }}
        </option>
      </select>
      <label>High School (Curriculum)</label>
    </div>

    <!-- Grade Level -->
    <div class="floating-label">
      <select class="input" v-model="selectedGrade" required :disabled="!selectedHighSchool">
        <option value=""></option>
        <option v-for="grade in filteredGrades" :key="grade" :value="grade">
          {{ grade }}
        </option>
      </select>
      <label>Grade Level</label>
    </div>

    <!-- Curriculum/Track -->
   <div class="floating-label">
  <select class="input" v-model="selectedCurriculumTrack" required :disabled="!selectedHighSchool">
    <option value=""></option>
    <option v-for="item in filteredCurriculumTrack" :key="item" :value="item">
      {{ item }}
    </option>
  </select>
  <label>{{ curriculumOrTrackLabel }}</label>
</div>

    <!-- School Year (SY_ID) -->
    <div class="floating-label">
      <select class="input" v-model="selectedSYId" required>
        <option value=""></option>
        <option v-for="schoolyear in schoolYears" :key="schoolyear.id" :value="schoolyear.id">
  {{ schoolyear.SY_Year }}
</option>
      </select>
      <label>School Year</label>
    </div>
  </div>

  <div class="grid grid-cols-2 gap-4 mb-4">
    <!-- Classname -->
    <div class="floating-label mb-4">
      <input
        type="text"
        class="input"
        placeholder=" "
        v-model="newClassName"
        required
      />
      <label>Classname</label>
    </div>

    <!-- Section -->
    <div class="floating-label mb-4">
      <input
        type="text"
        class="input"
        placeholder=" "
        v-model="newSection"
        required
      />
      <label>Section</label>
    </div>
  </div>

  <div class="button">
    <button
      type="button"
      @click="confirmAddClassSection"
      class="green"
      :disabled="!formIsValid"
    >
      Add Section
    </button>
  </div>
</form>

          </div>

            <div class="mx-auto bg-white shadow-lg p-8 rounded-2xl w-full border border-gray-200 h-[940px] flex flex-col">
                <div class="mb-4 flex items-center justify-between gap-4">
                    <div class="relative">
                        <input
                            v-model="searchRecordsQuery"
                            type="text"
                            placeholder="Search..."
                            class="border border-[#295f98] rounded px-10 py-2 text-lg"
                            />
                        <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    </div>

                    <div class="flex gap-4">
                      <select v-model="selectedRecordsHighSchool" class="filter-dropdown">
                        <option value="">All</option>
                        <option v-for="school in uniqueRecordsHighSchools" :key="school" :value="school">{{ school }}</option>
                      </select>

                      <select v-model="selectedRecordsGradeLevel" class="filter-dropdown">
                        <option value="">All</option>
                        <option v-for="level in uniqueRecordsGradeLevels" :key="level" :value="level">{{ level }}</option>
                      </select>

                      <select v-model="selectedRecordsTrack" class="filter-dropdown">
                        <option value="">All</option>
                        <option v-for="track in uniqueRecordsTracks" :key="track" :value="track">{{ track }}</option>
                      </select>
                    </div>
                </div>


                <!-- Scrollable Table Section -->
                <div class="overflow-y-auto flex-grow">
                  <table class="min-w-full divide-y divide-gray-200 text-left">
                    <thead class="bg-gray-100 text-gray-700 text-sm uppercase">
                      <tr>
                        <th class="px-6 py-3">High School Education</th>
                        <th class="px-6 py-3">Grade Level</th>
                        <th class="px-6 py-3">Curriculum/ Track</th>
                        <th class="px-6 py-3">Section</th>
                        <th class="px-6 py-3">Action</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                      <tr v-for="(sections, index) in paginatedSections" :key="index">
                        <td class="px-6 py-4 text-lg">{{ sections.highSchool }}</td>
                        <td class="px-6 py-4 text-lg">{{ sections.gradeLevel }}</td>
                        <td class="px-6 py-4 text-lg">{{ sections.curriculumTrack }}</td>
                        <td class="px-6 py-4 text-lg">{{ sections.section }}</td>
                        <td class="px-6 py-4 flex space-x-2 text-lg">
                       <button
  class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 cursor-pointer"
  @click="handleDeleteClass(sections.id)"
>
  <i class="fas fa-trash-alt"></i>
</button>

                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div class="flex justify-center items-center mt-4 space-x-1 pt-4 border-t border-gray-300">
                  <button
                    class="px-3 text-lg border border-[#295F98] text-[#295F98] py-1 rounded w-28 disabled:opacity-50 whitespace-nowrap flex items-center justify-center gap-1 cursor-pointer"
                    :disabled="currentRecordsPage === 1"
                    @click="currentRecordsPage--"
                  >
                    <span>←</span> Previous
                  </button>

                  <button
                    v-for="page in sectionPageNumbers"
                    :key="page"
                    class="py-1 text-lg border border-[#295F98] rounded w-10 text-center"
                    :class="{
                      'bg-[#295F98] text-white': page === currentRecordsPage,
                      'text-gray-600': page !== currentRecordsPage,
                      'cursor-default': page === '...',
                      'cursor-pointer': page !== '...',
                    }"
                    @click="page !== '...' && (currentRecordsPage = page)"
                    :disabled="page === '...'"
                  >
                    {{ page }}
                  </button>

                  <button
                    class="px-3 text-lg border border-[#295F98] text-[#295F98] py-1 rounded w-28 disabled:opacity-50 whitespace-nowrap flex items-center justify-center gap-1 cursor-pointer"
                    :disabled="currentRecordsPage === totalSectionPages"
                    @click="currentRecordsPage++"
                  >
                    Next <span>→</span>
                  </button>
                </div>
              </div>
        </div>

        <div v-else-if="activeTab === 'School Year'">
          <div class="mx-auto bg-white shadow-lg p-8 rounded-2xl w-full w-full mb-6 border border-gray-200">
                <form>
                    <div class="grid grid-cols-4 gap-4 mb-4">
                        <div class="floating-label mb-4">
                            <input
                                type="text"
                                class="input"
                                v-model="newSYYear"
                                placeholder=" "
                            />
                            <label>School Year</label>
                        </div>
                        <div class="floating-label mb-4">
<input type="date"  class="input"  v-model="newStartDate" placeholder=" " required />
<label>Start Date *</label>
</div>
                        <div class="floating-label mb-4">
                        <input type="date" class="input" v-model="newEndDate" placeholder=" " />
<label>End Date</label>
                        </div>
                        
                    </div>

                   <div class="button">
                        <button 
                          type="button"
                          @click="confirmAddSchoolYear"
                          class="green">
                            Add S.Y
                        </button>
                    </div>
                </form>
            </div>
            <div class="mx-auto bg-white shadow-lg p-8 rounded-2xl w-full border border-gray-200 h-[940px] flex flex-col">
                <div class="mb-4 flex justify-end">
                  <div class="relative">
                    <input
                      v-model="searchSchoolYearQuery"
                      type="text"
                      placeholder="Search..."
                      class="border border-[#295f98] rounded px-10 py-2 text-lg"
                    />
                    <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  </div>
                </div>


                <!-- Scrollable Table Section -->
                <div class="overflow-y-auto flex-grow">
                  <table class="min-w-full divide-y divide-gray-200 text-left">
                    <thead class="bg-gray-100 text-gray-700 text-sm uppercase">
                      <tr>
                        <th class="px-6 py-3">School Year</th>
                        <th class="px-6 py-3">Start Date</th>
                        <th class="px-6 py-3">End Date</th>
                        <th class="px-6 py-3">S.Y Name</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                      <tr v-for="(schoolYears, index) in paginatedSchoolYears" :key="index">
                        <td class="px-6 py-4 whitespace-nowrap text-lg">{{ schoolYears.SY_Year }}</td>
                        <td class="px-6 py-4 text-lg">{{ schoolYears.startDate }}</td>
                        <td class="px-6 py-4 text-lg">{{ schoolYears.endDate }}</td>
                        <td class="px-6 py-4 text-lg">{{ schoolYears.syName }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>


            <div class="flex justify-center items-center mt-4 space-x-1 pt-4 border-t border-gray-300">
              <button
                class="px-3 text-lg border border-[#295F98] text-[#295F98] py-1 rounded w-28 disabled:opacity-50 whitespace-nowrap flex items-center justify-center gap-1 cursor-pointer"
                :disabled="currentSchoolYearPage === 1"
                @click="currentSchoolYearPage--"
              >
                <span>←</span> Previous
              </button>

              <button
                v-for="page in totalSchoolYearPages"
                :key="page"
                class="py-1 text-lg border border-[#295F98] rounded w-10 text-center"
                :class="{
                  'bg-[#295F98] text-white': page === currentSchoolYearPage,
                  'text-gray-600': page !== currentSchoolYearPage,
                }"
                @click="currentSchoolYearPage = page"
              >
                {{ page }}
              </button>

              <button
                class="px-3 text-lg border border-[#295F98] text-[#295F98] py-1 rounded w-28 disabled:opacity-50 whitespace-nowrap flex items-center justify-center gap-1 cursor-pointer"
                :disabled="currentSchoolYearPage === totalSchoolYearPages"
                @click="currentSchoolYearPage++"
              >
                Next <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import Swal from 'sweetalert2'
import { deleteClassById, getAllSubjects, getAllSchoolYears, getAllSections, createSubject, deleteSubjectById, createSchoolYear, createSection  } from '../../service/superadminService' 



const tabs = ['Subjects', 'Section', 'School Year']
const activeTab = ref('Subjects')

const highSchool = ["Junior High School", "Senior High School"]
const juniorGrades = ["Grade 7", "Grade 8", "Grade 9", "Grade 10"]
const seniorGrades = ["Grade 11", "Grade 12"]
const juniorCurriculum = ["SPA", "SPJ", "BEC", "SHS"]
const seniorTrack = ["TVL", "HUMMS", "TVL-IEM"]

const searchQuery = ref('')
const selectedId = ref('')
const selectedCode = ref('')
const selectedGrade = ref('')
const selectedHighSchool = ref('')
const selectedCurriculumTrack = ref('')
const selectedSYId = ref('');

const searchRecordsQuery = ref('')
const selectedRecordsHighSchool = ref('')
const selectedRecordsGradeLevel = ref('')
const selectedRecordsTrack = ref('')

const pageSize = 10

// ADDING Subject
const newSubjectName = ref('');
const newSubjectCode = ref('');
const newSubjectGradeLevel = ref('');
const newClassName = ref('');

// Adding S.Y
const newStartDate = ref('');
const newEndDate = ref('');
const newSYYear = ref('');



const paginatedSections = computed(() => {
  const start = (currentRecordsPage.value - 1) * pageSize
  return sections.value.slice(start, start + pageSize)
})

const totalSectionPages = computed(() => Math.ceil(sections.value.length / pageSize))

const sectionPageNumbers = computed(() => {
  // Simple example to generate page numbers
  const pages = []
  for (let i = 1; i <= totalSectionPages.value; i++) {
    pages.push(i)
  }
  return pages
})

const filteredGrades = computed(() => {
  if (selectedHighSchool.value === "Junior High School") {
    return juniorGrades
  } else if (selectedHighSchool.value === "Senior High School") {
    return seniorGrades
  } else {
    return []
  }
})

const filteredCurriculumTrack = computed(() => {
  if (selectedHighSchool.value === "Junior High School") {
    return juniorCurriculum
  } else if (selectedHighSchool.value === "Senior High School") {
    return seniorTrack
  } else {
    return []
  }
})

const curriculumOrTrackLabel = computed(() => {
  if (selectedHighSchool.value === "Junior High School") {
    return 'Curriculum'
  } else if (selectedHighSchool.value === "Senior High School") {
    return 'Track'
  } else {
    return 'Curriculum/Track'
  }
})

const newSection = ref('')

const addSection = () => {
  const trimmed = newSection.value.trim()
  if (!trimmed) return
  sections.value.push({ value: trimmed })
  newSection.value = ''
}

const removeSection = (index) => {
  sections.value.splice(index, 1)
}

const academicRecords = ref([
])

// Replace static subjects with API data
const subjects = ref([])

// Load and map API subjects to your expected format
const sections = ref([])  // will hold your sections/classes data from API
const schoolYears = ref([]) // will hold school years data from API



const loadSubjects = async () => {
  try {
    const response = await getAllSubjects()
    console.log('API data:', response)
    subjects.value = response.map(subj => ({
      id: subj.Subject_ID.toString(),
      code: subj.SubjectCode.toString(),
      name: subj.SubjectName,
      grade: `${subj.GradeLevel}`,
    }))
  } catch (error) {
    console.error('Failed to load subjects:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Could not load subjects. Please try again later.'
    })
  }
}

// Load sections from API
const loadSections = async () => {
  try {
    const data = await getAllSections()
    console.log('Sections data:', data)

    sections.value = data.map(item => ({
    id: item.Class_ID,
      highSchool: item.Curriculum === 'JHS'
        ? 'Junior High School'
        : item.Curriculum === 'SHS'
          ? 'Senior High School'
          : item.Curriculum, // fallback for unexpected values
      gradeLevel: item.Grade_Level,
      curriculumTrack: item.Track,
      section: item.Section
    }))
  } catch (error) {
    console.error('Failed to load sections:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Could not load sections. Please try again later.'
    })
  }
}



const loadSchoolYears = async () => {
  try {
    const data = await getAllSchoolYears();
    console.log('School years data:', data); // Log the full data
    schoolYears.value = data.map(item => ({
  id: item.SY_ID || item.id || item.SY_Id,
  SY_Year: `S.Y. ${item.SY_Year}`,
  startDate: item.Start_Date,
  endDate: item.End_Date,
  syName: `Academic Year ${item.SY_Year}`
}));
  } catch (error) {
    console.error('Failed to load school years:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Could not load school years. Please try again later.'
    });
  }
};

// Call on mounted lifecycle
onMounted(() => {
  loadSubjects()       // your existing function to load subjects
  loadSections()       // new: load sections
  loadSchoolYears()    // new: load school years
})

const uniqueIds = computed(() => [...new Set(subjects.value.map(subject => subject.id))])
const uniqueCodes = computed(() => [...new Set(subjects.value.map(subject => subject.code))])
const uniqueGrades = computed(() => [...new Set(subjects.value.map(subject => subject.grade))])

const filteredSubjects = computed(() => {
  const query = searchQuery.value.toLowerCase()

  return subjects.value.filter(subject => {
    const name = subject.name ? subject.name.toLowerCase() : ''
    const id = subject.id ? subject.id.toString().toLowerCase() : ''
    const code = subject.code ? subject.code.toLowerCase() : ''
    const grade = subject.grade ? subject.grade.toLowerCase() : ''

    const matchesSearch =
      name.includes(query) ||
      id.includes(query) ||
      code.includes(query) ||
      grade.includes(query)

    const matchesId = !selectedId.value || subject.id === selectedId.value
    const matchesCode = !selectedCode.value || subject.code === selectedCode.value
    const matchesGrade = !selectedGrade.value || subject.grade === selectedGrade.value

    return matchesSearch && matchesId && matchesCode && matchesGrade
  })
})

const currentPage = ref(1)
const itemsPerPage = 10

const totalPages = computed(() =>
  Math.ceil(filteredSubjects.value.length / itemsPerPage)
)

const paginatedSubjects = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredSubjects.value.slice(start, start + itemsPerPage)
})

const pageNumbers = computed(() => {
  const pages = []
  for (let i = 1; i <= totalPages.value; i++) {
    pages.push(i)
  }
  return pages
})

const uniqueRecordsHighSchools = computed(() =>
  [...new Set(academicRecords.value.map(record => record.highSchool))])

const uniqueRecordsGradeLevels = computed(() =>
  [...new Set(academicRecords.value.map(record => record.gradeLevel))])

const uniqueRecordsTracks = computed(() =>
  [...new Set(academicRecords.value.map(record => record.curriculumTrack))])

const currentRecordsPage = ref(1)
const recordsPerPage = 10

const filteredRecordsList = computed(() => {
  const query = searchRecordsQuery.value.toLowerCase()

  return academicRecords.value.filter(record => {
    const matchesSearch =
      record.schoolYear.toLowerCase().includes(query) ||
      record.highSchool.toLowerCase().includes(query) ||
      record.gradeLevel.toLowerCase().includes(query) ||
      record.curriculumTrack.toLowerCase().includes(query) ||
      record.section.toLowerCase().includes(query)

    const matchesHighSchool = !selectedRecordsHighSchool.value || record.highSchool === selectedRecordsHighSchool.value
    const matchesGrade = !selectedRecordsGradeLevel.value || record.gradeLevel === selectedRecordsGradeLevel.value
    const matchesTrack = !selectedRecordsTrack.value || record.curriculumTrack === selectedRecordsTrack.value

    return matchesSearch && matchesHighSchool && matchesGrade && matchesTrack
  })
})
const formIsValid = computed(() => {
  return (
    newClassName.value &&
    newSection.value &&
    selectedHighSchool.value &&
    selectedGrade.value &&
    selectedCurriculumTrack.value &&
    selectedSYId.value
  );
});
const totalRecordsPages = computed(() =>
  Math.ceil(filteredRecordsList.value.length / recordsPerPage)
)

const paginatedRecords = computed(() => {
  const start = (currentRecordsPage.value - 1) * recordsPerPage
  return filteredRecordsList.value.slice(start, start + recordsPerPage)
})

const recordsPageNumbers = computed(() => {
  const pages = []
  for (let i = 1; i <= totalRecordsPages.value; i++) {
    pages.push(i)
  }
  return pages
})

const searchSchoolYearQuery = ref('');
const currentSchoolYearPage = ref(1);
const schoolYearItemsPerPage = 10;

const filteredSchoolYears = computed(() => {
  const query = searchSchoolYearQuery.value.toLowerCase();
  return schoolYears.value.filter((year) =>
    year.SY_Year.toLowerCase().includes(query) ||
    (year.syName && year.syName.toLowerCase().includes(query))
  );
});

const paginatedSchoolYears = computed(() => {
  const start = (currentSchoolYearPage.value - 1) * schoolYearItemsPerPage;
  return filteredSchoolYears.value.slice(start, start + schoolYearItemsPerPage);
});

const totalSchoolYearPages = computed(() =>
  Math.ceil(filteredSchoolYears.value.length / schoolYearItemsPerPage)
);

const confirmAddSubject = async () => {
  const result = await Swal.fire({
    title: 'Add Subject',
    text: 'Are you sure you want to add this subject?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Yes, Add',
    cancelButtonText: 'Cancel'
  });

  if (result.isConfirmed) {
    try {
      // Create the subject
      await createSubject({
        SubjectName: newSubjectName.value.trim(),
        GradeLevel: parseInt(newSubjectGradeLevel.value),
        SubjectCode: parseInt(newSubjectCode.value)
      });

      await Swal.fire({
        icon: 'success',
        title: 'Added',
        text: 'The subject has been added successfully.',
        timer: 1500,
        showConfirmButton: false
      });

      // Reload the list
      await loadSubjects();

      // Clear the input fields
      newSubjectName.value = '';
      newSubjectCode.value = '';
      newSubjectGradeLevel.value = '';

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error?.message || 'Failed to add subject. Please try again.'
      });
    }
  }
};

 const confirmAddSchoolYear = async () => {
  const result = await Swal.fire({
    title: 'Add School Year',
    text: 'Are you sure you want to add this school year?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Yes, Add',
    cancelButtonText: 'Cancel'
  });

  if (result.isConfirmed) {
    try {
      await createSchoolYear({
        Start_Date: newStartDate.value,
        End_Date: newEndDate.value,
        SY_Year: newSYYear.value
      });

      await Swal.fire({
        icon: 'success',
        title: 'Added',
        text: 'The school year has been added successfully.',
        timer: 1500,
        showConfirmButton: false
      });

      await loadSchoolYears(); // reload school year list

      // Clear inputs
      newStartDate.value = '';
      newEndDate.value = '';
      newSYYear.value = '';
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error?.message || 'Failed to add school year. Please try again.'
      });
    }
  }
};
const confirmAddClassSection = async () => {
  const result = await Swal.fire({
    title: 'Add Section',
    text: 'Are you sure you want to add this section?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Yes, Add',
    cancelButtonText: 'Cancel'
  });

  if (result.isConfirmed) {
    try {
      const payload = {
        ClassName: newClassName.value.trim(),
        Section: newSection.value.trim(),
        SY_ID: selectedSYId.value,
        Grade_Level: selectedGrade.value.replace('Grade ', ''),
        Curriculum: selectedHighSchool.value === 'Junior High School' ? 'JHS' : 'SHS',
        Track: selectedCurriculumTrack.value,  // ✅ always use this, not conditional
        Status: 'Incomplete'
      };

      console.log("Sending payload:", payload); // ✅ Add this back for debugging

      await createSection(payload);

      await Swal.fire({
        icon: 'success',
        title: 'Added',
        text: 'The section has been added successfully.',
        timer: 1500,
        showConfirmButton: false
      });

      await loadSections();

      // Clear form
      newClassName.value = '';
      newSection.value = '';
      selectedHighSchool.value = '';
      selectedGrade.value = '';
      selectedCurriculumTrack.value = '';
      selectedSYId.value = '';

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error?.message || 'Failed to add section. Please try again.'
      });
    }
  }
};



const confirmDeleteSubject = async (subjectId) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'Do you really want to delete this subject?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#D30000',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Yes, Delete',
    cancelButtonText: 'Cancel'
  });

  if (result.isConfirmed) {
    try {
      await deleteSubjectById(subjectId);
      await loadSubjects(); // Reload subjects from API after deletion
      await Swal.fire({
        icon: 'success',
        title: 'Deleted',
        text: 'The subject has been deleted.',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to delete subject.'
      });
    }
  }
};

  const handleDeleteClass = async (id) => {
  const result = await Swal.fire({
    title: 'Delete Class',
    text: 'Are you sure you want to delete this class?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#6c757d'
  });

  if (result.isConfirmed) {
    try {
      await deleteClassById(id);
      await Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'The class has been deleted.',
        timer: 1500,
        showConfirmButton: false
      });

      // Optionally reload the class list
      await loadSections();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to delete the class.'
      });
    }
  }
};

  watch([searchQuery, selectedId, selectedCode, selectedGrade, 
  searchRecordsQuery, selectedRecordsHighSchool, selectedRecordsGradeLevel, selectedRecordsTrack, searchSchoolYearQuery], () => {
    currentPage.value = 1
  })
</script>



<style scoped>
.floating-label {
  position: relative;
  display: flex;
  flex-direction: column;
  font-size: 15px;
}

.floating-label .input {
  padding: 1rem 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.375rem;
  background: white;
}

.floating-label label {
  position: absolute;
  left: 0.5rem;
  top: 0.75rem;
  background: white;
  color: #888;
  padding: 0 0.25rem;
  transition: all 0.2s ease;
  pointer-events: none;
}

.floating-label input {
  transform: translateY(1.5rem);
  font-size: 1rem;
}

.floating-label select {
  padding: 1rem 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.375rem;
  background: white;
  transform: translateY(1.5rem);
  font-size: 1rem;
}




.filters {
  display: flex;
  gap: 10px;
} 

.filter-dropdown {
  padding: 10px 15px;
  width: 150px;
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
    font-size: 16px;
}
.red {
    background-color: #D30000;
}
.red:hover {
  background-color: #D95353;
}
.green {
    background-color: #0C5A48;
}
.red:hover {
    background-color: #FF0000;
}
.green:hover {
    background-color: #0C5A48;
}
</style>
