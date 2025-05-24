<template>
    <!-- ===================== Main Container ===================== -->
    <div class="p-5">
        <p class="font-semibold text-6xl mb-7">Add Student</p>

        <!-- ===================== Tab Navigation ===================== -->
        <div class="flex justify-between p-8 rounded-t-xl" style="box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;">
            <div v-for="tab in tabs" :key="tab.value" class="w-[48%] cursor-pointer"
                :class="activeTab === tab.value ? 'border-blue border-b-2' : ''" @click="activeTab = tab.value">
                <p class="text-center pb-2 font-semibold text-lg" :class="activeTab === tab.value ? 'text-blue' : ''">
                    {{ tab.label }}
                </p>
            </div>
        </div>

        <div class="my-5">
            <!-- ===================== Add Student Tab ===================== -->
            <div class="flex flex-col gap-10" v-if="activeTab === 'add'">
                <!-- ========== Individual Registration Form ========== -->
                <div class="p-7 rounded-t-xl" style="box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;">
                    <p class="font-semibold text-xl text-blue mb-5">Individual Registration Form</p>

                    <form @submit.prevent="handleAddStudentSubmit" class="flex flex-col gap-5">
                        <!-- Render each row of fields -->
                        <div v-for="row in groupedFields" :key="row[0].name" class="flex flex-row gap-5">
                            <div v-for="addStudentField in row" :key="addStudentField.name"
                                :class="addStudentField.class || 'relative grow'">
                                <label class="absolute top-[-10px] left-[20px] text-sm bg-white px-2">
                                    {{ addStudentField.label }}
                                </label>

                                <!-- Render select or input based on field type -->
                                <select v-if="addStudentField.type === 'select'"
                                    v-model="formData[addStudentField.name]"
                                    class="w-full py-3 px-5 border rounded appearance-none"
                                    :required="addStudentField.required">
                                    <option disabled value="">{{ addStudentField.placeholder }}</option>
                                    <option v-for="option in addStudentField.options" :key="option" :value="option">
                                        {{ option }}
                                    </option>
                                </select>

                                <input v-else :type="addStudentField.type" v-model="formData[addStudentField.name]"
                                    class="w-full py-3 px-5 border rounded" :placeholder="addStudentField.placeholder"
                                    :maxlength="addStudentField.maxLength" :pattern="addStudentField.pattern"
                                    :title="addStudentField.title" :required="addStudentField.required" />

                                <!-- Dropdown icon for select fields -->
                                <div v-if="addStudentField.type === 'select'"
                                    class="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                                    <svg class="w-4 h-4 text-black" fill="none" stroke="currentColor" stroke-width="2"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <!-- Submit Button for Individual Form -->
                        <div class="flex justify-end mt-5">
                            <button type="submit"
                                class="bg-blue text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors cursor-pointer">
                                Add Student
                            </button>
                        </div>
                    </form>
                </div>

                <!-- ========== Bulk Registration Form ========== -->
                <div class="p-7 rounded-t-xl" style="box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;">
                    <p class="font-semibold text-xl text-blue mb-5">Bulk Registration Form</p>

                    <form @submit.prevent="handleBulkSubmit" class="flex flex-col gap-5">
                        <!-- Bulk Form: Grade, Curriculum, Track -->
                        <div class="flex flex-row gap-5 w-[70%]">
                            <div class="relative grow">
                                <label class="absolute top-[-10px] left-[20px] text-sm bg-white px-2">Grade
                                    Level</label>
                                <select v-model="bulkFormData.gradeLevel"
                                    class="w-full py-3 px-5 border rounded appearance-none" required>
                                    <option disabled value="">Select Grade Level</option>
                                    <option v-for="level in addStudentFields[0].options" :key="level" :value="level">
                                        {{ level }}
                                    </option>
                                </select>
                                <div class="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                                    <svg class="w-4 h-4 text-black" fill="none" stroke="currentColor" stroke-width="2"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                            <div class="relative grow">
                                <label class="absolute top-[-10px] left-[20px] text-sm bg-white px-2">Curriculum</label>
                                <select v-model="bulkFormData.curriculum"
                                    class="w-full py-3 px-5 border rounded appearance-none" required>
                                    <option disabled value="">Select Curriculum</option>
                                    <option v-for="level in addStudentFields[1].options" :key="level" :value="level">
                                        {{ level }}
                                    </option>
                                </select>
                                <div class="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                                    <svg class="w-4 h-4 text-black" fill="none" stroke="currentColor" stroke-width="2"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                            <div class="relative grow">
                                <label class="absolute top-[-10px] left-[20px] text-sm bg-white px-2">Track</label>
                                <select v-model="bulkFormData.track"
                                    class="w-full py-3 px-5 border rounded appearance-none" required>
                                    <option disabled value="">Select Track</option>
                                    <option v-for="level in addStudentFields[2].options" :key="level" :value="level">
                                        {{ level }}
                                    </option>
                                </select>
                                <div class="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                                    <svg class="w-4 h-4 text-black" fill="none" stroke="currentColor" stroke-width="2"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <!-- Bulk Form: CSV Upload -->
                        <div class="mt-5">
                            <div class="gap-4 justify-center w-full  border border-black rounded-lg">
                                <label class="flex items-center gap-2 cursor-pointer">
                                    <input type="file" accept=".csv" @change="handleFileUpload" class="hidden"
                                        ref="fileInput" />
                                    <div
                                        class="flex flex-col items-center justify-center gap-2 px-4 py-22 rounded transition-colors w-full">
                                        <img src="/assets/img/upload.svg" alt="upload" class="w-[30px] h-[30px]" />
                                        <p class="text-blue">Upload CSV File</p>
                                    </div>
                                </label>
                                <span v-if="selectedFile" class="text-sm text-gray-600">
                                    Selected: {{ selectedFile.name }}
                                </span>
                            </div>
                        </div>

                        <!-- Submit Button for Bulk Form -->
                        <div class="flex justify-end mt-5">
                            <button type="submit"
                                class="bg-blue text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors cursor-pointer">
                                Add Student(s)
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- ===================== Submitted Students Tab ===================== -->
            <div v-else-if="activeTab === 'submitted'">
                <div class="flex flex-col gap-10">
                    <!-- ========== Filters and Searchbar ========== -->
                    <div class="p-7 rounded-t-xl" style="box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;">
                        <div class="flex justify-between">
                            <div class="flex flex-wrap gap-5">
                                <Dropdown :showGrade="true" v-model="selectedGrade" />
                                <Dropdown :showCurriculum="true" v-model="selectedCurriculum" />
                                <Dropdown :showSex="true" v-model="selectedSex" />
                                <Dropdown :showAcademicTrack="true" v-model="selectedAcademicTrack" />
                            </div>
                            <div class="w-[30%]">
                                <Searchbar v-model="searchQuery" />
                            </div>
                        </div>
                    </div>

                    <!-- ========== Students Table ========== -->
                    <div class="p-7 rounded-t-xl" style="box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;">
                        <div class="overflow-auto">
                            <table class="w-full border-collapse text-center text-sm">
                                <thead class="bg-gray-100 text-[#464F60] text-[15px] font-semibold">
                                    <tr>
                                        <th class="p-2">Grade Level</th>
                                        <th class="p-2">LRN</th>
                                        <th class="p-2">Name</th>
                                        <th class="p-2">Curriculum</th>
                                        <th class="p-2">Track</th>
                                        <th class="p-2">Gender</th>
                                        <th class="p-2">Birthdate</th>
                                        <th class="p-2">Age</th>
                                        <th class="p-2">Status</th>
                                    </tr>
                                </thead>
                                <tbody class="font-medium text-[15px]">
                                    <tr v-if="filteredStudents.length === 0">
                                        <td colspan="9" class="p-2 text-center">No students available.</td>
                                    </tr>
                                    <tr v-for="student in filteredStudents" :key="student.lrn"
                                        class="hover:bg-gray-200 cursor-pointer" @click="openModal(student)">
                                        <td class="p-2">{{ student.gradeLevel }}</td>
                                        <td class="p-2">{{ student.lrn }}</td>
                                        <td class="p-2">{{ student.fullName }}</td>
                                        <td class="p-2">{{ student.curriculum }}</td>
                                        <td class="p-2">{{ student.track }}</td>
                                        <td class="p-2">{{ student.sex }}</td>
                                        <td class="p-2">{{ student.birthdate }}</td>
                                        <td class="p-2">{{ student.age }}</td>
                                        <td class="p-2">
                                            <span
                                                class="px-4 py-2 rounded inline-block w-[135px] font-semibold text-center"
                                                :class="{
                                                    'bg-green-100 text-green-800': student.status === 'Accepted',
                                                    'bg-orange-100 text-orange-800': student.status === 'Pending',
                                                    'bg-red-100 text-red-800': student.status === 'Declined',
                                                }">
                                                {{ student.status }}
                                            </span>
                                        </td>

                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- ===================== Student Modal (View/Edit) ===================== -->
        <div v-if="showModal" class="fixed inset-0 z-50 bg-black/50 p-[5%] ml-40">
            <div class="bg-white p-10 flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
                <div class="flex justify-between items-center">
                    <p class="font-semibold text-2xl text-blue">Individual Registration Form</p>
                </div>

                <form @submit.prevent="handleUpdateStudent" class="flex flex-col gap-5">
                    <!-- Render modal form fields in rows -->
                    <div v-for="row in groupedFields" :key="row[0].name" class="flex flex-row gap-5">
                        <div v-for="addStudentField in row" :key="addStudentField.name"
                            :class="addStudentField.class || 'relative grow'">
                            <label class="absolute top-[-10px] left-[20px] text-sm bg-white px-2">
                                {{ addStudentField.label }}
                            </label>

                            <!-- Select Input -->
                            <select v-if="addStudentField.type === 'select'"
                                v-model="modalFormData[addStudentField.name]"
                                class="w-full py-3 px-5 border rounded appearance-none"
                                :required="addStudentField.required" :disabled="!isEditing">
                                <option disabled value="">{{ addStudentField.placeholder }}</option>
                                <option v-for="option in addStudentField.options" :key="option" :value="option">
                                    {{ option }}
                                </option>
                            </select>

                            <!-- Text Input -->
                            <input v-else :type="addStudentField.type" v-model="modalFormData[addStudentField.name]"
                                class="w-full py-3 px-5 border rounded" :placeholder="addStudentField.placeholder"
                                :maxlength="addStudentField.maxLength" :pattern="addStudentField.pattern"
                                :title="addStudentField.title" :required="addStudentField.required"
                                :disabled="!isEditing" />

                            <!-- Select Dropdown Icon -->
                            <div v-if="addStudentField.type === 'select'"
                                class="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                                <svg class="w-4 h-4 text-black" fill="none" stroke="currentColor" stroke-width="2"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <!-- Comment Section -->
                    <div class="flex flex-col gap-2">
                        <label class="text-blue font-semibold text-2xl" for="comment">COMMENT</label>
                        <textarea v-model="comment" rows="10" class="border-1 rounded-lg p-2"
                            placeholder="Superadmin comment here..." disabled></textarea>
                    </div>
                    <!-- Modal Action Buttons -->
                    <div class="flex justify-end gap-2 mt-5">
                        <button type="button" @click="closeModal"
                            class="bg-[#656464] text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors cursor-pointer">
                            Cancel
                        </button>
                        <button v-if="!isEditing" type="button" @click="startEditing"
                            class="bg-green text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors cursor-pointer">
                            Edit Record
                        </button>
                        <button v-else type="submit"
                            class="bg-blue text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors cursor-pointer">
                            Update Record
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import Dropdown from '@/components/dropdown.vue'
import Searchbar from '@/components/searchbar.vue'
import { getStudentsNoClass, createStudent, bulkRegisterStudents, editStudent } from '@/service/studentService'
import { useToast } from 'vue-toastification'
import Swal from 'sweetalert2'

