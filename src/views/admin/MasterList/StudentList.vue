<template>
    <div>
        <span class="text-black text-2xl font-semibold mb-8 cursor-pointer hover:text-blue-500" @click="goBack">
            &lt; <span class="underline hover:underline">Back</span>
        </span>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center h-64">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
        <!-- Error State -->
        <div v-else-if="error" class="text-red-500 text-center p-4">
            {{ error }}
        </div>
        <!-- Content -->
        <div v-else>
            <div class="student-list-container mt-6 mb-6 shadow-xl border border-gray-300">
                <div class="flex items-center justify-between flex-wrap gap-4">
    <!-- Left: Filters (Selects directly side by side) -->
    <div class="flex gap-2">
        <select v-model="genderFilter" class="filter-dropdown w-40 h-10 px-3 border border-gray-300 rounded-md">
            <option value="All">All</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
        </select>

        <select v-model="sortOrder" class="filter-dropdown w-40 h-10 px-3 border border-gray-300 rounded-md">
            <option value="Latest">Latest</option>
            <option value="Oldest">Oldest</option>
        </select>
    </div>

    <!-- Right: Search Bar + Buttons -->
    <div class="flex items-center gap-4 ml-auto">
        <!-- Search Bar -->
        <div class="relative w-80">
            <input v-model="searchTerm" type="text" placeholder="Search..."
                class="border border-[#295f98] rounded-md py-2 px-3 pl-10 w-full h-10" />
            <i class="fas fa-search text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"></i>
        </div>

        <!-- Buttons -->
        <div class="flex gap-2">
            <button class="bg-[#858585] p-2 rounded cursor-pointer text-white w-10 h-10 flex items-center justify-center" @click="handleDownload">
                <i class="fas fa-download"></i>
            </button>
            <button class="bg-red p-2 rounded cursor-pointer text-white w-10 h-10 flex items-center justify-center" @click="handleDeleteAll(selectedCard)">
                <i class="fas fa-trash-alt"></i>
            </button>
            <button class="bg-blue p-2 rounded cursor-pointer text-white w-10 h-10 flex items-center justify-center" @click="showAddModal = true">
                <i class="fas fa-plus"></i>
            </button>
            <button class="bg-green p-2 rounded cursor-pointer text-white w-10 h-10 flex items-center justify-center" @click="openEditModal">
                <i class="fas fa-edit"></i>
            </button>
        </div>
    </div>
