<template>
    <div class="flex flex-col overflow-hidden">
        <template v-if="!showBlank && !showGrade7Detail">
            <h1 class="text-5xl font-bold text-[#242424]">Manage Class</h1>

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
                <!-- ===================== Tab Navigation ===================== -->
                <div class="flex justify-between p-8 rounded-t-xl" style="box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;">
                    <div v-for="tab in [
                        { label: 'Add Classes', value: 'add' },
                        { label: 'Submitted', value: 'submitted' }
                    ]" :key="tab.value" class="w-[48%] cursor-pointer"
                        :class="activeTab === tab.value ? 'border-blue border-b-2' : ''" @click="setTab(tab.value)">
                        <p class="text-center pb-2 font-semibold text-lg"
                            :class="activeTab === tab.value ? 'text-blue' : ''">
                            {{ tab.label }}
                        </p>
                    </div>
                </div>

                <div v-if="activeTab === 'add'" class="grid md:grid-cols-4  sm:grid-cols-3 gap-8 my-8">
                    <div v-for="(grade, idx) in grades" :key="grade.mainTitle"
                        class="bg-white rounded-[12px] shadow-[0_4px_24px_rgba(0,0,0,0.1)] border border-[#e0e0e0] flex flex-col min-w-[300px] max-w-[360px] min-h-[180px] relative overflow-hidden">
                        <div class="flex flex-row justify-between items-start px-5 pt-6">
                            <div class="flex-1">
                                <div class="text-[35.2px] font-bold text-[#295F98] mb-1">
                                    {{ grade.mainTitle }}
                                </div>
                                <div class="text-[17.6px] text-[#295F98] mb-0.5">
                                    {{ grade.subTitle }}
                                </div>
                                <div class="text-base text-[#295F98] font-normal italic">
                                    {{ grade.studentCount }}
                                </div>
                            </div>
                            <div
                                class="absolute top-[15px] right-[-55px] flex items-start justify-end pointer-events-none z-0">
                                <img src="/assets/img/logo.png" alt="School Logo"
                                    class="w-[190px] h-[190px] object-contain opacity-50 pointer-events-none" />
                            </div>
                        </div>

                        <div
                            class="bg-[#295F98] rounded-b-[12px] flex justify-between items-center px-5 py-3 mt-[18px] z-10">
                            <span class="text-white font-semibold text-base">Manage Class</span>
                            <button
                                class="bg-[#295F98] text-white border border-white rounded-lg px-6 py-1.5 text-base font-medium cursor-pointer transition-colors duration-200 hover:bg-white hover:text-[#295F98] hover:border-white"
                                @click="handleEnter(idx)">
                                Enter
                            </button>
                        </div>
                    </div>
                </div>

                <div v-else class="submitted-section">
                    <!-- Filter Bar -->
                    <div
                        class="flex flex-row gap-4 items-center bg-white p-6 border border-[#EEEEEE] rounded-[5px] shadow mb-6">
                        <select v-model="selectedSubmittedGrade"
                            class="w-[180px] p-2 border border-[#E3E9EC] rounded-[6px] bg-white text-base text-[#242424] font-medium">
                            <option value="" disabled>Select Grade</option>
                            <option v-for="option in gradeOptions" :key="option.value || option"
                                :value="option.value || option">
                                {{ option.label || option }}
                            </option>
                        </select>
                        <select v-model="selectedSubmittedCurriculum"
                            class="w-[180px] p-2 border border-[#E3E9EC] rounded-[6px] bg-white text-base text-[#242424] font-medium">
                            <option value="" disabled>Select Curriculum</option>
                            <option v-for="option in curriculumOptions" :key="option.value || option"
                                :value="option.value || option">
                                {{ option.label || option }}
                            </option>
                        </select>
                        <select v-model="selectedSubmittedTrack"
                            class="w-[180px] p-2 border border-[#E3E9EC] rounded-[6px] bg-white text-base text-[#242424] font-medium">
                            <option value="" disabled>Select Track</option>
                            <option v-for="option in trackOptions" :key="option.value || option"
                                :value="option.value || option">
                                {{ option.label || option }}
                            </option>
                        </select>
                        <select v-model="selectedSubmittedStatus"
                            class="w-[180px] p-2 border border-[#E3E9EC] rounded-[6px] bg-white text-base text-[#242424] font-medium">
                            <option value="" disabled>Select Status</option>
                            <option v-for="option in statusOptions" :key="option.value || option"
                                :value="option.value || option">
                                {{ option.label || option }}
                            </option>
                        </select>
                        <div
                            class="flex items-center bg-[#fafbfc] border border-[#e0e0e0] rounded-[6px] px-2 h-10 w-1/4">
                            <img src="/assets/img/search-icon.svg" alt="search" class="w-5 h-5 mx-1 opacity-70" />
                            <input type="text" v-model="rightSearch" placeholder="Search..."
                                class="bg-transparent border-none outline-none w-full text-[15px] text-gray-700" />
                        </div>
                    </div>

                    <!-- Table -->
                    <div class="bg-white rounded-lg shadow border border-gray-200 overflow-x-auto mb-4">
                        <table class="min-w-[900px] w-full border-collapse table-fixed">
                            <thead>
                                <tr>
                                    <th
                                        class="bg-[#f6f6f6] font-semibold text-[#222] text-[16px] text-center px-3 py-2">
                                        Grade Level</th>
                                    <th
                                        class="bg-[#f6f6f6] font-semibold text-[#222] text-[16px] text-center px-3 py-2">
                                        Curriculum</th>
                                    <th
                                        class="bg-[#f6f6f6] font-semibold text-[#222] text-[16px] text-center px-3 py-2">
                                        Track</th>
                                    <th
                                        class="bg-[#f6f6f6] font-semibold text-[#222] text-[16px] text-center px-3 py-2">
                                        Class Section</th>
                                    <th
                                        class="bg-[#f6f6f6] font-semibold text-[#222] text-[16px] text-center px-3 py-2">
                                        Class Adviser</th>
                                    <th
                                        class="bg-[#f6f6f6] font-semibold text-[#222] text-[16px] text-center px-3 py-2">
                                        Student Added</th>
                                    <th
                                        class="bg-[#f6f6f6] font-semibold text-[#222] text-[16px] text-center px-3 py-2">
                                        Date Added</th>
                                    <th
                                        class="bg-[#f6f6f6] font-semibold text-[#222] text-[16px] text-center px-3 py-2">
                                        STATUS</th>
                                </tr>
                            </thead>
                        </table>
                        <div class="max-h-[400px] overflow-y-auto w-full">
                            <table class="min-w-[900px] w-full border-collapse table-fixed">
                                <tbody>
                                    <tr v-for="(row, idx) in paginatedSuperClasses" :key="idx"
                                        class="border-b border-[#e0e0e0] cursor-pointer"
                                        @click="openClassInfoModal(row)">
                                        <td class="text-[14px] text-center px-3 py-2 text-[#222]">{{ row.grade }}</td>
                                        <td class="text-[14px] text-center px-3 py-2 text-[#222]">{{ row.curriculum }}
                                        </td>
                                        <td class="text-[14px] text-center px-3 py-2 text-[#222]">{{ row.track }}</td>
                                        <td class="text-[14px] text-center px-3 py-2 text-[#222]">{{ row.section }}</td>
                                        <td class="text-[14px] text-center px-3 py-2 text-[#222]">{{ row.adviser }}</td>
                                        <td class="text-[14px] text-center px-3 py-2 text-[#222]">
                                            {{ row.students }}
                                        </td>
                                        <td class="text-[14px] text-center px-3 py-2 text-[#222]">{{ row.date }}</td>
                                        <td class="text-[14px] text-center px-3 py-2">
                                            <span :class="[
                                                'inline-block min-w-[90px] text-center py-1 rounded-lg text-[12px] text-white',
                                                row.status === 'Pending' ? 'bg-[#ff9800]' : '',
                                                row.status === 'Accepted' ? 'bg-[#4caf50]' : '',
                                                row.status === 'Not Accepted' ? 'bg-[#f44336]' : ''
                                            ]">
                                                {{ row.status }}
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <!-- Pagination Controls for Submitted Classes -->
                    <div class="flex justify-between items-center mt-4 px-4">
                        <div class="text-sm text-gray-600">
                            Showing {{ paginatedSuperClasses.length }} of {{ superClasses.length }} entries
                        </div>
                        <div class="flex gap-2">
                            <button @click="submittedCurrentPage--" :disabled="submittedCurrentPage === 1"
                                class="px-3 py-1 rounded border border-gray-300 disabled:opacity-50">
                                Previous
                            </button>
                            <button v-for="page in submittedTotalPages" :key="page" @click="submittedCurrentPage = page"
                                :class="[
                                    'px-3 py-1 rounded border',
                                    submittedCurrentPage === page
                                        ? 'bg-blue-500 text-white border-blue-500'
                                        : 'border-gray-300 hover:bg-gray-100'
                                ]">
                                {{ page }}
                            </button>
                            <button @click="submittedCurrentPage++"
                                :disabled="submittedCurrentPage === submittedTotalPages"
                                class="px-3 py-1 rounded border border-gray-300 disabled:opacity-50">
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <template v-else-if="showGrade7Detail">
            <div class="min-h-[400px]">
                <span class="text-black text-2xl font-semibold mb-8 cursor-pointer hover:text-blue-500"
                    @click="backFromDetail">
                    &lt; <span class="underline hover:underline">Back</span>
                </span>
                <div class="mt-6">
                    <div
                        class="flex gap-6 mb-6 bg-white p-[30px] border border-[#EEEEEE] rounded-[5px] shadow-[0_2px_8px_0_rgba(0,0,0,0.07)]">
                        <div class="min-w-[200px] relative flex flex-col justify-end">
                            <label
                                class="absolute -top-2 left-4 bg-white text-[#292929] text-sm px-2 pointer-events-none font-medium">Grade
                                Level</label>
                            <div
                                class="font-bold text-base text-[#242424] border border-[#E3E9EC] rounded-[6px] p-2 bg-white">
                                {{ enteredGrade }}
                            </div>
                        </div>
                        <div class="min-w-[200px] relative flex flex-col justify-end">
                            <label
                                class="absolute -top-2 left-4 bg-white text-[#292929] text-sm px-2 pointer-events-none font-medium">Curriculum</label>
                            <div
                                class="font-bold text-base text-[#242424] border border-[#E3E9EC] rounded-[6px] p-2 bg-white">
                                {{ enteredCurriculum }}
                            </div>
                        </div>
                        <div class="min-w-[200px] relative flex flex-col justify-end">
                            <label
                                class="absolute -top-2 left-4 bg-white text-[#292929] text-sm px-2 pointer-events-none font-medium">Section
                                Name</label>
                            <select v-model="selectedClassSection"
                                class="w-[180px] p-2 border border-[#E3E9EC] rounded-[6px] bg-white text-base text-[#242424] font-medium">
                                <option disabled value="">Select Section</option>
                                <option v-for="cls in filteredClassesByGrade" :key="cls.Class_ID" :value="cls">
                                    {{ cls.Section }}
                                </option>
                            </select>
                        </div>
                        <div class="min-w-[200px] relative flex flex-col justify-end"
                            v-if="selectedClass && selectedClass.Track">
                            <label
                                class="absolute -top-2 left-4 bg-white text-[#292929] text-sm px-2 pointer-events-none font-medium">
                                Track
                            </label>
                            <select v-model="selectedTrack" disabled
                                class="w-[180px] p-2 border border-[#E3E9EC] rounded-[6px] bg-white text-base text-[#242424] font-medium">
                                <option :value="selectedClass.Track">{{ selectedClass.Track }}</option>
                            </select>
                        </div>
                        <div class="flex items-end ml-auto">
                            <button @click="openAddTeacherModal" :class="[
                                'text-white text-base font-normal border-none rounded-[6px] px-[25px] py-[10px] cursor-pointer transition-colors duration-200',
                                form.teacher_subject_ids.length === 0 ? 'bg-[#295F98] hover:bg-[#1d4066]' : 'bg-green-600 hover:bg-green-700'
                            ]">
                                {{ teacherButtonLabel }}
                            </button>
                        </div>
                    </div>
                    <div class="min-h-[200px] bg-[#f9f9f9] rounded-[8px] mt-8">
                        <div class="flex gap-6 mb-5">
                            <!-- Left Column -->
                            <div
                                class="bg-white rounded-[8px] border border-[#e0e0e0] w-[410px] min-w-[280px] flex flex-col p-3">
                                <div class="mb-2">
                                    <select v-model="leftSex"
                                        class="w-[35%] p-[6px_10px] border border-[#e0e0e0] rounded-[6px] text-[15px] text-[#242424] bg-white">
                                        <option value="" disabled selected>Sex</option>
                                        <option value="F">Female</option>
                                        <option value="M">Male</option>
                                    </select>
                                </div>
                                <div
                                    class="flex flex-col overflow-y-auto max-h-[600px] mb-3 rounded-[4px] border border-[#e0e0e0] bg-[#fafbfc] p-1 cursor-pointer gap-5s">
                                    <div v-for="row in leftSelectedStudents" :key="row.lrn"
                                        class="flex items-center p-[6px_8px] border-b border-[#f0f0f0] text-sm text-[#222] gap-10 hover:bg-[#e0e0e0]">
                                        <span class="ml-[5px] w-[90px] font-medium">{{ row.lrn }}</span>
                                        <span class="flex-1 -ml-[5px] font-medium">{{ row.name }}</span>
                                        <img src="/assets/img/admin/arrow.svg" alt="right-arrow"
                                            class="w-5 h-5 cursor-pointer" @click="removeSelectedRow(row.lrn)" />
                                    </div>
                                </div>
                                <button @click="logForm"
                                    class="mt-2 w-[30%] bg-[#295F98] text-white border-none rounded-[6px] py-2 text-[15px] cursor-pointer transition-colors duration-200 hover:bg-[#1d4066] block ml-auto">
                                    Submit
                                </button>
                            </div>
                            <!-- Right Column -->
                            <div
                                class="flex-1 bg-white rounded-[8px] border border-[#e0e0e0] p-4 flex flex-col min-w-0">
                                <div class="flex items-center gap-3">
                                    <select v-model="rightGender"
                                        class="w-[130px] p-[6px_10px] border border-[#e0e0e0] rounded-[6px] text-[15px] text-[#242424] bg-white">
                                        <option value="" disabled selected>Sex</option>
                                        <option value="All">All</option>
                                        <option value="F">Female</option>
                                        <option value="M">Male</option>
                                    </select>
                                    <select v-model="rightSort"
                                        class="w-[130px] p-[6px_10px] border border-[#e0e0e0] rounded-[6px] text-[15px] text-[#242424] bg-white">
                                        <option value="" disabled selected>Sort By</option>
                                        <option value="latest">Latest</option>
                                        <option value="oldest">Oldest</option>
                                    </select>
                                    <div
                                        class="w-[220px] ml-auto flex items-center bg-[#fafbfc] border border-[#e0e0e0] rounded-[6px] px-2 h-9">
                                        <img src="/assets/img/search-icon.svg" alt="search"
                                            class="w-[18px] h-[18px] mx-[5px] opacity-70" />
                                        <input type="text" v-model="rightSearch" placeholder="Search..."
                                            class="border-none outline-none bg-transparent w-full text-[15px] text-[#222]" />
                                    </div>
                                </div>
                                <div class="flex-1 overflow-y-auto mb-[10px] max-h-[600px] relative">
                                    <table class="w-full border-collapse mt-4 bg-white">
                                        <thead>
                                            <tr>
                                                <th class="bg-[#F6F6F6] font-semibold p-2 text-center"></th>
                                                <th class="bg-[#F6F6F6] font-semibold p-2 text-center">LRN</th>
                                                <th class="bg-[#F6F6F6] font-semibold p-2 text-center">FULL NAME</th>
                                                <th class="bg-[#F6F6F6] font-semibold p-2 text-center">GENDER</th>
                                                <th class="bg-[#F6F6F6] font-semibold p-2 text-center">Age</th>
                                                <th class="bg-[#F6F6F6] font-semibold p-2 text-center">Track</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <template v-if="filteredTableData.length > 0">
                                                <tr v-for="row in paginatedFilteredTableData" :key="row.lrn"
                                                    class="hover:bg-[#e0e0e0] cursor-pointer">
                                                    <td class="text-center">
                                                        <input type="checkbox" v-model="selectedRows"
                                                            :value="row.lrn" />
                                                    </td>
                                                    <td class="p-2 text-center">{{ row.lrn }}</td>
                                                    <td class="p-2 text-center">{{ row.name }}</td>
                                                    <td class="p-2 text-center">{{ row.gender }}</td>
                                                    <td class="p-2 text-center">{{ row.age }}</td>
                                                    <td class="p-2 text-center">{{ row.track }}</td>
                                                </tr>
                                            </template>
                                            <template v-else>
                                                <tr>
                                                    <td :colspan="showCheckboxes ? 7 : 6"
                                                        class="text-center text-[#666] text-[15px] py-5 bg-white border-b border-[#e0e0e0]">
                                                        <div class="flex items-center justify-center gap-2">
                                                            <img src="/assets/img/search-icon.svg" alt="search"
                                                                class="w-[18px] h-[18px] opacity-50" />
                                                            No results found for "{{ rightSearch }}"
                                                        </div>
                                                    </td>
                                                </tr>
                                            </template>
                                        </tbody>
                                    </table>
                                </div>
                                <!-- Pagination Controls for Student Selection -->
                                <div class="flex justify-between items-center mt-4 px-4">
                                    <div class="text-sm text-gray-600">
                                        Showing {{ paginatedFilteredTableData.length }} of {{ filteredTableData.length
                                        }} entries
                                    </div>
                                    <div class="flex gap-2">
                                        <button @click="studentCurrentPage--" :disabled="studentCurrentPage === 1"
                                            class="px-3 py-1 rounded border border-gray-300 disabled:opacity-50">
                                            Previous
                                        </button>
                                        <button v-for="page in studentTotalPages" :key="page"
                                            @click="studentCurrentPage = page" :class="[
                                                'px-3 py-1 rounded border',
                                                studentCurrentPage === page
                                                    ? 'bg-blue-500 text-white border-blue-500'
                                                    : 'border-gray-300 hover:bg-gray-100'
                                            ]">
                                            {{ page }}
                                        </button>
                                        <button @click="studentCurrentPage++"
                                            :disabled="studentCurrentPage === studentTotalPages"
                                            class="px-3 py-1 rounded border border-gray-300 disabled:opacity-50">
                                            Next
                                        </button>
                                    </div>
                                </div>
                                <button
                                    class="mt-2 self-end bg-[#295F98] text-white border-none rounded-[6px] px-[22px] py-2 text-[15px] cursor-pointer transition-colors duration-200 hover:bg-[#1d4066]"
                                    @click="toggleSelectAllStudents">{{ showCheckboxes ? 'Select Students'
                                        : 'Remove Students'
                                    }}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <template v-else>
            <div class="flex items-start">
                <button @click="showBlank = false" class="flex items-center mt-2 ml-2">
                    <span class="ml-1 text-lg text-[30px] text-[#242424] cursor-pointer">&lt;</span>
                    <span class="ml-1 text-lg font-semibold text-[#242424] underline cursor-pointer">Back</span>
                </button>
            </div>
        </template>
    </div>

    <!-- Teachers Modal  -->
    <div v-if="showAddTeacherModal" class="fixed inset-0 bg-black/20 z-[9999] flex items-center justify-center"
        @click.self="closeAddTeacherModal">
        <div
            class="bg-white shadow-[0_4px_32px_0_rgba(0,0,0,0.18)] w-[850px] max-h-[90vh] p-[38px_38px_24px_38px] relative flex flex-col overflow-y-auto rounded">
            <h2 class="text-[1.5rem] font-bold text-[#295F98] mb-7">Add Class Teacher</h2>
            <div class="mb-[22px]">
                <div class="text-[#295F98] text-[1rem] font-semibold mb-2">Advisory Teacher</div>
                <div class="flex mb-2 justify-between">
                    <select v-model="selectedSubject" @change="logSelectedAdviserSubjectId"
                        class="min-w-[220px] h-[48px] px-[12px] mb-2 border border-[#E3E9EC] rounded-[6px] bg-white text-[1rem] text-[#242424] font-medium">
                        <option disabled value="">Select Subject</option>
                        <option v-for="option in subjectOptions" :key="option.id" :value="option.name">
                            {{ option.name }}
                        </option>
                    </select>
                    <select v-model="selectedAdviser" @change="logSelectedAdviserId"
                        class="min-w-[240px] h-[48px] px-[12px] border border-[#E3E9EC] rounded-[6px] bg-white text-[1rem] text-[#242424] font-medium">
                        <option disabled value="">Select Adviser</option>
                        <option v-for="adviser in filteredAdvisersBySubject" :key="adviser.id" :value="adviser.id">
                            {{ adviser.name }}
                        </option>
                    </select>
                    <div class="flex flex-col relative">
                        <label
                            class="absolute bg-white text-[14px] text-[#292929] font-medium mt-[-10px] mb-1 ml-[10px] px-[5px]">Employee
                            ID</label>
                        <input
                            class="h-[48px] px-[12px] border border-[#E3E9EC] rounded-[6px] bg-white text-[1rem] text-[#242424] font-medium"
                            placeholder="Auto Fill" :value="selectedAdviserEmployeeNo" readonly />
                    </div>
                </div>
            </div>
            <div class="mb-[22px]">
                <div class="text-[#295F98] text-[1rem] font-semibold mb-2">Subject Teacher</div>

                <div v-for="(teacherEntry, index) in subjectTeachers" :key="index"
                    class="flex gap-[22px] mb-2 items-start justify-between">
                    <select v-model="teacherEntry.subject" @change="logTeacherSubjectId"
                        class="min-w-[220px] h-[48px] px-[12px] mb-2 border border-[#E3E9EC] rounded-[6px] bg-white text-[1rem] text-[#242424] font-medium">
                        <option disabled value="">Select Subject</option>
                        <option v-for="option in subjectOptions" :key="option.id" :value="option.name">
                            {{ option.name }}
                        </option>
                    </select>

                    <select
                        class="min-w-[240px] h-[48px] px-[12px] border border-[#E3E9EC] rounded-[6px] bg-white text-[1rem] text-[#242424] font-medium"
                        v-model="teacherEntry.teacher">
                        <option value="" disabled>Teacher Name</option>
                        <option v-for="teacher in filteredTeachersBySubject(teacherEntry.subject)" :key="teacher.id"
                            :value="teacher.name">
                            {{ teacher.name }}
                        </option>
                    </select>

                    <div class="flex flex-col relative">
                        <label
                            class="absolute bg-white text-[14px] mb-2 text-[#292929] font-medium mt-[-10px] mb-1 ml-[10px] px-[5px]">
                            Employee ID
                        </label>
                        <input
                            class="min-w-[220px] h-[48px] px-[12px] border border-[#E3E9EC] rounded-[6px] bg-white text-[1rem] text-[#242424] font-medium"
                            placeholder="Auto Fill" :value="adviserIdByName(teacherEntry.teacher)" readonly />
                    </div>

                    <!-- Delete button (always visible) -->
                    <button @click="removeSubjectTeacher(index)"
                        class="text-white bg-red-600 hover:bg-red-700 px-3 h-[48px] rounded text-[1.5rem] font-bold">
                        &minus;
                    </button>
                </div>

                <!-- Add button -->
                <button @click="addSubjectTeacher"
                    class="w-full bg-[#295F98] text-white text-[2rem] border-none rounded px-0 py-1 mt-[18px] mb-[18px] cursor-pointer transition-colors duration-200 hover:bg-[#1d4066]">
                    +
                </button>
            </div>
            <div class="flex justify-end gap-[18px] mt-[120px]">
                <button
                    class="bg-[#BFC3C8] text-white text-[1rem] font-medium border-none rounded-[6px] px-8 py-[10px] cursor-pointer transition-colors duration-200 hover:bg-[#a0a4a8]"
                    @click="closeAddTeacherModal">Cancel</button>
                <button
                    class="bg-[#295F98] text-white text-[1rem] font-medium border-none rounded-[6px] px-8 py-[10px] cursor-pointer transition-colors duration-200 shadow-[0_2px_4px_0_rgba(41,95,152,0.08)] hover:bg-[#1d4066]"
                    @click="submitFacultyAssignments">
                    Add Faculty(s)
                </button>
            </div>
        </div>
    </div>

    <!-- CLASSINFO MODAL -->
    <div v-if="showClassInfoModal" class="fixed inset-0 bg-black/20 z-[9999] flex items-center justify-center"
        @click.self="closeClassInfoModal">
        <div class="bg-white w-[750px] rounded-lg p-8 shadow-lg flex flex-col">
            <h2 class="text-[22px] text-[#295F98] mb-4 tracking-wide">CLASS INFO</h2>
            <div class="grid grid-cols-2 gap-x-8 gap-y-2 mb-6">
                <div>
                    <div class="text-[#295F98] text-[13px] font-semibold mb-1">Class Adviser</div>
                    <div class="text-[16px] mb-3">{{ selectedClassInfo.adviser }}</div>
                    <div class="text-[#295F98] text-[13px] font-semibold mb-1">Curriculum</div>
                    <div class="text-[16px] mb-3">{{ selectedClassInfo.curriculum }}</div>
                    <div class="text-[#295F98] text-[13px] font-semibold mb-1">Class Section</div>
                    <div class="text-[16px]">{{ selectedClassInfo.section }}</div>
                </div>
                <div>
                    <div class="text-[#295F98] text-[13px] font-semibold mb-1">Grade Level</div>
                    <div class="text-[16px] mb-3">{{ selectedClassInfo.grade }}</div>
                    <div class="text-[#295F98] text-[13px] font-semibold mb-1">Track</div>
                    <div class="text-[16px] mb-3">{{ selectedClassInfo.track }}</div>
                    <div class="text-[#295F98] text-[13px] font-semibold mb-1">Recently Added Student</div>
                    <div class="text-[16px]">{{ selectedClassInfo.students }}</div>
                </div>
            </div>
            <div class="text-[#295F98] text-[17px] mb-2 tracking-wide">COMMENT</div>
            <textarea
                class="w-full h-[120px] border border-[#295F98] rounded-lg p-3 text-[15px] mb-6 resize-none"></textarea>
            <div class="flex justify-end">
                <button @click="closeClassInfoModal"
                    class="bg-[#888] text-white px-8 py-2 rounded transition hover:bg-[#444] cursor-pointer">Close</button>
            </div>
        </div>
    </div>