function calculateAge(birthdate) {
  if (!birthdate) return ''
  const today = new Date()
  const birth = new Date(birthdate)
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}

// ===================== TAB STATE =====================
const tabs = [
    { label: 'Add Student', value: 'add' },
    { label: 'Submitted', value: 'submitted' },
]

const activeTab = ref('add')
const toast = useToast()

onMounted(async () => {
  try {
      const response = await getStudentsNoClass();

      // Check if response and response.data exist
      if (!response || !response.data) {
          console.warn('No student data received from API');
          students.value = [];
          return;
      }

      // Access the array inside response.data
      const data = response.data;

      console.log("STUDENT DATA:", data);

      if (!Array.isArray(data)) {
          console.warn('Student data is not an array');
          students.value = [];
          return;
      }

      students.value = data.map(s => ({
          gradeLevel: s.Grade_Level,
          lrn: s.LRN,
          fullName: `${s.LastName}, ${s.FirstName} ${s.MiddleName || ''}`.trim(),
          curriculum: s.Curriculum === 'JHS' ? 'Junior High School' : (s.Curriculum === 'SHS' ? 'Senior High School' : s.Curriculum),
          track: s.Track,
          sex: s.Sex === 'M' ? 'Male' : (s.Sex === 'F' ? 'Female' : s.Sex),
          birthdate: s.BirthDate,
          age: s.Age,
          status: s.Status || 'Pending',
          original: s,
          updated_at: s.updated_at,
      }));

  } catch (error) {
      console.error('Failed to fetch students:', error);
      students.value = [];
  }
});

