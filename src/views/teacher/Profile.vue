<template>
    <div class="flex flex-col gap-6 py-5 px-2 md:p-3 max-w-[100vw]">

        <div class="flex flex-row gap-10">
            <div class="w-1/3 p-3 border border-[#cecece] rounded-2xl bg-white shadow-lg">
                <div class="flex flex-col items-center gap-3">
                    <div class="w-50 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer"
                        @click="triggerImageUpload"
                        style="width: 150px; height: 150px; border-radius: 50%; overflow: hidden; margin-top: 2rem;">
                        <img :src="teacherData.avatar || '/assets/img/profile/avatar.png'" alt="Profile Avatar"
                            class="w-full h-full object-cover">
                        <input type="file" ref="fileInput" accept="image/*" class="hidden" @change="handleImageUpload">
                    </div>

                    <div class="text-center">
                        <h2 class="text-4xl font-semibold text-gray-800">{{ teacherData.firstName }}
                            {{ teacherData.middleName }} {{
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
            <div class="sm:full md:w-1/2 py-5 border border-[#cecece] rounded-2xl bg-white shadow-lg">
                <div class="border-b border-[#E0E0E0] p-5 flex justify-between items-center">
                    <h3 class="text-xl px-3 font-medium text-gray-800">Lesson Plan</h3>
                    <div class="flex gap-2">
                        <img class="bg-blue p-1 cursor-pointer" src="/assets/img/profile/add.svg" alt="Add Lesson Plan"
                            @click="showAddLessonPlanModal = true">
                        <img class="bg-red p-1 cursor-pointer" src="/assets/img/profile/remove.svg"
                            alt="Remove Lesson Plan" @click="removeSelectedLessonPlan">
                    </div>
                </div>

                <div v-for="(plan, index) in lessonPlans" :key="index"
                    class="p-5 border-b border-[#E0E0E0] cursor-pointer" @click="openEditModal(plan)">
                    <div class="flex items-start gap-4">
                        <div class="flex items-center gap-4 w-1/3">
                            <input type="checkbox" :checked="selectedLessonPlan.includes(index)"
                                @click.stop="toggleLessonPlanSelection(index)"
                                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                            <div class="pt-2">
                                <p class="font-semibold">Lesson Plan {{ plan.lessonPlanNo }}</p>
                                <p class="text-sm text-gray-500">{{ plan.gradeLevel }} - {{ plan.section }}</p>
                            </div>
                        </div>
                        <div class="w-1/3">
                            <p class="font-semibold mt-1">{{ plan.category }}</p>
                        </div>
                        <div class="w-1/3 flex justify-items-center ">
                            <div class="pt-1">
                                <span :class="{
                                    'text-orange': plan.status === 'Pending',
                                    'text-red-500': plan.status === 'Declined',
                                    'text-green-500': plan.status === 'Approved'
                                }">
                                    {{ plan.status }}
                                </span>
                            </div>
                        </div>
                    </div>
                    <a :href="plan.link" target="_blank" class="text-blue-600 hover:underline mt-2 block ml-8">
                        View Lesson Plan
                    </a>
                </div>
            </div>

            <div class="md:w-1/2 py-3 border border-[#cecece] rounded-2xl bg-white shadow-lg">
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
                                    <div class="flex justify-between items-center">
                                        <h4 class="text-xl font-semibold text-gray-800 mb-4">{{ research.Title }}</h4>
                                        <button @click.stop="deleteResearch(research.Research_ID)"
                                            class="text-red-500 hover:text-red-700 cursor-pointer transition-colors duration-200 p-1 rounded hover:bg-red-50">
                                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                    <p class="text-gray-600 leading-relaxed">{{ research.Abstract }}</p>
                                    <p class="text-sm text-gray-500 mt-2">Submitted: {{ formatDate(research.created_at)
                                        }}</p>
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
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="Title">
                        Research Title
                    </label>
                    <input v-model="newResearch.Title" type="text" id="title" required
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="Abstract">
                        Abstract
                    </label>
                    <textarea v-model="newResearch.Abstract" id="abstract" required rows="4"
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

    <div v-if="showAddLessonPlanModal" class="fixed inset-0 flex items-center justify-center z-50"
        style="background-color: rgba(0, 0, 0, 0.8);">
        <div class="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 class="text-2xl font-semibold mb-4">Add Lesson Plan</h3>
            <form @submit.prevent="saveNewLessonPlan">
                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div class="relative">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="lessonPlanNo">
                            Lesson Plan No.
                        </label>
                        <input v-model="newLessonPlan.lessonPlanNo" type="text" id="lessonPlanNo" required readonly
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-100 leading-tight focus:outline-none focus:shadow-outline cursor-not-allowed">
                    </div>
                    <div class="relative">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="category">
                            Category
                        </label>
                        <input v-model="newLessonPlan.category" type="text" id="category" required
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div class="relative">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="gradeLevel">
                            Grade Level
                        </label>
                        <div class="relative">
                            <select v-model="newLessonPlan.gradeLevel" id="gradeLevel" required
                                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-8">
                                <option v-for="grade in gradeLevels" :key="grade" :value="grade">{{ grade }}</option>
                            </select>
                            <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" stroke-width="2"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div class="relative">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="section">
                            Section
                        </label>
                        <input v-model="newLessonPlan.section" type="text" id="section" required
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                    </div>
                </div>

                <div class="relative mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="lessonPlanLink">
                        Lesson Plan Link
                    </label>
                    <input v-model="newLessonPlan.link" type="url" id="lessonPlanLink" required
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                </div>

                <div class="flex justify-end gap-2">
                    <button type="button" @click="showAddLessonPlanModal = false"
                        class="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-[#cecece] transition-colors duration-200 cursor-pointer">
                        Cancel
                    </button>
                    <button type="submit"
                        class="bg-blue text-white px-4 py-2 rounded-md hover:bg-[#cecece] transition-colors duration-200 cursor-pointer">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    </div>

    <div v-if="showEditLessonPlanModal" class="fixed inset-0 flex items-center justify-center z-50"
        style="background-color: rgba(0, 0, 0, 0.8);">
        <div class="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 class="text-2xl font-semibold mb-4">Edit Lesson Plan</h3>
            <form @submit.prevent="saveEditedLessonPlan">
                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div class="relative">
                        <label class="block text-gray-700 text-sm font-bold mb-2">Lesson Plan No.</label>
                        <input v-model="editingLessonPlan.lessonPlanNo" type="text" required pattern="[0-9]*"
                            oninput="this.value = this.value.replace(/[^0-9]/g, '');"
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                    </div>
                    <div class="relative">
                        <label class="block text-gray-700 text-sm font-bold mb-2">Category</label>
                        <input v-model="editingLessonPlan.category" type="text" required
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div class="relative">
                        <label class="block text-gray-700 text-sm font-bold mb-2">Grade Level</label>
                        <select v-model="editingLessonPlan.gradeLevel" required
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-8">
                            <option v-for="grade in gradeLevels" :key="grade" :value="grade">
                                {{ grade }}
                            </option>
                        </select>
                    </div>
                    <div class="relative">
                        <label class="block text-gray-700 text-sm font-bold mb-2">Section</label>
                        <input v-model="editingLessonPlan.section" type="text" required
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                    </div>
                </div>

                <div class="relative mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2">Lesson Plan Link</label>
                    <input v-model="editingLessonPlan.link" type="url" required
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                </div>

                <div class="flex justify-end gap-2">
                    <button type="button" @click="showEditLessonPlanModal = false"
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

    <div v-if="showDeleteConfirmation" class="fixed inset-0 flex items-center justify-center z-50"
        style="background-color: rgba(0, 0, 0, 0.8);">
        <div class="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 class="text-2xl font-semibold mb-4">Confirm Delete</h3>
            <p class="mb-6">Are you sure you want to delete this research?</p>
            <div class="flex justify-end gap-3">
                <button @click="showDeleteConfirmation = false"
                    class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 cursor-pointer">
                    Cancel
                </button>
                <button @click="confirmDelete"
                    class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200 cursor-pointer">
                    Delete
                </button>
            </div>
        </div>
    </div>

    <div v-if="showDeleteLessonPlanConfirmation" class="fixed inset-0 flex items-center justify-center z-50"
        style="background-color: rgba(0, 0, 0, 0.8);">
        <div class="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 class="text-2xl font-semibold mb-4">Confirm Delete</h3>
            <p class="mb-6">Are you sure you want to delete this lesson plan?</p>
            <div class="flex justify-end gap-3">
                <button @click="showDeleteLessonPlanConfirmation = false"
                    class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 cursor-pointer">
                    Cancel
                </button>
                <button @click="confirmDeleteLessonPlan"
                    class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200 cursor-pointer">
                    Delete
                </button>
            </div>
        </div>
    </div>

    <div v-if="showApprovedLessonPlanModal" class="fixed inset-0 flex items-center justify-center z-50"
        style="background-color: rgba(0, 0, 0, 0.8);">
        <div class="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 class="text-2xl font-semibold mb-4">Approved Lesson Plan</h3>
            <form @submit.prevent="() => showApprovedLessonPlanModal = false">
                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div class="relative">
                        <label class="block text-gray-700 text-sm font-bold mb-2">Lesson Plan No.</label>
                        <input v-model="approvedLessonPlan.lessonPlanNo" type="text" readonly
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-100 leading-tight focus:outline-none focus:shadow-outline">
                    </div>
                    <div class="relative">
                        <label class="block text-gray-700 text-sm font-bold mb-2">Category</label>
                        <input v-model="approvedLessonPlan.category" type="text" readonly
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-100 leading-tight focus:outline-none focus:shadow-outline">
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div class="relative">
                        <label class="block text-gray-700 text-sm font-bold mb-2">Grade Level</label>
                        <input v-model="approvedLessonPlan.gradeLevel" type="text" readonly
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-100 leading-tight focus:outline-none focus:shadow-outline">
                    </div>
                    <div class="relative">
                        <label class="block text-gray-700 text-sm font-bold mb-2">Section</label>
                        <input v-model="approvedLessonPlan.section" type="text" readonly
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-100 leading-tight focus:outline-none focus:shadow-outline">
                    </div>
                </div>

                <div class="relative mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2">Lesson Plan Link</label>
                    <input v-model="approvedLessonPlan.link" type="url" readonly
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-100 leading-tight focus:outline-none focus:shadow-outline">
                </div>

                <div class="relative mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2">Comments</label>
                    <textarea v-model="approvedLessonPlan.comments" rows="4" readonly
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-100 leading-tight focus:outline-none focus:shadow-outline"></textarea>
                </div>

                <div class="flex justify-end gap-2">
                    <button type="button" @click="showApprovedLessonPlanModal = false"
                        class="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-[#cecece] transition-colors duration-200 cursor-pointer">
                        Close
                    </button>
                </div>
            </form>
        </div>
    </div>

</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import {
    getProfile,
    updateProfile,
    updateAvatar,
    addResearch,
    deleteResearchById,
    getLessonPlans,
    addLessonPlan,
    updateLessonPlan,
    deleteLessonPlan
} from '@/service/profileService';

const emit = defineEmits(['logged-in']);
const fileInput = ref(null);
const teacherData = ref({
    research: [],
    avatar: null
});
const currentSlide = ref(0);
const showAddResearchModal = ref(false);
const showEditModal = ref(false);
const newResearch = ref({
    Title: '',
    Abstract: ''
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
const showAddLessonPlanModal = ref(false);
const newLessonPlan = ref({
    lessonPlanNo: '',
    category: '',
    gradeLevel: '',
    section: '',
    link: '',
    status: 'Pending'
});
const lessonPlans = ref([]);
const gradeLevels = ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];
const selectedLessonPlan = ref([]);
const showEditLessonPlanModal = ref(false);
const editingLessonPlan = ref(null);
const showDeleteConfirmation = ref(false);
const researchToDelete = ref(null);
const showDeleteLessonPlanConfirmation = ref(false);
const showApprovedLessonPlanModal = ref(false);
const approvedLessonPlan = ref(null);

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

const saveNewResearch = async () => {
    try {
        const response = await addResearch(newResearch.value);

        // Replace the manual unshift with proper refresh
        const profileResponse = await getProfile();
        teacherData.value.research = profileResponse.teacher.research || [];

        showAddResearchModal.value = false;
        newResearch.value = { Title: '', Abstract: '' };
        currentSlide.value = 0;
    } catch (error) {
        console.error('Error adding research:', error);
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

const saveProfileChanges = async () => {
    try {
        const updatedData = await updateProfile(editedProfile.value);
        teacherData.value = { ...teacherData.value, ...updatedData };
        showEditModal.value = false;
    } catch (error) {
        console.error('Error updating profile:', error);
    }
};

const triggerImageUpload = () => {
    fileInput.value.click();
};

const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
        try {
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64Image = e.target.result;
                localStorage.setItem('teacherAvatar', base64Image);
                teacherData.value.avatar = base64Image;
                // Emit a custom event globally
                window.dispatchEvent(new CustomEvent('avatar-updated', { detail: base64Image }));
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('Error updating avatar:', error);
        }
    }
};

const saveNewLessonPlan = async () => {
    try {
        await addLessonPlan({
            ...newLessonPlan.value,
            gradeLevel: newLessonPlan.value.gradeLevel,
            section: newLessonPlan.value.section
        });

        // Refresh the lesson plans list
        const lessonRes = await getLessonPlans();
        lessonPlans.value = lessonRes.map(lp => ({
            ...lp,
            lessonPlanNo: lp.lesson_plan_no,
            gradeLevel: lp.grade_level,
            section: lp.section
        }));

        newLessonPlan.value = {
            lessonPlanNo: '',
            category: '',
            gradeLevel: '',
            section: '',
            link: '',
            status: 'Pending'
        };
        showAddLessonPlanModal.value = false;
    } catch (error) {
        console.error('Error saving lesson plan:', error);
        alert('Failed to save lesson plan: ' + error.message);
    }
};

const removeSelectedLessonPlan = () => {
    if (selectedLessonPlan.value.length > 0) {
        showDeleteLessonPlanConfirmation.value = true;
    } else {
        alert('No lesson plan selected.');
    }
};

const confirmDeleteLessonPlan = async () => {
    try {
        await Promise.all(selectedLessonPlan.value.map(index =>
            deleteLessonPlan(lessonPlans.value[index].LessonPlan_ID)
        ));

        lessonPlans.value = lessonPlans.value.filter((_, index) =>
            !selectedLessonPlan.value.includes(index)
        );
        selectedLessonPlan.value = [];
    } catch (error) {
        console.error('Error deleting lesson plans:', error);
        alert('Failed to delete lesson plans: ' + error.message);
    }
    showDeleteLessonPlanConfirmation.value = false;
};

const openEditModal = (plan) => {
    if (plan.status === 'Approved') {
        approvedLessonPlan.value = { ...plan };
        showApprovedLessonPlanModal.value = true;
    } else {
        editingLessonPlan.value = { ...plan };
        showEditLessonPlanModal.value = true;
    }
};

const saveEditedLessonPlan = async () => {
    try {
        console.log('Editing ID:', editingLessonPlan.value.LessonPlan_ID);

        // Always include all fields
        const payload = {
            lesson_plan_no: editingLessonPlan.value.lessonPlanNo.toString(), // Ensure string
            category: editingLessonPlan.value.category,
            grade_level: editingLessonPlan.value.gradeLevel,
            section: editingLessonPlan.value.section,
            link: editingLessonPlan.value.link
        };

        console.log('Update Payload:', payload);

        const updated = await updateLessonPlan(
            editingLessonPlan.value.LessonPlan_ID,
            payload
        );

        // Update the lessonPlans array reactively
        const index = lessonPlans.value.findIndex(
            p => p.LessonPlan_ID === updated.LessonPlan_ID
        );

        if (index !== -1) {
            lessonPlans.value[index] = {
                ...updated,
                lessonPlanNo: updated.lesson_plan_no, // Map backend fields to frontend
                gradeLevel: updated.grade_level,
                section: updated.section
            };
        }

        showEditLessonPlanModal.value = false;
    } catch (error) {
        console.error('Full Error:', error);
    }
};

const deleteResearch = (researchId) => {
    researchToDelete.value = researchId;
    showDeleteConfirmation.value = true;
};

const confirmDelete = async () => {
    try {
        await deleteResearchById(researchToDelete.value);
        const profileResponse = await getProfile();
        teacherData.value.research = profileResponse.teacher.research || [];

        if (currentSlide.value >= teacherData.value.research.length) {
            currentSlide.value = Math.max(0, teacherData.value.research.length - 1);
        }
    } catch (error) {
        console.error('Error deleting research:', error);
        alert('Failed to delete research: ' + error.response?.data?.message || error.message);
    } finally {
        showDeleteConfirmation.value = false;
        researchToDelete.value = null;
    }
};

watch(showEditModal, (newValue) => {
    if (newValue) {
        initializeEditProfile();
    }
});

onMounted(async () => {
    try {
        // Check if there's an avatar in localStorage
        const savedAvatar = localStorage.getItem('teacherAvatar');
        if (savedAvatar) {
            teacherData.value.avatar = savedAvatar;
        }

        const [profileRes, lessonRes] = await Promise.all([
            getProfile(),
            getLessonPlans()
        ]);

        teacherData.value = {
            ...profileRes.teacher,
            research: profileRes.teacher.research || [],
            avatar: savedAvatar || profileRes.teacher.avatar || '/assets/img/profile/avatar.png'
        };

        lessonPlans.value = lessonRes.map(lp => ({
            ...lp,
            lessonPlanNo: lp.lesson_plan_no,
            gradeLevel: lp.grade_level,
            section: lp.section
        }));
    } catch (error) {
        console.error('Initialization error:', error);
        teacherData.value = createDefaultProfile();
        alert('Failed to load data: ' + error.message);
    }
});

const createDefaultProfile = () => ({
    firstName: '',
    lastName: '',
    middleName: '',
    employeeNo: '',
    email: '',
    contactNumber: '',
    address: '',
    avatar: '/assets/img/profile/avatar.png',
    research: [],
    position: ''
});

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

const toggleLessonPlanSelection = (index) => {
    const currentIndex = selectedLessonPlan.value.indexOf(index);
    if (currentIndex === -1) {
        selectedLessonPlan.value.push(index);
    } else {
        selectedLessonPlan.value.splice(currentIndex, 1);
    }
};

const saveApprovedLessonPlan = () => {
    // Implementation of saving the approved lesson plan
    showApprovedLessonPlanModal.value = false;
};

watch(() => localStorage.getItem('teacherAvatar'), () => {
    updateImageFromStorage(); // This should update the avatar in the sidebar
});

const generateLessonPlanNumber = () => {
    // If there are no lesson plans, start with 1
    if (lessonPlans.value.length === 0) {
        return '1';
    }

    // Find the highest lesson plan number and increment it
    const highestNumber = Math.max(...lessonPlans.value.map(plan =>
        parseInt(plan.lessonPlanNo) || 0
    ));

    return (highestNumber + 1).toString();
};

watch(showAddLessonPlanModal, (newValue) => {
    if (newValue) {
        newLessonPlan.value.lessonPlanNo = generateLessonPlanNumber();
    }
});
</script>