</template>

<script>
import Dropdown from '@/components/dropdown.vue';
import { getAllAcceptedStudents } from '@/service/studentService';
import { getAllTeacherSubjects, getClassesExcludingIncomplete } from '@/service/teacherSubjectsService';
import { getAllClasses } from '@/service/adminClassService';
import { createClass } from '@/service/adminClassService';
import Swal from 'sweetalert2';
import { useToast } from 'vue-toastification'

const toast = useToast()

export default {
    name: 'Dasboard',
    components: { Dropdown },
    data() {
        return {
            subjectTeachers: [{ subject: '', teacher: '' }],
            activeTab: 'add',
            showBlank: false,
            showGrade7Detail: false,
            grades: [
                { mainTitle: 'Grade 7', subTitle: 'Junior High School', studentCount: '' },
                { mainTitle: 'Grade 8', subTitle: 'Junior High School', studentCount: '' },
                { mainTitle: 'Grade 9', subTitle: 'Junior High School', studentCount: '' },
                { mainTitle: 'Grade 10', subTitle: 'Junior High School', studentCount: '' },
                { mainTitle: 'Grade 11', subTitle: 'Senior High School', studentCount: '' },
                { mainTitle: 'Grade 12', subTitle: 'Senior High School', studentCount: '' },
            ],
            selectedGradeLevel: '',
            selectedTrack: '',
            selectedClassSection: '',
            enteredGrade: '',
            enteredCurriculum: '',
            enteredIdx: null,
            leftSex: '',
            rightGender: '',
            rightSort: '',
            rightSearch: '',
            showCheckboxes: false,
            showAddTeacherModal: false,
            showClassInfoModal: false,
            teachersSubjects: [],
            selectedTeacher: {
                subjects: []
            },
            classes: [],
            superClasses: [],

            dummyTableData: [],
            allTeacherSubjects: [],
            selectedRows: [],
            selectedAdviser: '',
            selectedSubject: '',
            selectedSubjectAdviser: '',
            advisers: [],
            form: {
                student_ids: [],
                class_id: '',
                class_name: '',
                sy_id: '',
                adviser_id: '',
                teacher_subject_ids: [],
                is_advisory: false,
            },
            loading: true,
            error: null,
            submittedCurrentPage: 1,
            studentCurrentPage: 1,
            itemsPerPage: 10,
        };
    },
    watch: {
        selectedClassSection(newClass) {
            if (newClass) {
                this.form.class_id = newClass.Class_ID;
                this.form.class_name = newClass.Section;
                this.form.sy_id = newClass.SY_ID;
            } else {
                this.form.class_id = '';
                this.form.class_name = '';
                this.form.sy_id = '';
            }
        },
        selectedRows(newLRNs) {
            const allRows = this.dummyTableData[this.enteredIdx] || [];

            // Get the actual row objects based on selected LRNs
            this.leftSelectedStudents = allRows.filter(row =>
                newLRNs.includes(row.lrn)
            );

            // Set student_ids in form using their student_id
            this.form.student_ids = this.leftSelectedStudents.map(row => row.student_id);
        },
        selectedClass(newVal) {
            this.selectedTrack = newVal ? newVal.Track : '';
        },
        rightSearch() {
            this.studentCurrentPage = 1;
        },
        rightGender() {
            this.studentCurrentPage = 1;
        },
        rightSort() {
            this.studentCurrentPage = 1;
        }
    },
    mounted() {
        this.fetchStudentCounts();
        this.fetchTeacherSubjects();
        this.getAllClasses();
        this.getClassesExcludingIncomplete();
    },
    methods: {
        setTab(tab) {
            this.activeTab = tab;
        },
        async logForm() {
            console.log('Form Data:', this.form);

            try {
                const response = await createClass(this.form);
                console.log('Class created successfully:', response);

                // Show success alert
                await Swal.fire({
                    title: 'Success',
                    text: response.message || 'Class created successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });

                window.location.reload();

            } catch (error) {
                console.error('Failed to create class:', error);

                // Show error alert
                await Swal.fire({
                    title: 'Error',
                    text: error.response?.data?.message || 'Failed to create class.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        },
        logSelectedAdviserId() {
            console.log('Selected Adviser ID:', this.selectedAdviser);

            // If you want to get the adviser object by ID and log more info:
            const adviser = this.advisers.find(a => a.id === this.selectedAdviser);
            if (adviser) {
                console.log('Selected Adviser:', adviser);
            } else {
                console.log('Adviser not found');
            }
        },
        logSelectedAdviserSubjectId() {
            // find subject by name from subjectOptions
            const subject = this.subjectOptions.find(s => s.name === this.selectedSubject);
            console.log('Selected Subject Name:', this.selectedSubject);
            console.log('Selected Subject ID:', subject ? subject.id : 'NOT FOUND');
        },
        logTeacherSubjectId() {
            if (!this.subjectOptions || !Array.isArray(this.subjectOptions)) {
                console.warn('subjectOptions is not loaded yet');
                return;
            }
            const subject = this.subjectOptions.find(s => s.name === this.teacherEntry.subject);
            console.log('Selected Teacher Subject Name:', this.teacherEntry.subject);
            console.log('Selected Teacher Subject ID:', subject ? subject.id : 'NOT FOUND');
        },

        getTeacherSubjectId(teacherId, subjectId) {
            const match = this.teachersSubjects.find(
                item => String(item.teacher_id) === String(teacherId) && String(item.subject_id) === String(subjectId)
            );
            console.log('getTeacherSubjectId:', teacherId, subjectId, '=>', match ? match.id : 'NOT FOUND');
            return match ? match.id : null;
        },
        adviserIdByName(name) {
            // Use the correct array here:
            const adviser = this.teacherOptions.find(adviser => adviser.name === name);
            console.log('adviserIdByName:', name, '=>', adviser ? adviser.id : 'NOT FOUND');
            return adviser ? adviser.id : '';
        },

        subjectIdByName(name) {
            const match = this.subjectOptions.find(subject => subject.name === name);
            console.log('subjectIdByName:', name, '=>', match ? match.id : 'NOT FOUND');
            return match ? match.id : '';
        },

        addSubjectTeacher() {
            this.subjectTeachers.push({ subject: '', teacher: '' });
        },

        removeSubjectTeacher(index) {
            this.subjectTeachers.splice(index, 1);
        },
        submitFacultyAssignments() {
            const teacherSubjectIds = [];

            // STEP 1: Adviser teacher_subject_id
            const adviserId = this.selectedAdviser; // adviser ID
            const adviserSubject = this.subjectOptions.find(s => s.name === this.selectedSubject);
            const adviserSubjectId = adviserSubject ? adviserSubject.id : '';

            if (adviserId && adviserSubjectId) {
                const adviserTeacherSubjectId = this.getTeacherSubjectId(adviserId, adviserSubjectId);
                if (adviserTeacherSubjectId) {
                    teacherSubjectIds.push(adviserTeacherSubjectId);
                } else {
                    console.error(`No teacher-subject match found for adviserId ${adviserId} and subjectId ${adviserSubjectId}`);
                }
            } else {
                console.error('Adviser ID or Subject ID is missing');
            }

            // STEP 2: Other subject teachers
            for (const entry of this.subjectTeachers) {
                const teacherId = this.adviserIdByName(entry.teacher);
                const subjectId = this.subjectIdByName(entry.subject);

                if (!teacherId || !subjectId) {
                    console.error(`Missing teacher or subject ID for "${entry.teacher}" / "${entry.subject}"`);
                    continue;
                }

                const teacherSubjectId = this.getTeacherSubjectId(teacherId, subjectId);

                if (teacherSubjectId) {
                    teacherSubjectIds.push(teacherSubjectId);
                } else {
                    console.error(`No match found for teacherId ${teacherId} and subjectId ${subjectId}`);
                }
            }

            // Confirmation alert
            Swal.fire({
                title: 'Are you sure?',
                text: "Do you want to save these faculty assignments?",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, save it!',
                cancelButtonText: 'Cancel'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Save locally in parent form state
                    this.form.teacher_subject_ids = teacherSubjectIds;
                    this.form.adviser_id = adviserId;

                    console.log('Saved locally in form:', this.form);

                    this.showAddTeacherModal = false;

                    toast.success('Faculty assignments saved successfully!');
                }
            });
        },


        async fetchStudentCounts() {
            try {
                this.loading = true;
                this.error = null;

                const response = await getAllAcceptedStudents();
                const data = response.students;

                console.log("DATA:", data);

                const gradeCounts = {
                    'Grade 7': 0,
                    'Grade 8': 0,
                    'Grade 9': 0,
                    'Grade 10': 0,
                    'Grade 11': 0,
                    'Grade 12': 0
                };

                // Initialize grade-based dummyTableData structure
                const tableDataByGrade = {
                    'Grade 7': [],
                    'Grade 8': [],
                    'Grade 9': [],
                    'Grade 10': [],
                    'Grade 11': [],
                    'Grade 12': []
                };

                // Process each student
                data.forEach(student => {
                    const gradeKey = `Grade ${student.Grade_Level}`;
                    if (gradeCounts[gradeKey] !== undefined) {
                        gradeCounts[gradeKey]++;

                        // Add to table data
                        tableDataByGrade[gradeKey].push({
                            student_id: student.Student_ID,
                            lrn: student.LRN,
                            name: `${student.FirstName} ${student.MiddleName} ${student.LastName}`.trim(),
                            gender: student.Sex === 'M' ? 'Male' : 'Female',
                            age: student.Age,
                            track: student.Track || 'N/A',
                            created_at: student.created_at || new Date().toISOString()
                        });
                    }
                });

                // Update student counts per grade
                this.grades = this.grades.map(grade => ({
                    ...grade,
                    studentCount: `${gradeCounts[grade.mainTitle] || 0} Total Students`
                }));

                // Assign formatted data to dummyTableData (in order of grades array)
                this.dummyTableData = this.grades.map(grade => tableDataByGrade[grade.mainTitle] || []);

            } catch (error) {
                this.error = error.message || 'An error occurred while loading data'
                console.error('Failed to fetch students:', error);
            } finally {
                this.loading = false;
            }
        },
        async fetchTeacherSubjects() {
            console.log('fetchTeacherSubjects started');
            try {
                const data = await getAllTeacherSubjects(); // data is directly the array

                this.teachersSubjects = data;

                console.log('Sample item from teacher-subject data:', data[0]);

                // Get unique subjects
                this.subjectOptions = [...new Set(data.map(item => item.subject))].map(subject => ({
                    id: subject,  // This is wrong if `subject` is string like "Mathematics"
                    name: subject
                }));

                // Get unique adviser names
                const uniqueAdvisers = [];
                const adviserSet = new Set();

                console.log('TeachersSubjects:', this.teachersSubjects);

                for (const item of data) {
                    if (!adviserSet.has(item.teacher_name)) {
                        adviserSet.add(item.teacher_name);
                        uniqueAdvisers.push({
                            id: item.teacher_id,
                            name: item.teacher_name
                        });
                    }
                }

                this.advisers = uniqueAdvisers;

                console.log('Advisers:', this.advisers); // Now advisers will show the correct array


            } catch (error) {
                console.error('Error fetching teacher-subject mappings:', error);
            }
        },
        async getAllClasses() {
            console.log('getAllClasses started');
            try {
                const data = await getAllClasses();
                this.classes = data;
                console.log("CLASSES ARE:", this.classes);
            } catch (err) {
                this.error = 'Failed to load classes.';
                console.error(err);
            } finally {
                this.loading = false;
            }
        },
        async getClassesExcludingIncomplete() {
            try {
                const data = await getClassesExcludingIncomplete(); // API call

                console.log("DATAS", data)
                this.superClasses = data.map(c => {
                    const firstStudentClass = c.student_classes[0]; // First entry for adviser data
                    const adviser = firstStudentClass?.adviser
                        ? `${firstStudentClass.adviser.LastName}, ${firstStudentClass.adviser.FirstName} ${firstStudentClass.adviser.MiddleName ?? ''}`.trim()
                        : 'Not assigned';

                    return {
                        grade: c.Grade_Level,
                        curriculum: c.Curriculum ?? 'N/A',
                        track: c.Track ?? 'N/A',
                        section: c.Section ?? 'N/A',
                        adviser,
                        students: c.student_classes_count ?? 0,
                        date: new Date(c.created_at).toLocaleDateString(),
                        status: c.Status,
                    };
                });
            } catch (error) {
                console.error('Failed to fetch class data:', error);
            }
        },

        getTeachersBySubjectName(subject) {
            return this.teachersSubjects
                .filter(item => item.subject === subject)
                .map(item => ({
                    id: item.teacher_id,
                    name: item.teacher_name
                }));
        },

        // Get subjects for a selected teacher
        getSubjectsByTeacherName(teacherName) {
            return this.teachersSubjects
                .filter(item => item.teacher_name === teacherName)
                .map(item => item.subject);
        },
        handleEnter(idx) {
            this.showBlankView(idx);
        },
        backFromDetail() {
            this.showGrade7Detail = false;
            this.showBlank = false;
        },
        openAddTeacherModal() {
            this.showAddTeacherModal = true;
        },
        closeAddTeacherModal() {
            this.showAddTeacherModal = false;
            this.selectedAdviser = '';
            this.selectedSubjectAdviser = '';
        },
        openClassInfoModal(row) {
            this.selectedClassInfo = row;
            this.showClassInfoModal = true;
        },
        closeClassInfoModal() {
            this.showClassInfoModal = false;
            this.selectedClassInfo = null;
        },
        showBlankView(idx) {
            if (typeof idx === 'number') {
                this.enteredGrade = this.grades[idx].mainTitle;
                this.enteredCurriculum = this.grades[idx].subTitle;
                this.selectedTrack = '';
                this.selectedClassSection = '';
                this.enteredIdx = idx;
                this.showGrade7Detail = true;
                this.showBlank = false;
            } else {
                this.showBlank = true;
                this.showGrade7Detail = false;
            }
        },
        removeSelectedRow(lrn) {
            this.selectedRows = this.selectedRows.filter(selectedLrn => selectedLrn !== lrn);
        },
        toggleSelectAllStudents() {
            if (this.showCheckboxes) {
                // If checkboxes are visible, select all students
                this.selectedRows = this.filteredTableData.map(row => row.lrn);
            } else {
                // If checkboxes are not visible, clear selection
                this.selectedRows = [];
            }
            this.showCheckboxes = !this.showCheckboxes;
        },
    },

    computed: {
        filteredTableData() {
            let filteredData = this.dummyTableData[this.enteredIdx] || [];

            if (this.rightGender && this.rightGender !== "All") {
                filteredData = filteredData.filter(row => {
                    const rowGender = row.gender.toLowerCase();
                    const selectedGender = this.rightGender === 'M' ? 'male' : 'female';
                    return rowGender === selectedGender;
                });
            }

            if (this.rightSearch) {
                const searchTerm = this.rightSearch.toLowerCase();
                filteredData = filteredData.filter(row =>
                    row.name.toLowerCase().includes(searchTerm) ||
                    row.lrn.toLowerCase().includes(searchTerm)
                );
            }

            // Sort by created_at if rightSort is set
            if (this.rightSort) {
                filteredData.sort((a, b) => {
                    const dateA = new Date(a.created_at);
                    const dateB = new Date(b.created_at);
                    return this.rightSort === 'latest' ? dateB - dateA : dateA - dateB;
                });
            }

            return filteredData;
        },
        filteredLeftTableData() {
            if (!this.leftSex) return this.leftSelectedStudents;
            return this.leftSelectedStudents.filter(row => {
                const rowGender = row.gender.toLowerCase();
                const selectedGender = this.leftSex === 'M' ? 'male' : 'female';
                return rowGender === selectedGender;
            });
        },
        subjectOptions() {
            const uniqueSubjects = new Map();
            this.teachersSubjects.forEach(item => {
                if (!uniqueSubjects.has(item.subject.Subject_ID)) {
                    uniqueSubjects.set(item.subject.Subject_ID, item.subject);
                }
            });
            return Array.from(uniqueSubjects.values()).map(subject => ({
                id: subject.Subject_ID,
                name: subject.SubjectName
            }));
        },
        advisers() {
            if (!this.teachersSubjects || !this.teachersSubjects.length) return [];

            const unique = new Map();

            this.teachersSubjects.forEach(item => {
                const teacher = item.teacher;
                if (teacher && !unique.has(item.teacher_id)) {
                    const fullName = `${teacher.FirstName} ${teacher.LastName}`;
                    unique.set(item.teacher_id, { id: item.teacher_id, name: fullName });
                }
            });

            return Array.from(unique.values());
        },
        teacherOptions() {
            const unique = new Map();

            this.teachersSubjects.forEach(item => {
                const teacher = item.teacher;
                if (teacher && !unique.has(item.teacher_id)) {
                    const fullName = `${teacher.FirstName} ${teacher.LastName}`;
                    unique.set(item.teacher_id, {
                        id: item.teacher_id,
                        name: fullName
                    });
                }
            });

            return Array.from(unique.values());
        },
        selectedAdviserEmployeeNo() {
            if (!this.selectedAdviser) return '';
            const teacherSubject = this.teachersSubjects.find(
                item => item.teacher_id === this.selectedAdviser
            );
            return teacherSubject?.teacher?.EmployeeNo || '';
        },
        filteredClassesByGrade() {
            if (!this.enteredGrade) {
                return [];
            }
            // Remove 'Grade ' prefix if present, e.g. "Grade 7" -> "7"
            const gradeNumber = this.enteredGrade.replace(/^Grade\s*/, '');

            console.log("GRADE ENTERED:", gradeNumber);
            // filter classes where Grade_Level equals cleaned gradeNumber
            return this.classes.filter(c => c.Grade_Level === gradeNumber);
        },
        selectedClass() {
            return this.selectedClassSection || null;
        },
        filteredAdvisersBySubject() {
            if (!this.selectedSubject) return this.advisers;

            const subjectObj = this.subjectOptions.find(s => s.name === this.selectedSubject);
            if (!subjectObj) return [];

            // Filter teachersSubjects for selected subject
            const filtered = this.teachersSubjects.filter(
                item => item.subject?.Subject_ID === subjectObj.id
            );

            // Map unique advisers
            const unique = new Map();
            filtered.forEach(item => {
                if (item.teacher && !unique.has(item.teacher_id)) {
                    const fullName = `${item.teacher.FirstName} ${item.teacher.LastName}`;
                    unique.set(item.teacher_id, { id: item.teacher_id, name: fullName });
                }
            });

            return Array.from(unique.values());
        },

        // This returns a function to filter teachers for each subject teacher entry
        filteredTeachersBySubject() {
            return (subjectName) => {
                if (!subjectName) return this.teacherOptions;

                const subjectObj = this.subjectOptions.find(s => s.name === subjectName);
                if (!subjectObj) return [];

                const filtered = this.teachersSubjects.filter(
                    item => item.subject?.Subject_ID === subjectObj.id
                );

                const unique = new Map();
                filtered.forEach(item => {
                    if (item.teacher && !unique.has(item.teacher_id)) {
                        const fullName = `${item.teacher.FirstName} ${item.teacher.LastName}`;
                        unique.set(item.teacher_id, { id: item.teacher_id, name: fullName });
                    }
                });

                return Array.from(unique.values());
            }
        },
        teacherButtonLabel() {
            return this.form.teacher_subject_ids.length === 0 ? 'Add Teacher' : 'Edit Teacher';
        },
        submittedTotalPages() {
            return Math.ceil(this.superClasses.length / this.itemsPerPage);
        },

        paginatedSuperClasses() {
            const start = (this.submittedCurrentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.superClasses.slice(start, end);
        },

        studentTotalPages() {
            return Math.ceil(this.filteredTableData.length / this.itemsPerPage);
        },

        paginatedFilteredTableData() {
            const start = (this.studentCurrentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredTableData.slice(start, end);
        },
    }
};
</script>