// ===================== FORM FIELD DEFINITIONS =====================
const addStudentFields = [
    // Row 1: Basic academic info
    { name: 'Grade_Level', label: 'Grade Level', type: 'select', placeholder: 'Select Grade Level', options: ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'], required: true, row: 1 },
    { name: 'Curriculum', label: 'Curriculum', type: 'select', placeholder: 'Select Curriculum', options: [], required: true, row: 1 },
    { name: 'Track', label: 'Track', type: 'select', placeholder: 'Select Track', options: [], required: true, row: 1 },
    { name: 'LRN', label: 'LRN', type: 'text', required: true, row: 1 },
    // Row 2: Personal info
    { name: 'LastName', label: 'Last Name', type: 'text', placeholder: 'Last Name', required: true, row: 2 },
    { name: 'FirstName', label: 'First Name', type: 'text', placeholder: 'First Name', required: true, row: 2 },
    { name: 'MiddleName', label: 'Middle Name', type: 'text', placeholder: 'Middle Name', row: 2 },
    { name: 'Suffix', label: 'Suffix', type: 'select', options: ['Sr.', 'Jr.', 'II', 'III'], row: 2, },
    { name: 'Sex', label: 'Sex', type: 'select', placeholder: 'Select Sex', options: ['Male', 'Female'], required: true, row: 2, },
    { name: 'BirthDate', label: 'Birthdate', type: 'date', required: true, row: 2, class: 'relative grow-2' },
    { name: 'Age', label: 'Age', type: 'text', maxLength: 2, pattern: '\\d{1,2}', title: 'Age must be a two-digit number', required: true, row: 2, class: 'relative grow max-w-[100px]' },

    // Row 3: Address
    { name: 'Religion', label: 'Religious Affiliation', type: 'text', row: 3, class: 'relative grow-2' },
    { name: 'HouseNo', label: 'House No. /Street/ Purok', type: 'text', required: true, row: 3, class: 'relative grow-2' },
    { name: 'Barangay', label: 'Barangay', type: 'text', required: true, row: 3, class: 'relative grow-2' },
    { name: 'Municipality', label: 'Municipality/City', type: 'text', required: true, row: 3, class: 'relative grow-2' },
    { name: 'Province', label: 'Province', type: 'text', required: true, row: 3, class: 'relative grow-2' },
    // Row 4: Family/Guardian info
    { name: 'FatherName', label: "Father's Name", type: 'text', row: 4, class: 'relative grow-2' },
    { name: 'MotherName', label: "Mother's Name", type: 'text', row: 4, class: 'relative grow-2' },
    { name: 'Guardian', label: "Guardian's Name", type: 'text', row: 4 },
    { name: 'Relationship', label: 'Relationship w/ Guardian', type: 'text', row: 4 },
    { name: 'ContactNumber', label: 'Guardian/Parent Contact No.', type: 'text', required: true, row: 4 }
]


const groupedFields = computed(() => {
    const rows = []
    for (let i = 1; i <= 4; i++) {
        rows.push(addStudentFields.filter(f => f.row === i))
    }
    return rows
})

// ===================== STATIC STUDENT DATA =====================
// All students are kept in this reactive array 
const students = ref([])

// ===================== INDIVIDUAL REGISTRATION STATE =====================
const formData = reactive(Object.fromEntries(addStudentFields.map(f => [f.name, ''])))

const trackOptions = {
    'Junior High School': ['Academic', 'Arts and Design', 'Sports'],
    'Senior High School': ['TVL', 'ABM', 'HUMMS', 'STEM']
}

watch(() => formData.Grade_Level, (newValue) => {
  if (['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'].includes(newValue)) {
    formData.Curriculum = 'Junior High School'
  } else if (['Grade 11', 'Grade 12'].includes(newValue)) {
    formData.Curriculum = 'Senior High School'
  } else {
    formData.Curriculum = ''
  }

  // Reset track when grade level changes
  formData.track = ''

  // Update curriculum options (so it can display the selected value)
  const curriculumField = addStudentFields.find(field => field.name === 'Curriculum')
  if (curriculumField) {
    curriculumField.options = ['Junior High School', 'Senior High School']
  }

  // Update track options dynamically
    const trackField = addStudentFields.find(field => field.name === 'Track')
  if (trackField) {
      trackField.options = trackOptions[formData.Curriculum] || []
  }
})

watch(() => formData.BirthDate, (newDate) => {
    formData.Age = calculateAge(newDate).toString()
})

async function handleAddStudentSubmit() {
    try {
        const result = await Swal.fire({
            title: 'Add New Student?',
            text: "Are you sure you want to submit this student's record?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, add student',
            cancelButtonText: 'Cancel'
        })

        if (!result.isConfirmed) return;

        const dataToSend = JSON.parse(JSON.stringify(formData))

        // Normalize Sex
        if (dataToSend.Sex === 'Male') dataToSend.Sex = 'M'
        else if (dataToSend.Sex === 'Female') dataToSend.Sex = 'F'

        // Normalize Curriculum
        if (dataToSend.Curriculum === 'Junior High School') dataToSend.Curriculum = 'JHS'
        else if (dataToSend.Curriculum === 'Senior High School') dataToSend.Curriculum = 'SHS'

        // Clean Grade Level
        if (dataToSend.Grade_Level?.startsWith('Grade ')) {
            dataToSend.Grade_Level = dataToSend.Grade_Level.replace('Grade ', '')
        }

        console.log("DATA TO SEND:", dataToSend)

        await createStudent(dataToSend)

        await getStudentsNoClass() 

        // Reset form
        Object.keys(formData).forEach(key => (formData[key] = ''))

        await Swal.fire({
            title: 'Success!',
            text: 'Student added successfully.',
            icon: 'success',
            confirmButtonText: 'OK'
        })
    } catch (error) {
        console.error('Error adding student:', error)

        await Swal.fire({
            title: 'Failed!',
            text: 'Failed to add student. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK'
        })
    }
}




// ===================== BULK REGISTRATION STATE =====================

const bulkFormData = ref({
    gradeLevel: "",
    curriculum: "",
    track: ""
});

const selectedFile = ref(null);
const fileInput = ref(null);

const handleFileUpload = (event) => {
    selectedFile.value = event.target.files[0];
};

const handleBulkSubmit = async () => {
    if (!selectedFile.value) {
        alert("Please select a CSV file.");
        return;
    }

    const formData = new FormData();
    formData.append("csv_file", selectedFile.value);

    // Remove 'Grade' word if present, and trim whitespace
    const grade = bulkFormData.value.gradeLevel.replace(/Grade\s*/i, "").trim();

      let curriculum = bulkFormData.value.curriculum;
    if (curriculum === 'Junior High School') curriculum = 'JHS';
    else if (curriculum === 'Senior High School') curriculum = 'SHS';

    formData.append("gradeLevel", grade);
    formData.append("curriculum", curriculum);
    formData.append("track", bulkFormData.value.track);

    try {
        const response = await bulkRegisterStudents(formData);
        toast.success('Students added successfully!');
        // Reset form
        bulkFormData.value = {
            gradeLevel: "",
            curriculum: "",
            track: ""
        };

        selectedFile.value = null;
        fileInput.value.value = ""; // reset the actual input
    } catch (error) {
        toast.error(error.message || "Bulk registration failed.");
        console.log(error.message);
    }
};


// ===================== FILTERS & SEARCH FOR SUBMITTED STUDENTS =====================
const selectedGrade = ref('')
const selectedCurriculum = ref('')
const selectedSex = ref('')
const selectedAcademicTrack = ref('')
const searchQuery = ref('')

const filteredStudents = computed(() => {
    let filtered = students.value;

    if (searchQuery.value) {
        filtered = filtered.filter(student =>
            student.fullName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            student.lrn?.toString().includes(searchQuery.value)
        );
    }

    console.log('updated_at dates:', filtered.map(s => s.updated_at));

    return filtered.slice().sort((a, b) => {
        const dateA = new Date(a.updated_at);
        const dateB = new Date(b.updated_at);

        // Check if dates are valid
        const validA = !isNaN(dateA);
        const validB = !isNaN(dateB);

        if (validA && validB) {
            return dateB - dateA; // descending
        }
        if (validA) return -1; // put a with valid date before b
        if (validB) return 1;  // put b with valid date before a
        return 0; // both invalid, keep original order
    });
});


// ===================== MODAL FOR VIEWING/EDITING STUDENT =====================
const showModal = ref(false)
const selectedStudent = ref(null)
const originalFormData = ref({});

// Create reactive modalFormData with initial keys from addStudentFields
const modalFormData = reactive(Object.fromEntries(addStudentFields.map(f => [f.name, ''])))

const isEditing = ref(false)
const comment = ref('')

function openModal(student) {
    showModal.value = true;
    isEditing.value = false;
    selectedStudent.value = student;

    const original = student.original;
    comment.value = original.comments || '';

    console.log("DADWADAW:", original)
    for (const key in modalFormData) {
        modalFormData[key] = original[key] ?? '';
    }

    originalFormData.value = { ...modalFormData };

    if (original.Sex === 'M') modalFormData.Sex = 'Male';
    else if (original.Sex === 'F') modalFormData.Sex = 'Female';

    if (original.Curriculum === 'JHS') modalFormData.Curriculum = 'Junior High School';
    else if (original.Curriculum === 'SHS') modalFormData.Curriculum = 'Senior High School';

    if (original.Grade_Level) {
        modalFormData.Grade_Level = `Grade ${original.Grade_Level}`;
    }

    const curriculumField = addStudentFields.find(f => f.name === 'Curriculum');
    if (curriculumField) {
        curriculumField.options = ['Junior High School', 'Senior High School'];
    }

    const curriculum = modalFormData.Curriculum;
    const trackField = addStudentFields.find(f => f.name === 'Track');
    if (trackField) {
        trackField.options = trackOptions[curriculum] || [];
    }
}



// ✅ Called when user cancels/close modal
function closeModal() {
    showModal.value = false
    selectedStudent.value = null
    isEditing.value = false
    comment.value = ''

    // Clear form data
    Object.keys(modalFormData).forEach(key => {
        modalFormData[key] = ''
    })
}

// ✅ Enables form editing
function startEditing() {
    isEditing.value = true
}

// ✅ Handles updating student data
async function handleUpdateStudent() {
    if (!selectedStudent.value) return;

    try {
        const confirmResult = await Swal.fire({
            title: 'Update Student Record?',
            text: "Are you sure you want to save changes to this student's record?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, update',
            cancelButtonText: 'Cancel'
        });

        if (!confirmResult.isConfirmed) return;

        const studentId = selectedStudent.value.original.Student_ID;
        const updatedData = { ...modalFormData };

        // Normalize values
        if (updatedData.Sex === 'Male') updatedData.Sex = 'M';
        else if (updatedData.Sex === 'Female') updatedData.Sex = 'F';

        if (updatedData.Curriculum === 'Junior High School') updatedData.Curriculum = 'JHS';
        else if (updatedData.Curriculum === 'Senior High School') updatedData.Curriculum = 'SHS';

        if (updatedData.Grade_Level?.startsWith('Grade ')) {
            updatedData.Grade_Level = updatedData.Grade_Level.replace('Grade ', '');
        }

        ['MiddleName', 'Suffix', 'Religion'].forEach(field => {
            if (!updatedData[field] || updatedData[field] === '') {
                updatedData[field] = null;
            }
        });

        updatedData.comments = comment.value;

        console.log('FINAL DATA TO UPDATE:', updatedData);

        // API call
        const response = await editStudent(studentId, updatedData);
        await getStudentsNoClass();
        await Swal.fire({
            title: 'Updated!',
            text: 'Student record updated successfully.',
            icon: 'success',
            confirmButtonText: 'OK'
        });

  
        // Close modal and reset state
        isEditing.value = false;
        closeModal();

        window.location.reload();


    } catch (error) {
        console.error('Error updating student:', error);

        await Swal.fire({
            title: 'Update Failed',
            text: 'Failed to update student record. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
}




</script>