</div>



            <div class="student-list-container">
                <div class="overflow-x-auto bg-white shadow mb-6">
                    <table class="min-w-full">
                        <thead>
                            <tr>
                                <th class="bg-gray-100 font-semibold px-4 py-3 text-center">LRN</th>
                                <th class="bg-gray-100 font-semibold px-4 py-3 text-center">Full Name</th>
                                <th class="bg-gray-100 font-semibold px-4 py-3 text-center">Gender</th>
                                <th class="bg-gray-100 font-semibold px-4 py-3 text-center">Birthdate</th>
                                <th class="bg-gray-100 font-semibold px-4 py-3 text-center">Age</th>
                                <th class="bg-gray-100 font-semibold px-4 py-3 text-center">Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="student in filteredStudents" :key="student.lrn">
                                <td class="px-4 py-3  text-center text-base font-medium">{{ student.lrn }}</td>
                                <td class="px-4 py-3  text-center text-base font-medium">{{ student.fullName }}</td>
                                <td class="px-4 py-3  text-center text-base font-medium">{{ student.gender }}</td>
                                <td class="px-4 py-3  text-center text-base font-medium">{{ student.birthdate }}</td>
                                <td class="px-4 py-3  text-center text-base font-medium">{{
                                    calculateAge(student.birthdate) }}
                                </td>
                                <td class="px-4 py-3  text-center text-base font-medium">{{ student.address }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- ADD STUDENT MODAL -->
    <div v-if="showAddModal" class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
        <div class="bg-white rounded-lg shadow-lg p-8 w-[90vw] max-w-5xl relative">
            <div class="flex justify-between items-start gap-8">
                <div>
                    <!-- Left: Filters -->
                    <div class="flex gap-4">
                        <div class="relative w-30">
                            <select v-model="modalGenderFilter"
                                class="appearance-none border border-gray-300 rounded-md px-5 py-2 w-full">
                                <option value="Female">Female</option>
                                <option value="Male">Male</option>
                                <option value="All">All</option>
                            </select>
                            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                        <div class="relative w-30">
                            <select v-model="modalSortOrder"
                                class="appearance-none border border-gray-300 rounded-md px-5 py-2 w-full">
                                <option value="Latest">Latest</option>
                                <option value="Oldest">Oldest</option>
                            </select>
                            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <!-- Restore Select All Checkbox below filters -->
                    <label class="flex items-center mt-4">
                        <input type="checkbox" v-model="modalSelectAll" @change="toggleModalSelectAll">
                        <span class="ml-2">Select All</span>
                    </label>
                </div>

                <!-- Right: Search #295f98 -->
                <div class="relative flex-1 mx-4 w-full">
                    <input v-model="modalSearchTerm" type="text" placeholder="Search..."
                        class="border border-gray-300 rounded-md py-2 px-3 pl-10 w-full" />
                    <svg xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>
            <!-- Table with checkboxes -->
            <div class="mt-6 max-h-[60vh] overflow-auto">
                <table class="min-w-full">
                    <thead>
                        <tr>
                            <th></th>
                            <th class="bg-gray-100 font-semibold px-4 py-3 text-center">LRN</th>
                            <th class="bg-gray-100 font-semibold px-4 py-3 text-center">Full Name</th>
                            <th class="bg-gray-100 font-semibold px-4 py-3 text-center">Gender</th>
                            <th class="bg-gray-100 font-semibold px-4 py-3 text-center">Birthdate</th>
                            <th class="bg-gray-100 font-semibold px-4 py-3 text-center">Age</th>
                            <th class="bg-gray-100 font-semibold px-4 py-3 text-center">Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="student in filteredModalStudents" :key="student.lrn">
                            <td>
                                <input type="checkbox" v-model="modalSelectedStudents" :value="student.id">
                            </td>
                            <td class="px-4 py-3  text-center text-base font-medium">{{ student.lrn }}</td>
                            <td class="px-4 py-3  text-center text-base font-medium">{{ student.fullName }}</td>
                            <td class="px-4 py-3  text-center text-base font-medium">{{ student.gender }}</td>
                            <td class="px-4 py-3  text-center text-base font-medium">{{ student.birthdate }}</td>
                            <td class="px-4 py-3  text-center text-base font-medium">{{ calculateAge(student.birthdate)
                                }}</td>
                            <td class="px-4 py-3  text-center text-base font-medium">{{ student.address }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="flex justify-end gap-2 mt-6">
                <button class="px-6 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
                    @click="showAddModal = false">Cancel</button>
                <button class="px-6 py-2 rounded bg-blue hover:bg-blue-700 text-white cursor-pointer"
                    @click="handleAddStudents(selectedCard)">Add Students</button>
            </div>
        </div>
    </div>

    <div v-if="showEditModal" class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
        <div class="bg-white rounded-lg shadow-lg p-8 w-[90vw] max-w-5xl relative">
            <button @click="showEditModal = false"
                class="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-2xl">&times;</button>
            <div class="flex justify-between items-start gap-8">
                <div>
                    <!-- Left: Filters -->
                    <div class="flex gap-4">
                        <div class="relative w-30">
                            <select v-model="editModalGenderFilter"
                                class="appearance-none border border-gray-300 rounded-md px-5 py-2 w-full">
                                <option value="Female">Female</option>
                                <option value="Male">Male</option>
                                <option value="All">All</option>
                            </select>
                            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <!-- Select All Checkbox -->
                    <label class="flex items-center mt-4">
                        <input type="checkbox" v-model="editModalSelectAll" @change="toggleEditModalSelectAll">
                        <span class="ml-2">Select All</span>
                    </label>
                </div>
                <!-- Right: Search -->
                <div class="relative flex-1 mx-4 w-full">
                    <input v-model="editModalSearchTerm" type="text" placeholder="Search..."
                        class="border border-gray-300 rounded-md py-2 px-3 pl-10 w-full" />
                    <svg xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>
            <!-- Table with checkboxes -->
            <div class="mt-6 max-h-[60vh] overflow-auto">
                <table class="min-w-full">
                    <thead>
                        <tr>
                            <th></th>
                            <th class="bg-gray-100 font-semibold px-4 py-3 text-center">LRN</th>
                            <th class="bg-gray-100 font-semibold px-4 py-3 text-center">Full Name</th>
                            <th class="bg-gray-100 font-semibold px-4 py-3 text-center">Gender</th>
                            <th class="bg-gray-100 font-semibold px-4 py-3 text-center">Birthdate</th>
                            <th class="bg-gray-100 font-semibold px-4 py-3 text-center">Age</th>
                            <th class="bg-gray-100 font-semibold px-4 py-3 text-center">Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="student in filteredEditModalStudents" :key="student.lrn">
                            <td>
                                <input type="checkbox" v-model="editModalSelectedStudents" :value="student.id">
                            </td>
                            <td class="px-4 py-3  text-center text-base font-medium">{{ student.lrn }}</td>
                            <td class="px-4 py-3  text-center text-base font-medium">{{ student.fullName }}</td>
                            <td class="px-4 py-3  text-center text-base font-medium">{{ student.gender }}</td>
                            <td class="px-4 py-3  text-center text-base font-medium">{{ student.birthdate }}</td>
                            <td class="px-4 py-3  text-center text-base font-medium">{{ calculateAge(student.birthdate)
                                }}</td>
                            <td class="px-4 py-3  text-center text-base font-medium">{{ student.address }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="flex justify-end gap-2 mt-6">
                <button class="px-6 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
                    @click="showEditModal = false">Cancel</button>
                <button class="px-6 py-2 rounded bg-green hover:bg-green-700 text-white cursor-pointer"
                    @click="handleUpdateClass(selectedCard)">Update Class</button>
            </div>
        </div>
    </div>
</div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import * as XLSX from 'xlsx';
import { getAllAcceptedStudents } from '@/service/studentService';
import { addStudentsToClass, removeStudentToClass, deleteClass } from '@/service/adminClassService';
import Swal from 'sweetalert2'
import { useToast } from 'vue-toastification'

const toast = useToast()
const props = defineProps({
    selectedCard: {
        type: Object,
        required: true,
    },
});

// Add loading and error states
const loading = ref(true);
const error = ref(null);

const genderFilter = ref('All');
const sortOrder = ref('Latest');
const searchTerm = ref('');
const selectAll = ref(false);
const selectedStudents = ref([]);
const showAddModal = ref(false);

// Modal-specific filter/search/sort state
const modalGenderFilter = ref('All');
const modalSortOrder = ref('Latest');
const modalSearchTerm = ref('');
const modalSelectAll = ref(false);
const modalSelectedStudents = ref([]);

const showEditModal = ref(false);
const editModalGenderFilter = ref('All');
const editModalSearchTerm = ref('');
const editModalSelectAll = ref(false);
const editModalSelectedStudents = ref([]);

// Arrays prepared for dynamic population
const students = ref([]); // Will hold main student list
const possibleModalStudents = ref([]); // Will hold selectable students for modal

// ✅ Function to populate students
async function populateStudents(card) {
    try {
        loading.value = true;
        error.value = null;

        if (card && Array.isArray(card.student_classes)) {
            students.value = card.student_classes
                .filter(sc => sc.student)
                .map(sc => {
                    const s = sc.student;
                    const fullName = `${s.FirstName} ${s.MiddleName || ''} ${s.LastName}`.trim();
                    return {
                        Student_ID: s.Student_ID,   // Keep original key for clarity
                        id: s.Student_ID,           // Add alias 'id' for convenience in Vue
                        fullName,
                        lrn: s.LRN,
                        address: `${s.Barangay}, ${s.Municipality}, ${s.Province}`,
                        gender: s.Sex,
                        birthdate: s.BirthDate,
                        ...s
                    };
                });

            console.log("✅ Students populated:", students.value);
        } else {
            console.warn("⚠️ No valid student_classes found in selectedCard");
            students.value = [];
        }
    } catch (err) {
        error.value = err.message || 'Failed to populate students';
        console.error('Error populating students:', err);
    } finally {
        loading.value = false;
    }
}

// ✅ Populate on mount
onMounted(async () => {
    console.log('🔄 Mounted selectedCard:', props.selectedCard);
    await populateStudents(props.selectedCard);
    await populatePossibleModalStudents(props.selectedCard);
});

const populatePossibleModalStudents = async (selectedCard) => {
    if (!selectedCard || !selectedCard.Class_ID) return;

    try {
        const response = await getAllAcceptedStudents();
        console.log('📥 Raw response from getAllAcceptedStudents:', response);

        const allStudents = response.students || [];

        possibleModalStudents.value = allStudents
            .filter(student => {
                return (
                    student.Grade_Level === selectedCard.Grade_Level &&
                    student.Curriculum === selectedCard.Curriculum &&
                    student.Status === 'Accepted'
                );
            })
            .map(s => ({
                id: s.Student_ID,  // <-- add this alias!
                fullName: `${s.FirstName} ${s.MiddleName || ''} ${s.LastName}`.trim(),
                lrn: s.LRN,
                gender: s.Sex,
                birthdate: s.BirthDate,
                address: `${s.Barangay}, ${s.Municipality}, ${s.Province}`,
                ...s,
            }));

        console.log('🎯 Filtered possibleModalStudents:', possibleModalStudents.value);
    } catch (error) {
        console.error('❌ Error fetching accepted students:', error);
    }
};

// ✅ Re-populate on prop change
watch(() => props.selectedCard, (newCard) => {
    console.log("🔁 selectedCard changed:", newCard);
    populateStudents(newCard);
});

// ✅ Computed filtered students
const filteredStudents = computed(() => {
    let result = [...students.value];

    if (genderFilter.value !== 'All') {
        const genderCode = genderFilter.value === 'Female' ? 'F' : 'M';
        result = result.filter((student) => student.gender === genderCode);
    }

    if (searchTerm.value.trim()) {
        const term = searchTerm.value.toLowerCase();
        result = result.filter(
            (student) =>
                student.fullName.toLowerCase().includes(term) ||
                student.lrn.includes(term) ||
                student.address.toLowerCase().includes(term)
        );
    }

    if (sortOrder.value !== 'Latest') {
        result.reverse();
    }

    return result;
});

const emit = defineEmits(['goBack']);

function goBack() {
    emit('goBack');
}

function calculateAge(birthdate) {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth();
    if (
        month < birthDate.getMonth() ||
        (month === birthDate.getMonth() && today.getDate() < birthDate.getDate())
    ) {
        age--;
    }
    return age;
}

function handleDownload() {
    const exportData = filteredStudents.value.map(student => ({
        ...student,
        age: calculateAge(student.birthdate),
    }));

    const wsData = [
        ['LRN', 'Full Name', 'Gender', 'Birthdate', 'Age', 'Address'],
        ...exportData.map(student => [
            student.lrn,
            student.fullName,
            student.gender,
            student.birthdate,
            student.age ? String(student.age) : '',
            student.address,
        ]),
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Students');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'StudentList.xlsx';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 0);

    // Show toast notification
    toast.success('Student list downloaded successfully!')
}

const handleDeleteAll = async (selectedCard) => {
    if (!selectedCard?.Class_ID) {
        Swal.fire('Missing Class ID', 'Please select a valid class to delete.', 'warning');
        return;
    }

    const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'This will delete all student records in this class!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete all'
    });

    if (result.isConfirmed) {
        try {
            const response = await deleteClass({ class_id: selectedCard.Class_ID });
            students.value = [];
            toast.success(response.message || 'All student records deleted successfully!');
        } catch (error) {
            toast.error(error.message || 'Failed to delete student records.');
        }
    }
};


function toggleSelectAll() {
    if (selectAll.value) {
        selectedStudents.value = filteredStudents.value.map(s => s.lrn);
    } else {
        selectedStudents.value = [];
    }
}

const filteredModalStudents = computed(() => {
    let result = [...possibleModalStudents.value];

    if (modalGenderFilter.value !== 'All') {
        const genderCode = modalGenderFilter.value === 'Female' ? 'F' : 'M';
        result = result.filter((student) => student.gender === genderCode);
    }

    if (modalSearchTerm.value.trim()) {
        const term = modalSearchTerm.value.toLowerCase();
        result = result.filter(
            (student) =>
                student.fullName.toLowerCase().includes(term) ||
                student.lrn.includes(term) ||
                student.address.toLowerCase().includes(term)
        );
    }

    if (modalSortOrder.value !== 'Latest') {
        result.reverse();
    }

    return result;
});

function toggleModalSelectAll() {
    if (modalSelectAll.value) {
        modalSelectedStudents.value = filteredModalStudents.value.map(s => s.id);
    } else {
        modalSelectedStudents.value = [];
    }
}

const handleAddStudents = async (selectedCard) => {
    console.log("selected IDS (ref):", modalSelectedStudents);

    if (!selectedCard?.Class_ID) {
        Swal.fire('Missing Class ID', 'Please select a valid class.', 'warning');
        return;
    }

    const studentIdsToAdd = modalSelectedStudents.value.map(id => Number(id));

    console.log("Raw selected IDs:", modalSelectedStudents.value);
    console.log("Individual student IDs:");
    studentIdsToAdd.forEach((id, index) => {
        console.log(`Index ${index}: ID =`, id);
    });

    if (studentIdsToAdd.length === 0) {
        Swal.fire('No Students Selected', 'Please select at least one student.', 'info');
        return;
    }

    const result = await Swal.fire({
        title: 'Add Students?',
        text: `You are about to add ${studentIdsToAdd.length} students to the class.`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, add them',
        cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) return;

    const payload = {
        student_ids: studentIdsToAdd,
        class_id: selectedCard.Class_ID,
    };

    console.log('📦 Sending payload to API:', payload);

    try {
        const response = await addStudentsToClass(payload);

        const toAdd = possibleModalStudents.value.filter(s => studentIdsToAdd.includes(s.id));
        for (const student of toAdd) {
            if (!students.value.some(mainS => mainS.lrn === student.lrn)) {
                students.value.push({ ...student });
            }
        }

        showAddModal.value = false;
        modalSelectedStudents.value = [];
        modalSelectAll.value = false;

        toast.success('Students successfully added to class!');

        window.location.reload();

    } catch (error) {
        console.error('❌ Failed to add students:', error);
        toast.error('Failed to add students to the class.');
    }
};

const filteredEditModalStudents = computed(() => {
    let result = [...students.value];

    if (editModalGenderFilter.value !== 'All') {
        const genderCode = editModalGenderFilter.value === 'Female' ? 'F' : 'M';
        result = result.filter((student) => student.gender === genderCode);
    }

    if (editModalSearchTerm.value.trim()) {
        const term = editModalSearchTerm.value.toLowerCase();
        result = result.filter(
            (student) =>
                student.fullName.toLowerCase().includes(term) ||
                student.lrn.includes(term) ||
                student.address.toLowerCase().includes(term)
        );
    }

    return result;
});

function toggleEditModalSelectAll() {
    if (editModalSelectAll.value) {
        // Use student.id instead of lrn
        editModalSelectedStudents.value = filteredEditModalStudents.value.map(s => s.id);
    } else {
        editModalSelectedStudents.value = [];
    }
}

async function handleUpdateClass(selectedCard) {
    const removedStudentIds = students.value
        .filter(s => !editModalSelectedStudents.value.includes(s.id))
        .map(s => s.id);

    if (!selectedCard?.Class_ID) {
        Swal.fire('Missing Class ID', 'Please select a valid class.', 'warning');
        return;
    }

    // Show Swal only if there are students to remove
    if (removedStudentIds.length > 0) {
        const result = await Swal.fire({
            title: 'Remove Students?',
            text: `You are about to remove ${removedStudentIds.length} students.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, remove them',
            cancelButtonText: 'Cancel'
        });

        if (!result.isConfirmed) return;

        const payload = {
            student_ids: removedStudentIds,
            class_id: selectedCard.Class_ID
        };

        console.log('📦 Sending removal payload:', payload);

        try {
            const response = await removeStudentToClass(payload);
            console.log('✅ Removed students response:', response);
            toast.success('Students removed successfully!');
        } catch (error) {
            console.error('❌ Error removing students:', error);
            toast.error('Failed to remove students from the class.');
            return;
        }
    }

    // Keep only selected students
    students.value = students.value.filter(s => editModalSelectedStudents.value.includes(s.id));

    // Reset modal state
    showEditModal.value = false;
    editModalSelectedStudents.value = [];
    editModalSelectAll.value = false;

    toast.success('Class updated successfully!');
    
}

function openEditModal() {
    showEditModal.value = true;
    // Again, use id
    editModalSelectedStudents.value = students.value.map(s => s.id);
    editModalSelectAll.value = true;
}
</script>

<style scoped>
.filters {
  display: flex;
  gap: 10px;
} 

.filter-dropdown {
  padding: 10px 15px;
  width: auto;
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

.student-list-container {
    background-color: white;
    padding: 24px;
    border-radius: 8px;
    box-shadow:
        0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.student-list-container>div {
    box-shadow: none !important;
    border: none !important;
}
</style>