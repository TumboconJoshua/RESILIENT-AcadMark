<template>
    <div class="flex flex-col gap-6 py-5 px-2 md:p-3 max-w-[100vw]">

        <div class="flex flex-row gap-10">
            <div class="w-1/3 p-3 border border-[#cecece] rounded-2xl bg-white shadow-lg">
                <div class="flex flex-col items-center gap-3">
                    <div class="w-50 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer"
                        @click="triggerImageUpload">
                        <img :src="teacherData.avatar || '/assets/img/profile/avatar.png'" alt="Profile Avatar"
                            class="w-full h-full object-cover rounded-full">
                        <input type="file" ref="fileInput" accept="image/*" class="hidden" @change="handleImageUpload">
                    </div>

                    <div class="text-center">
                        <h2 class="text-4xl font-semibold text-gray-800">{{ teacherData.firstName }} {{
                            teacherData.lastName }}</h2>
                        <p class="text-2xl font-semibold">{{ teacherData.position }}</p>
                    </div>
                </div>
            </div>

            <div class="flex-1 border border-[#cecece] rounded-2xl bg-white shadow-lg">
                <div>
                    <div>
                        <div class="flex items-center border-b border-[#E0E0E0]">
                            <label class="block text-xl font-medium text-[#292929] w-50 p-3">Full Name</label>
                            <p class="text-lg text-[#292929]">{{ teacherData.firstName }} {{ teacherData.middleName }}
                                {{ teacherData.lastName }}</p>
                        </div>
                        <div class="flex items-center border-b border-[#E0E0E0]">
                            <label class="block text-xl font-medium text-[#292929] w-50 p-3">Employee No</label>
                            <p class="text-lg text-[#292929]">{{ teacherData.employeeNo }}</p>
                        </div>
                        <div class="flex items-center border-b border-[#E0E0E0]">
                            <label class="block text-xl font-medium text-[#292929] w-50 p-3">Email</label>
                            <p class="text-lg text-[#292929]">{{ teacherData.email }}</p>
                        </div>
                        <div class="flex items-center border-b border-[#E0E0E0]">
                            <label class="block text-xl font-medium text-[#292929] w-50 p-3">Phone Number</label>
                            <p class="text-lg text-[#292929]">{{ teacherData.contactNumber }}</p>
                        </div>
                        <div class="flex items-center border-b border-[#E0E0E0]">
                            <label class="block text-xl font-medium text-[#292929] w-50 p-3">Address</label>
                            <p class="text-lg text-[#292929]">{{ teacherData.address }}</p>
                        </div>

                        <div class="flex justify-end">
                            <button @click="showEditModal = true"
                                class="px-13 rounded-sm text-white py-1 bg-blue my-5 mr-20 hover:bg-[#cecece] transition-colors duration-200 cursor-pointer">
                                Edit
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <div class="flex flex-col md:flex-row gap-10 mb-5">
            <div class="sm:full md:w-1/3 py-5 border border-[#cecece] rounded-2xl bg-white shadow-lg">
                <h3 class="text-xl px-3 font-semibold text-gray-800 mb-4 border-b border-[#E0E0E0] pb-3">Educational
                    Attainment
                </h3>
                <p class="text-gray-700 px-5">{{ teacherData.education }}</p>
            </div>

            <div class="flex-1 py-3 border border-[#cecece] rounded-2xl bg-white shadow-lg">
                <div class="flex justify-between items-center px-3 mb-4 border-b border-[#E0E0E0] pb-3">
                    <h3 class="text-xl font-semibold text-gray-800">Research Innovation</h3>
                    <button @click="showAddResearchModal = true"
                        class="bg-blue text-white px-4 py-2 rounded-md hover:bg-[#cecece] transition-colors duration-200 cursor-pointer">
                        Add Research
                    </button>
                </div>
                <div class="relative px-10">
                    <div class="overflow-hidden">
                        <div class="flex transition-transform duration-200 cursor-pointer ease-in-out"
                            :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
                            <div v-for="(research, index) in teacherData.research" :key="index"
                                class="w-full flex-shrink-0">
                                <div class="bg-gray-50 p-6 rounded-lg">
                                    <h4 class="text-xl font-semibold text-gray-800 mb-4">{{ research.title }}</h4>
                                    <p class="text-gray-600 leading-relaxed">{{ research.abstract }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button @click="prevSlide"
                        class="absolute left-0 top-1/2 transform -translate-y-1/2 cursor-pointer bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        :disabled="currentSlide === 0">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button @click="nextSlide"
                        class="absolute right-0 top-1/2 transform -translate-y-1/2 cursor-pointer bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        :disabled="currentSlide === (teacherData.research?.length - 1 || 0)">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    <div class="flex justify-center mt-6 gap-2">
                        <button v-for="(_, index) in teacherData.research" :key="index" @click="currentSlide = index"
                            class="w-3 h-3 rounded-full transition-colors"
                            :class="currentSlide === index ? 'bg-blue' : 'bg-gray-300'">
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div v-if="showEditModal" class="fixed inset-0 flex items-center justify-center z-50"
        style="background-color: rgba(0, 0, 0, 0.8);">
        <div class="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 class="text-2xl font-semibold mb-4">Edit Profile</h3>
            <form @submit.prevent="saveProfileChanges">
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="firstName">
                        First Name
                    </label>
                    <input v-model="editedProfile.firstName" type="text" id="firstName" required
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="middleName">
                        Middle Name
                    </label>
                    <input v-model="editedProfile.middleName" type="text" id="middleName"
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="lastName">
                        Last Name
                    </label>
                    <input v-model="editedProfile.lastName" type="text" id="lastName" required
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="employeeNo">
                        Employee No
                    </label>
                    <input v-model="editedProfile.employeeNo" type="text" id="employeeNo" required
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
                        Email
                    </label>
                    <input v-model="editedProfile.email" type="email" id="email" required
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="contactNumber">
                        Phone Number
                    </label>
                    <input v-model="editedProfile.contactNumber" type="text" id="contactNumber" required
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="address">
                        Address
                    </label>
                    <input v-model="editedProfile.address" type="text" id="address" required
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                </div>
                <div class="flex justify-end gap-2">
                    <button type="button" @click="showEditModal = false"
                        class="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-[#cecece] transition-colors duration-200 cursor-pointer">
                        Cancel
                    </button>
                    <button type="submit"
                        class="bg-blue text-white px-4 py-2 rounded-md hover:bg-[#cecece] transition-colors duration-200 cursor-pointer">
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    </div>

    <div v-if="showAddResearchModal" class="fixed inset-0 flex items-center justify-center z-50"
        style="background-color: rgba(0, 0, 0, 0.8);">
        <div class="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 class="text-2xl font-semibold mb-4">Add New Research</h3>
            <form @submit.prevent="saveNewResearch">
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="title">
                        Research Title
                    </label>
                    <input v-model="newResearch.title" type="text" id="title" required
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="abstract">
                        Abstract
                    </label>
                    <textarea v-model="newResearch.abstract" id="abstract" required rows="4"
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
                </div>
                <div class="flex justify-end gap-2">
                    <button type="button" @click="showAddResearchModal = false"
                        class="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-[#cecece] transition-colors duration-200 cursor-pointer">
                        Cancel
                    </button>
                    <button type="submit"
                        class="bg-blue text-white px-4 py-2 rounded-md hover:bg-[#cecece] transition-colors duration-200 cursor-pointer">
                        Save
                    </button>
                </div>
            </form>
        </div>
    </div>

</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import teachersData from '@/data/teachers.json';

defineEmits(['loggedIn']);

const fileInput = ref(null);
const teacherData = ref({
    research: [],
    avatar: null
});
const currentSlide = ref(0);
const showAddResearchModal = ref(false);
const showEditModal = ref(false);
const newResearch = ref({
    title: '',
    abstract: ''
});
const editedProfile = ref({
    firstName: '',
    middleName: '',
    lastName: '',
    employeeNo: '',
    email: '',
    contactNumber: '',
    address: ''
});

const nextSlide = () => {
    if (teacherData.value.research && currentSlide.value < teacherData.value.research.length - 1) {
        currentSlide.value++;
    }
};

const prevSlide = () => {
    if (currentSlide.value > 0) {
        currentSlide.value--;
    }
};

const saveNewResearch = () => {
    const teacherID = localStorage.getItem('teacherID');
    let teachers = JSON.parse(localStorage.getItem('teachers') || '[]');

    if (teachers.length === 0) {
        teachers = teachersData.teachers;
    }

    const teacherIndex = teachers.findIndex(teacher => teacher.teacher_ID === teacherID);

    if (teacherIndex !== -1) {
        if (!teachers[teacherIndex].research) {
            teachers[teacherIndex].research = [];
        }

        teachers[teacherIndex].research.push({
            title: newResearch.value.title,
            abstract: newResearch.value.abstract
        });

        localStorage.setItem('teachers', JSON.stringify(teachers));
        teacherData.value = teachers[teacherIndex];
        newResearch.value = {
            title: '',
            abstract: ''
        };
        showAddResearchModal.value = false;
        currentSlide.value = teacherData.value.research.length - 1;
    }
};

const initializeEditProfile = () => {
    editedProfile.value = {
        firstName: teacherData.value.firstName || '',
        middleName: teacherData.value.middleName || '',
        lastName: teacherData.value.lastName || '',
        employeeNo: teacherData.value.employeeNo || '',
        email: teacherData.value.email || '',
        contactNumber: teacherData.value.contactNumber || '',
        address: teacherData.value.address || ''
    };
};

const saveProfileChanges = () => {
    const teacherID = localStorage.getItem('teacherID');
    let teachers = JSON.parse(localStorage.getItem('teachers') || '[]');

    if (teachers.length === 0) {
        teachers = teachersData.teachers;
    }

    const teacherIndex = teachers.findIndex(teacher => teacher.teacher_ID === teacherID);

    if (teacherIndex !== -1) {
        teachers[teacherIndex] = {
            ...teachers[teacherIndex],
            firstName: editedProfile.value.firstName,
            middleName: editedProfile.value.middleName,
            lastName: editedProfile.value.lastName,
            employeeNo: editedProfile.value.employeeNo,
            email: editedProfile.value.email,
            contactNumber: editedProfile.value.contactNumber,
            address: editedProfile.value.address
        };

        localStorage.setItem('teachers', JSON.stringify(teachers));
        teacherData.value = teachers[teacherIndex];
        showEditModal.value = false;
    }
};

const triggerImageUpload = () => {
    fileInput.value.click();
};

const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const teacherID = localStorage.getItem('teacherID');
            let teachers = JSON.parse(localStorage.getItem('teachers') || '[]');

            if (teachers.length === 0) {
                teachers = teachersData.teachers;
            }

            const teacherIndex = teachers.findIndex(teacher => teacher.teacher_ID === teacherID);

            if (teacherIndex !== -1) {
                teachers[teacherIndex].avatar = e.target.result;
                localStorage.setItem('teachers', JSON.stringify(teachers));
                teacherData.value = teachers[teacherIndex];
                const currentTeachers = JSON.parse(localStorage.getItem('teachers') || '[]');
                localStorage.setItem('teachers', JSON.stringify(currentTeachers));
                window.dispatchEvent(new CustomEvent('avatarUpdated'));
            }
        };
        reader.readAsDataURL(file);
    }
};

watch(showEditModal, (newValue) => {
    if (newValue) {
        initializeEditProfile();
    }
});

onMounted(() => {
    try {
        const storedUserData = localStorage.getItem('user');
        const userData = JSON.parse(storedUserData || '{}');

        if (!userData || !userData.teacher_ID) {
            console.error('No valid user data found in localStorage');
            return;
        }

        teacherData.value = {
            ...userData,
            research: userData.research || [],
            avatar: userData.avatar || null
        };

        currentSlide.value = 0;
    } catch (error) {
        console.error('Error loading teacher data:', error);
        console.error('Error details:', error.message);
    }
});
</script>
