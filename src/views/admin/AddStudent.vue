<template>
    <div class="p-5">
        <p class="font-semibold text-6xl mb-7">Add Student</p>

        <div class="flex justify-between p-8 rounded-t-xl" style="box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;">
            <div v-for="tab in tabs" :key="tab.value" class="w-[48%] cursor-pointer"
                :class="activeTab === tab.value ? 'border-blue border-b-2' : ''" @click="activeTab = tab.value">
                <p class="text-center pb-2 font-semibold text-lg" :class="activeTab === tab.value ? 'text-blue' : ''">
                    {{ tab.label }}
                </p>
            </div>
        </div>

        <div class="my-5">
            <div class="flex flex-col gap-10" v-if="activeTab === 'add'">
                <div class="p-7 rounded-t-xl" style="box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;">
                    <p class="font-semibold text-xl text-blue mb-5">Individual Registration Form</p>

                    <form @submit.prevent="handleAddStudentSubmit" class="flex flex-col gap-5">
                        <div v-for="row in groupedFields" :key="row[0].name" class="flex flex-row gap-5">
                            <div v-for="addStudentField in row" :key="addStudentField.name"
                                :class="addStudentField.class || 'relative grow'">
                                <label class="absolute top-[-10px] left-[20px] text-sm bg-white px-2">
                                    {{ addStudentField.label }}
                                </label>

                                <!-- Select Input -->
                                <select v-if="addStudentField.type === 'select'"
                                    v-model="formData[addStudentField.name]"
                                    class="w-full py-3 px-5 border rounded appearance-none"
                                    :required="addStudentField.required">
                                    <option disabled value="">{{ addStudentField.placeholder }}</option>
                                    <option v-for="option in addStudentField.options" :key="option" :value="option">
                                        {{ option }}
                                    </option>
                                </select>

                                <!-- Text Input -->
                                <input v-else :type="addStudentField.type" v-model="formData[addStudentField.name]"
                                    class="w-full py-3 px-5 border rounded" :placeholder="addStudentField.placeholder"
                                    :maxlength="addStudentField.maxLength" :pattern="addStudentField.pattern"
                                    :title="addStudentField.title" :required="addStudentField.required" />

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

                        <div class="flex justify-end mt-5">
                            <button type="submit"
                                class="bg-blue text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors cursor-pointer">
                                Add Student
                            </button>
                        </div>
                    </form>
                </div>

                <div class="p-7 rounded-t-xl" style="box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;">
                    <p class="font-semibold text-xl text-blue mb-5">Bulk Registration Form</p>

                    <form @submit.prevent="handleBulkSubmit" class="flex flex-col gap-5">
                        <div class="flex flex-row gap-5 w-[70%]">
                            <!-- Grade Level -->
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

                            <!-- Curriculum -->
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

                            <!-- Track -->
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

                        <!-- CSV Upload Section -->
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

                        <div class="flex justify-end mt-5">
                            <button type="submit"
                                class="bg-blue text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors cursor-pointer">
                                Add Student(s)
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div v-else-if="activeTab === 'submitted'">
                <div class="flex flex-col gap-10">
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
                                        <td class="p-2">{{ formatDate(student.birthdate) }}</td>
                                        <td class="p-2">{{ student.age }}</td>
                                        <td class="p-2">
                                            <span
                                                class="px-4 py-2 rounded text-white inline-block w-[135px] font-light text-center bg-[#FF9204]">
                                                Pending
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

        <!-- Student Modal -->
        <div v-if="showModal" class="fixed inset-0 z-50 bg-black/50 p-[5%] ml-40">
            <div class="bg-white p-10 flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
                <div class="flex justify-between items-center">
                    <p class="font-semibold text-2xl text-blue">Individual Registration Form</p>
                </div>

                <form @submit.prevent="handleUpdateStudent" class="flex flex-col gap-5">
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

                    <div class="flex flex-col gap-2">
                        <label class="text-blue font-semibold text-2xl" for="comment">COMMENT</label>
                        <textarea v-model="comment" rows="10" class="border-1 rounded-lg p-2"
                            placeholder="Superadmin comment here..." disabled="true"></textarea>
                    </div>

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
import { ref, reactive, computed } from 'vue'
import Dropdown from '@/components/dropdown.vue';
import Searchbar from '@/components/searchbar.vue'

const tabs = [
    { label: 'Add Student', value: 'add' },
    { label: 'Submitted', value: 'submitted' },
]

const activeTab = ref('add')

const addStudentFields = [
    // row 1
    { name: 'gradeLevel', label: 'Grade Level', type: 'select', placeholder: 'Select Grade Level', options: ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'], required: true, row: 1 },
    { name: 'curriculum', label: 'Curriculum', type: 'select', placeholder: 'Select Curriculum', options: ['Junior High School', 'Senior High School'], required: true, row: 1 },
    { name: 'track', label: 'Track', type: 'select', placeholder: 'Select Track', options: ['TVL', 'Academic', 'Arts and Design', 'Sports', 'ABM', 'STEM', 'HUMMS'], required: true, row: 1 },
    { name: 'lrn', label: 'LRN', type: 'text', required: true, row: 1 },
    // row 2
    { name: 'fullName', label: 'Full Name', type: 'text', placeholder: 'LastName, First Name Middle Initial', required: true, row: 2 },
    { name: 'sex', label: 'Sex', type: 'select', placeholder: 'Select Sex', options: ['Male', 'Female'], required: true, row: 2 },
    { name: 'birthdate', label: 'Birthdate', type: 'date', required: true, row: 2, class: 'relative grow-2' },
    { name: 'age', label: 'Age', type: 'text', maxLength: 2, pattern: '\\d{1,2}', title: 'Age must be a two-digit number', required: true, row: 2, class: 'relative grow max-w-[150px]' },
    { name: 'religion', label: 'Religious Affiliation', type: 'text', row: 2, class: 'relative grow-2' },
    // row 3
    { name: 'street', label: 'House No. /Street/ Purok', type: 'text', required: true, row: 3, class: 'relative grow-2' },
    { name: 'barangay', label: 'Barangay', type: 'text', required: true, row: 3, class: 'relative grow-2' },
    { name: 'city', label: 'Municipality/City', type: 'text', required: true, row: 3, class: 'relative grow-2' },
    { name: 'province', label: 'Province', type: 'text', required: true, row: 3, class: 'relative grow-2' },
    // row 4
    { name: 'father', label: "Father's Name", type: 'text', row: 4, class: 'relative grow-2' },
    { name: 'mother', label: "Mother's Name", type: 'text', row: 4, class: 'relative grow-2' },
    { name: 'guardian', label: "Guardian's Name", type: 'text', row: 4 },
    { name: 'relationship', label: 'Relationship w/ Guardian', type: 'text', row: 4 },
    { name: 'contact', label: 'Guardian/Parent Contact No.', type: 'text', required: true, row: 4 }
]

const groupedFields = computed(() => {
    const rows = []
    for (let i = 1; i <= 4; i++) {
        rows.push(addStudentFields.filter(f => f.row === i))
    }
    return rows
})

const formData = reactive(Object.fromEntries(addStudentFields.map(f => [f.name, ''])))

const handleAddStudentSubmit = () => {
    const existingStudents = JSON.parse(localStorage.getItem('addedStudent') || '[]')
    existingStudents.push({ ...formData })
    localStorage.setItem('addedStudent', JSON.stringify(existingStudents))
    Object.keys(formData).forEach(key => (formData[key] = ''))
}

const bulkFormData = reactive({
    gradeLevel: '',
    curriculum: '',
    track: '',
})

const fileInput = ref(null)
const selectedFile = ref(null)

const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file && file.type === 'text/csv') {
        selectedFile.value = file
    } else {
        alert('Please upload a valid CSV file')
        if (fileInput.value) {
            fileInput.value.value = ''
        }
        selectedFile.value = null
    }
}

const handleBulkSubmit = async () => {
    try {
        if (!selectedFile.value) {
            alert('Please upload a CSV file')
            return
        }

        console.log('Bulk form submitted:', {
            ...bulkFormData,
            file: selectedFile.value
        })

        bulkFormData.gradeLevel = ''
        bulkFormData.curriculum = ''
        bulkFormData.track = ''
        selectedFile.value = null
        if (fileInput.value) {
            fileInput.value.value = ''
        }
    } catch (error) {
        console.error('Error submitting bulk form:', error)
    }
}

const selectedGrade = ref('')
const selectedCurriculum = ref('')
const selectedSex = ref('')
const selectedAcademicTrack = ref('')
const searchQuery = ref('')

const localStorageUpdateTrigger = ref(0)

const filteredStudents = computed(() => {
    localStorageUpdateTrigger.value

    const students = JSON.parse(localStorage.getItem('addedStudent') || '[]')

    let filtered = students.filter(student => {
        const matchesGrade = !selectedGrade.value || student.gradeLevel === selectedGrade.value
        const matchesCurriculum = !selectedCurriculum.value || student.curriculum === selectedCurriculum.value
        const matchesSex = !selectedSex.value || student.sex === selectedSex.value
        const matchesTrack = !selectedAcademicTrack.value || student.track === selectedAcademicTrack.value

        return matchesGrade && matchesCurriculum && matchesSex && matchesTrack
    })

    if (searchQuery.value) {
        filtered = filtered.filter(student =>
            student.fullName.toLowerCase().includes(searchQuery.value.toLowerCase())
        )
    }

    return filtered
})

const resetFilters = () => {
    selectedGrade.value = ''
    selectedCurriculum.value = ''
    selectedSex.value = ''
    selectedAcademicTrack.value = ''
    searchQuery.value = ''
}

const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

const showModal = ref(false)
const selectedStudent = ref(null)
const modalFormData = reactive(Object.fromEntries(addStudentFields.map(f => [f.name, ''])))
const isEditing = ref(false)
const comment = ref('')

const openModal = (student) => {
    selectedStudent.value = student
    isEditing.value = false
    Object.keys(modalFormData).forEach(key => {
        modalFormData[key] = ''
    })
    Object.keys(modalFormData).forEach(key => {
        if (student[key] !== undefined) {
            modalFormData[key] = student[key]
        }
    })
    comment.value = student.comment || ''
    showModal.value = true
}

const closeModal = () => {
    showModal.value = false
    selectedStudent.value = null
    isEditing.value = false
    comment.value = ''
}

const startEditing = () => {
    isEditing.value = true
}

const handleUpdateStudent = () => {
    const existingStudents = JSON.parse(localStorage.getItem('addedStudent') || '[]')

    const index = existingStudents.findIndex(s => s.lrn === modalFormData.lrn)
    if (index !== -1) {
        existingStudents[index] = {
            ...existingStudents[index],
            ...modalFormData,
            comment: comment.value
        }


        localStorage.setItem('addedStudent', JSON.stringify(existingStudents))

        localStorageUpdateTrigger.value++

        alert('Student record updated successfully!')
    } else {
        alert('Error: Student record not found!')
    }

    isEditing.value = false
    closeModal()
}
</script>
