<template>
    <div class="flex flex-col overflow-hidden">
        <template v-if="!showBlank && !showGrade7Detail">
            <h1 class="text-5xl font-bold text-[#242424]">Manage Class</h1>

            <div class="bg-[#E0E0E0] rounded-tl-[8px] rounded-tr-[8px] p-4 mt-6">
                <div class="flex justify-between items-center">
                    <div class="w-1/2 text-center font-semibold relative cursor-pointer"
                        :class="activeTab === 'add' ? 'text-[#295F98]' : 'text-[#242424]'" @click="setTab('add')">
                        <span>Add Classes</span>
                        <div v-if="activeTab === 'add'" class="h-[2px] bg-[#295F98] w-[95%] mt-2 mx-auto"></div>
                    </div>
                    <div class="w-1/2 text-center font-semibold relative cursor-pointer"
                        :class="activeTab === 'submitted' ? 'text-[#295F98]' : 'text-[#242424]'"
                        @click="setTab('submitted')">
                        <span>SUBMITTED</span>
                        <div v-if="activeTab === 'submitted'" class="h-[2px] bg-[#295F98] w-[95%] mt-2 mx-auto"></div>
                    </div>
                </div>
            </div>

            <div v-if="activeTab === 'add'" class="grid grid-cols-3 gap-8 my-8">
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

            <div v-else class="grid grid-cols-3 gap-8 my-8 min-h-[200px]"></div>
        </template>
        <template v-else-if="showGrade7Detail">
            <div class="grade7-detail-container">
                <button @click="backFromDetail" class="flex items-center mt-2 ml-2">
                    <span class="ml-1 text-lg text-[30px] text-[#242424] cursor-pointer">
                        < </span>
                            <span class="ml-1 text-lg font-semibold text-[#242424] underline cursor-pointer">Back</span>
                </button>
                <div class="detail-content">
                    <div class="dropdown-row">
                        <div class="dropdown-item curriculum-box">
                            <label class="curriculum-label">Grade Level</label>
                            <div class="curriculum-value">{{ enteredGrade }}</div>
                        </div>
                        <div class="dropdown-item curriculum-box">
                            <label class="curriculum-label">Curriculum</label>
                            <div class="curriculum-value">{{ enteredCurriculum }}</div>
                        </div>
                        <div class="dropdown-item curriculum-box">
                            <label class="curriculum-label">Track</label>
                            <select v-model="selectedTrack" class="custom-select">
                                <option value="SPA">SPA</option>
                                <option value="SPJ">SPJ</option>
                                <option value="BEC">BEC</option>
                            </select>
                        </div>
                        <div class="dropdown-item curriculum-box">
                            <label class="curriculum-label">Class Section</label>
                            <select v-model="selectedClassSection" class="custom-select">
                                <option value="Einstein">Einstein</option>
                                <option value="Einstein2">Einstein</option>
                                <option value="Einstein3">Einstein</option>
                                <option value="Einstein4">Einstein</option>
                            </select>
                        </div>
                        <div class="add-teacher-btn-container">
                            <button class="add-teacher-btn">Add Teacher</button>
                        </div>
                    </div>
                    <div class="detail-placeholder">
                        <div class="detail-flex">
                            <!-- Left Column -->
                            <div class="left-panel">
                                <div class="left-dropdown-row">
                                    <select v-model="leftSex" class="left-select">
                                        <option value="" disabled selected>Sex</option>
                                        <option value="F">Female</option>
                                        <option value="M">Male</option>
                                    </select>
                                </div>
                                <div class="left-list">
                                    <div v-for="row in dummyLeftListData[enteredIdx]" :key="row.lrn" class="left-list-row">
                                        <span class="left-lrn">{{ row.lrn }}</span>
                                        <span class="left-name">{{ row.name }}</span>
                                        <span class="left-arrow">&#x21ba;</span>
                                    </div>
                                </div>
                                <button class="left-submit">Submit</button>
                            </div>
                            <!-- Right Column -->
                            <div class="right-panel">
                                <div class="right-controls">
                                    <select v-model="rightGender" class="right-select">
                                        <option value="" disabled selected>Sex</option>
                                        <option value="">All</option>
                                        <option value="F">Female</option>
                                        <option value="M">Male</option>
                                    </select>
                                    <select v-model="rightSort" class="right-select">
                                        <option value="" disabled selected>Sort By</option>
                                        <option value="latest">Latest</option>
                                        <option value="oldest">Oldest</option>
                                    </select>
                                    <div class="right-search">
                                        <img src="/assets/img/search-icon.svg" alt="search" class="search-icon" />
                                        <input type="text" v-model="rightSearch" placeholder="Search..." />
                                    </div>
                                </div>
                                <div class="right-table-container">
                                    <table class="dummy-table">
                                        <thead>
                                            <tr>
                                                <th v-if="showCheckboxes"></th>
                                                <th>LRN</th>
                                                <th>FULL NAME</th>
                                                <th>GENDER</th>
                                                <th>Age</th>
                                                <th>Track</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <template v-if="filteredTableData.length > 0">
                                                <tr v-for="row in filteredTableData" :key="row.lrn">
                                                    <td v-if="showCheckboxes"><input type="checkbox" /></td>
                                                    <td>{{ row.lrn }}</td>
                                                    <td>{{ row.name }}</td>
                                                    <td>{{ row.gender }}</td>
                                                    <td>{{ row.age }}</td>
                                                    <td>{{ row.track }}</td>
                                                </tr>
                                            </template>
                                            <template v-else>
                                                <tr>
                                                    <td :colspan="showCheckboxes ? 7 : 6" class="no-results">
                                                        <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                                                            <img src="/assets/img/search-icon.svg" alt="search" class="search-icon" style="opacity: 0.5;" />
                                                            No results found for "{{ rightSearch }}"
                                                        </div>
                                                    </td>
                                                </tr>
                                            </template>
                                        </tbody>
                                    </table>
                                </div>
                                <button class="right-select-btn" @click="showCheckboxes = !showCheckboxes">Select
                                    Students</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <template v-else>
            <div class="flex items-start">
                <button @click="showBlank = false" class="flex items-center mt-2 ml-2">
                    <span class="ml-1 text-lg text-[30px] text-[#242424] cursor-pointer">
                        <</span>
                            <span class="ml-1 text-lg font-semibold text-[#242424] underline cursor-pointer">Back</span>
                </button>
            </div>
        </template>
    </div>
</template>


<script>
import Dropdown from '@/components/dropdown.vue';
export default {
    name: 'Dasboard',
    components: { Dropdown },
    data() {
        return {
            activeTab: 'add',
            showBlank: false,
            showGrade7Detail: false,
            grades: [
                { mainTitle: 'Grade 7', subTitle: 'Junior High School', studentCount: '100 Total Students' },
                { mainTitle: 'Grade 8', subTitle: 'Junior High School', studentCount: '100 Total Students' },
                { mainTitle: 'Grade 9', subTitle: 'Junior High School', studentCount: '100 Total Students' },
                { mainTitle: 'Grade 10', subTitle: 'Junior High School', studentCount: '100 Total Students' },
                { mainTitle: 'Grade 11', subTitle: 'Senior High School', studentCount: '100 Total Students' },
                { mainTitle: 'Grade 12', subTitle: 'Senior High School', studentCount: '100 Total Students' },
            ],
            selectedGradeLevel: 'Grade 7',
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
            dummyTableData: [
                [
                    { lrn: '10693001001', name: 'Ava Thompson', gender: 'F', age: 21, track: 'SPA' },
                    { lrn: '10693001002', name: 'Liam Johnson', gender: 'M', age: 20, track: 'SPA' },
                    { lrn: '10693001003', name: 'Sophia Lee', gender: 'F', age: 21, track: 'SPA' },
                    { lrn: '10693001004', name: 'Noah Smith', gender: 'M', age: 22, track: 'SPA' },
                    { lrn: '10693001005', name: 'Mia Brown', gender: 'F', age: 20, track: 'SPA' },
                    { lrn: '10693001006', name: 'Lucas Garcia', gender: 'M', age: 21, track: 'SPA' },
                    { lrn: '10693001007', name: 'Isabella Martinez', gender: 'F', age: 21, track: 'SPA' },
                    { lrn: '10693001008', name: 'Mason Davis', gender: 'M', age: 20, track: 'SPA' },
                    { lrn: '10693001009', name: 'Charlotte Wilson', gender: 'F', age: 22, track: 'SPA' },
                    { lrn: '10693001010', name: 'Elijah Anderson', gender: 'M', age: 21, track: 'SPA' },
                    { lrn: '10693001011', name: 'Oliver Moore', gender: 'M', age: 20, track: 'SPA' },
                    { lrn: '10693001012', name: 'Emily Taylor', gender: 'F', age: 21, track: 'SPA' },
                    { lrn: '10693001013', name: 'Jacob Thomas', gender: 'M', age: 22, track: 'SPA' },
                    { lrn: '10693001014', name: 'Madison White', gender: 'F', age: 20, track: 'SPA' },
                    { lrn: '10693001015', name: 'Carter Harris', gender: 'M', age: 21, track: 'SPA' },
                    { lrn: '10693001016', name: 'Ella Martin', gender: 'F', age: 21, track: 'SPA' },
                    { lrn: '10693001017', name: 'Logan Thompson', gender: 'M', age: 20, track: 'SPA' },
                    { lrn: '10693001018', name: 'Grace Clark', gender: 'F', age: 22, track: 'SPA' },
                    { lrn: '10693001019', name: 'Jackson Lewis', gender: 'M', age: 21, track: 'SPA' },
                    { lrn: '10693001020', name: 'Scarlett Walker', gender: 'F', age: 20, track: 'SPA' },
                ],
                [
                    { lrn: '20693001001', name: 'Amelia Clark', gender: 'F', age: 20, track: 'SPJ' },
                    { lrn: '20693001002', name: 'Benjamin Lewis', gender: 'M', age: 21, track: 'SPJ' },
                    { lrn: '20693001003', name: 'Harper Young', gender: 'F', age: 22, track: 'SPJ' },
                    { lrn: '20693001004', name: 'James King', gender: 'M', age: 20, track: 'SPJ' },
                    { lrn: '20693001005', name: 'Evelyn Scott', gender: 'F', age: 21, track: 'SPJ' },
                    { lrn: '20693001006', name: 'Henry Green', gender: 'M', age: 22, track: 'SPJ' },
                    { lrn: '20693001007', name: 'Abigail Adams', gender: 'F', age: 20, track: 'SPJ' },
                    { lrn: '20693001008', name: 'Alexander Baker', gender: 'M', age: 21, track: 'SPJ' },
                    { lrn: '20693001009', name: 'Emily Nelson', gender: 'F', age: 22, track: 'SPJ' },
                    { lrn: '20693001010', name: 'Jack Carter', gender: 'M', age: 20, track: 'SPJ' },
                    { lrn: '20693001011', name: 'Avery Perez', gender: 'F', age: 21, track: 'SPJ' },
                    { lrn: '20693001012', name: 'Samuel Rivera', gender: 'M', age: 22, track: 'SPJ' },
                    { lrn: '20693001013', name: 'Ella Cooper', gender: 'F', age: 20, track: 'SPJ' },
                    { lrn: '20693001014', name: 'Mila Richardson', gender: 'F', age: 22, track: 'SPJ' },
                    { lrn: '20693001015', name: 'Wyatt Cox', gender: 'M', age: 20, track: 'SPJ' },
                    { lrn: '20693001016', name: 'Camila Howard', gender: 'F', age: 21, track: 'SPJ' },
                    { lrn: '20693001017', name: 'Julian Ward', gender: 'M', age: 22, track: 'SPJ' },
                    { lrn: '20693001018', name: 'Luna Torres', gender: 'F', age: 20, track: 'SPJ' },
                    { lrn: '20693001019', name: 'Gabriel Peterson', gender: 'M', age: 21, track: 'SPJ' },
                    { lrn: '20693001020', name: 'Nora Gray', gender: 'F', age: 22, track: 'SPJ' },
                ],
                [
                    { lrn: '30693001001', name: 'Ella Perez', gender: 'F', age: 21, track: 'BEC' },
                    { lrn: '30693001002', name: 'Logan Roberts', gender: 'M', age: 20, track: 'BEC' },
                    { lrn: '30693001003', name: 'Scarlett Turner', gender: 'F', age: 22, track: 'BEC' },
                    { lrn: '30693001004', name: 'William Phillips', gender: 'M', age: 21, track: 'BEC' },
                    { lrn: '30693001005', name: 'Grace Campbell', gender: 'F', age: 20, track: 'BEC' },
                    { lrn: '30693001006', name: 'Sebastian Parker', gender: 'M', age: 22, track: 'BEC' },
                    { lrn: '30693001007', name: 'Chloe Evans', gender: 'F', age: 21, track: 'BEC' },
                    { lrn: '30693001008', name: 'Daniel Edwards', gender: 'M', age: 20, track: 'BEC' },
                    { lrn: '30693001009', name: 'Penelope Collins', gender: 'F', age: 22, track: 'BEC' },
                    { lrn: '30693001010', name: 'Matthew Stewart', gender: 'M', age: 21, track: 'BEC' },
                    { lrn: '30693001011', name: 'Layla Morris', gender: 'F', age: 20, track: 'BEC' },
                    { lrn: '30693001012', name: 'David Rogers', gender: 'M', age: 22, track: 'BEC' },
                    { lrn: '30693001013', name: 'Zoe Reed', gender: 'F', age: 20, track: 'BEC' },
                    { lrn: '30693001014', name: 'Joseph Cook', gender: 'M', age: 21, track: 'BEC' },
                    { lrn: '30693001015', name: 'Lily Morgan', gender: 'F', age: 22, track: 'BEC' },
                    { lrn: '30693001016', name: 'Samuel Bell', gender: 'M', age: 20, track: 'BEC' },
                    { lrn: '30693001017', name: 'Aria Murphy', gender: 'F', age: 21, track: 'BEC' },
                    { lrn: '30693001018', name: 'Carter Bailey', gender: 'M', age: 22, track: 'BEC' },
                    { lrn: '30693001019', name: 'Victoria Rivera', gender: 'F', age: 20, track: 'BEC' },
                    { lrn: '30693001020', name: 'Owen Cooper', gender: 'M', age: 21, track: 'BEC' },
                ],
                [
                    { lrn: '40693001001', name: 'Mila Richardson', gender: 'F', age: 21, track: 'SPA' },
                    { lrn: '40693001002', name: 'Wyatt Cox', gender: 'M', age: 20, track: 'SPA' },
                    { lrn: '40693001003', name: 'Camila Howard', gender: 'F', age: 22, track: 'SPA' },
                    { lrn: '40693001004', name: 'Julian Ward', gender: 'M', age: 20, track: 'SPA' },
                    { lrn: '40693001005', name: 'Luna Torres', gender: 'F', age: 21, track: 'SPA' },
                    { lrn: '40693001006', name: 'Gabriel Peterson', gender: 'M', age: 22, track: 'SPA' },
                    { lrn: '40693001007', name: 'Nora Gray', gender: 'F', age: 20, track: 'SPA' },
                    { lrn: '40693001008', name: 'Anthony Ramirez', gender: 'M', age: 21, track: 'SPA' },
                    { lrn: '40693001009', name: 'Hazel James', gender: 'F', age: 22, track: 'SPA' },
                    { lrn: '40693001010', name: 'Lincoln Watson', gender: 'M', age: 20, track: 'SPA' },
                    { lrn: '40693001011', name: 'Ellie Brooks', gender: 'F', age: 21, track: 'SPA' },
                    { lrn: '40693001012', name: 'Dylan Kelly', gender: 'M', age: 20, track: 'SPA' },
                    { lrn: '40693001013', name: 'Stella Sanders', gender: 'F', age: 22, track: 'SPA' },
                    { lrn: '40693001014', name: 'Luke Price', gender: 'M', age: 21, track: 'SPA' },
                    { lrn: '40693001015', name: 'Aurora Bennett', gender: 'F', age: 20, track: 'SPA' },
                    { lrn: '40693001016', name: 'Grayson Wood', gender: 'M', age: 22, track: 'SPA' },
                    { lrn: '40693001017', name: 'Violet Barnes', gender: 'F', age: 21, track: 'SPA' },
                    { lrn: '40693001018', name: 'Levi Ross', gender: 'M', age: 20, track: 'SPA' },
                    { lrn: '40693001019', name: 'Savannah Henderson', gender: 'F', age: 22, track: 'SPA' },
                    { lrn: '40693001020', name: 'Hudson Coleman', gender: 'M', age: 21, track: 'SPA' },
                ],
                [
                    { lrn: '50693001001', name: 'Avery Perez', gender: 'F', age: 20, track: 'SPJ' },
                    { lrn: '50693001002', name: 'Samuel Rivera', gender: 'M', age: 21, track: 'SPJ' },
                    { lrn: '50693001003', name: 'Ella Cooper', gender: 'F', age: 22, track: 'SPJ' },
                    { lrn: '50693001004', name: 'Mila Richardson', gender: 'F', age: 20, track: 'SPJ' },
                    { lrn: '50693001005', name: 'Wyatt Cox', gender: 'M', age: 21, track: 'SPJ' },
                    { lrn: '50693001006', name: 'Camila Howard', gender: 'F', age: 22, track: 'SPJ' },
                    { lrn: '50693001007', name: 'Julian Ward', gender: 'M', age: 20, track: 'SPJ' },
                    { lrn: '50693001008', name: 'Luna Torres', gender: 'F', age: 21, track: 'SPJ' },
                    { lrn: '50693001009', name: 'Gabriel Peterson', gender: 'M', age: 22, track: 'SPJ' },
                    { lrn: '50693001010', name: 'Nora Gray', gender: 'F', age: 20, track: 'SPJ' },
                    { lrn: '50693001011', name: 'Anthony Ramirez', gender: 'M', age: 21, track: 'SPJ' },
                    { lrn: '50693001012', name: 'Hazel James', gender: 'F', age: 22, track: 'SPJ' },
                    { lrn: '50693001013', name: 'Lincoln Watson', gender: 'M', age: 20, track: 'SPJ' },
                    { lrn: '50693001014', name: 'Ellie Brooks', gender: 'F', age: 21, track: 'SPJ' },
                    { lrn: '50693001015', name: 'Dylan Kelly', gender: 'M', age: 22, track: 'SPJ' },
                    { lrn: '50693001016', name: 'Stella Sanders', gender: 'F', age: 20, track: 'SPJ' },
                    { lrn: '50693001017', name: 'Luke Price', gender: 'M', age: 21, track: 'SPJ' },
                    { lrn: '50693001018', name: 'Aurora Bennett', gender: 'F', age: 22, track: 'SPJ' },
                    { lrn: '50693001019', name: 'Grayson Wood', gender: 'M', age: 20, track: 'SPJ' },
                    { lrn: '50693001020', name: 'Violet Barnes', gender: 'F', age: 21, track: 'SPJ' },
                ],
                [
                    { lrn: '60693001001', name: 'Levi Ross', gender: 'M', age: 20, track: 'BEC' },
                    { lrn: '60693001002', name: 'Savannah Henderson', gender: 'F', age: 22, track: 'BEC' },
                    { lrn: '60693001003', name: 'Hudson Coleman', gender: 'M', age: 21, track: 'BEC' },
                    { lrn: '60693001004', name: 'Ava Thompson', gender: 'F', age: 20, track: 'BEC' },
                    { lrn: '60693001005', name: 'Liam Johnson', gender: 'M', age: 21, track: 'BEC' },
                    { lrn: '60693001006', name: 'Sophia Lee', gender: 'F', age: 22, track: 'BEC' },
                    { lrn: '60693001007', name: 'Noah Smith', gender: 'M', age: 20, track: 'BEC' },
                    { lrn: '60693001008', name: 'Mia Brown', gender: 'F', age: 21, track: 'BEC' },
                    { lrn: '60693001009', name: 'Lucas Garcia', gender: 'M', age: 22, track: 'BEC' },
                    { lrn: '60693001010', name: 'Isabella Martinez', gender: 'F', age: 20, track: 'BEC' },
                    { lrn: '60693001011', name: 'Mason Davis', gender: 'M', age: 21, track: 'BEC' },
                    { lrn: '60693001012', name: 'Charlotte Wilson', gender: 'F', age: 22, track: 'BEC' },
                    { lrn: '60693001013', name: 'Elijah Anderson', gender: 'M', age: 20, track: 'BEC' },
                    { lrn: '60693001014', name: 'Oliver Moore', gender: 'F', age: 21, track: 'BEC' },
                    { lrn: '60693001015', name: 'Emily Taylor', gender: 'M', age: 22, track: 'BEC' },
                    { lrn: '60693001016', name: 'Jacob Thomas', gender: 'F', age: 20, track: 'BEC' },
                    { lrn: '60693001017', name: 'Madison White', gender: 'M', age: 21, track: 'BEC' },
                    { lrn: '60693001018', name: 'Carter Harris', gender: 'F', age: 22, track: 'BEC' },
                    { lrn: '60693001019', name: 'Ella Martin', gender: 'M', age: 20, track: 'BEC' },
                    { lrn: '60693001020', name: 'Logan Thompson', gender: 'F', age: 21, track: 'BEC' },
                ],
            ],
            dummyLeftListData: [
                [
                    { lrn: '10693001001', name: 'Ava Thompson' },
                    { lrn: '10693001002', name: 'Liam Johnson' },
                    { lrn: '10693001003', name: 'Sophia Lee' },
                    { lrn: '10693001004', name: 'Noah Smith' },
                    { lrn: '10693001005', name: 'Mia Brown' },
                    { lrn: '10693001006', name: 'Lucas Garcia' },
                    { lrn: '10693001007', name: 'Isabella Martinez' },
                    { lrn: '10693001008', name: 'Mason Davis' },
                    { lrn: '10693001009', name: 'Charlotte Wilson' },
                    { lrn: '10693001010', name: 'Elijah Anderson' },
                    { lrn: '10693001011', name: 'Oliver Moore' },
                    { lrn: '10693001012', name: 'Emily Taylor' },
                    { lrn: '10693001013', name: 'Jacob Thomas' },
                    { lrn: '10693001014', name: 'Madison White' },
                    { lrn: '10693001015', name: 'Carter Harris' },
                    { lrn: '10693001016', name: 'Ella Martin' },
                    { lrn: '10693001017', name: 'Logan Thompson' },
                    { lrn: '10693001018', name: 'Grace Clark' },
                    { lrn: '10693001019', name: 'Jackson Lewis' },
                    { lrn: '10693001020', name: 'Scarlett Walker' },
                ],
                [
                    { lrn: '20693001001', name: 'Amelia Clark' },
                    { lrn: '20693001002', name: 'Benjamin Lewis' },
                    { lrn: '20693001003', name: 'Harper Young' },
                    { lrn: '20693001004', name: 'James King' },
                    { lrn: '20693001005', name: 'Evelyn Scott' },
                    { lrn: '20693001006', name: 'Henry Green' },
                    { lrn: '20693001007', name: 'Abigail Adams' },
                    { lrn: '20693001008', name: 'Alexander Baker' },
                    { lrn: '20693001009', name: 'Emily Nelson' },
                    { lrn: '20693001010', name: 'Jack Carter' },
                    { lrn: '20693001011', name: 'Avery Perez' },
                    { lrn: '20693001012', name: 'Samuel Rivera' },
                    { lrn: '20693001013', name: 'Ella Cooper' },
                    { lrn: '20693001014', name: 'Mila Richardson' },
                    { lrn: '20693001015', name: 'Wyatt Cox' },
                    { lrn: '20693001016', name: 'Camila Howard' },
                    { lrn: '20693001017', name: 'Julian Ward' },
                    { lrn: '20693001018', name: 'Luna Torres' },
                    { lrn: '20693001019', name: 'Gabriel Peterson' },
                    { lrn: '20693001020', name: 'Nora Gray' },
                ],
                [
                    { lrn: '30693001001', name: 'Ella Perez' },
                    { lrn: '30693001002', name: 'Logan Roberts' },
                    { lrn: '30693001003', name: 'Scarlett Turner' },
                    { lrn: '30693001004', name: 'William Phillips' },
                    { lrn: '30693001005', name: 'Grace Campbell' },
                    { lrn: '30693001006', name: 'Sebastian Parker' },
                    { lrn: '30693001007', name: 'Chloe Evans' },
                    { lrn: '30693001008', name: 'Daniel Edwards' },
                    { lrn: '30693001009', name: 'Penelope Collins' },
                    { lrn: '30693001010', name: 'Matthew Stewart' },
                    { lrn: '30693001011', name: 'Layla Morris' },
                    { lrn: '30693001012', name: 'David Rogers' },
                    { lrn: '30693001013', name: 'Zoe Reed' },
                    { lrn: '30693001014', name: 'Joseph Cook' },
                    { lrn: '30693001015', name: 'Lily Morgan' },
                    { lrn: '30693001016', name: 'Samuel Bell' },
                    { lrn: '30693001017', name: 'Aria Murphy' },
                    { lrn: '30693001018', name: 'Carter Bailey' },
                    { lrn: '30693001019', name: 'Victoria Rivera' },
                    { lrn: '30693001020', name: 'Owen Cooper' },
                ],
                [
                    { lrn: '40693001001', name: 'Mila Richardson' },
                    { lrn: '40693001002', name: 'Wyatt Cox' },
                    { lrn: '40693001003', name: 'Camila Howard' },
                    { lrn: '40693001004', name: 'Julian Ward' },
                    { lrn: '40693001005', name: 'Luna Torres' },
                    { lrn: '40693001006', name: 'Gabriel Peterson' },
                    { lrn: '40693001007', name: 'Nora Gray' },
                    { lrn: '40693001008', name: 'Anthony Ramirez' },
                    { lrn: '40693001009', name: 'Hazel James' },
                    { lrn: '40693001010', name: 'Lincoln Watson' },
                    { lrn: '40693001011', name: 'Ellie Brooks' },
                    { lrn: '40693001012', name: 'Dylan Kelly' },
                    { lrn: '40693001013', name: 'Stella Sanders' },
                    { lrn: '40693001014', name: 'Luke Price' },
                    { lrn: '40693001015', name: 'Aurora Bennett' },
                    { lrn: '40693001016', name: 'Grayson Wood' },
                    { lrn: '40693001017', name: 'Violet Barnes' },
                    { lrn: '40693001018', name: 'Levi Ross' },
                    { lrn: '40693001019', name: 'Savannah Henderson' },
                    { lrn: '40693001020', name: 'Hudson Coleman' },
                ],
                [
                    { lrn: '50693001001', name: 'Avery Perez' },
                    { lrn: '50693001002', name: 'Samuel Rivera' },
                    { lrn: '50693001003', name: 'Ella Cooper' },
                    { lrn: '50693001004', name: 'Mila Richardson' },
                    { lrn: '50693001005', name: 'Wyatt Cox' },
                    { lrn: '50693001006', name: 'Camila Howard' },
                    { lrn: '50693001007', name: 'Julian Ward' },
                    { lrn: '50693001008', name: 'Luna Torres' },
                    { lrn: '50693001009', name: 'Gabriel Peterson' },
                    { lrn: '50693001010', name: 'Nora Gray' },
                    { lrn: '50693001011', name: 'Anthony Ramirez' },
                    { lrn: '50693001012', name: 'Hazel James' },
                    { lrn: '50693001013', name: 'Lincoln Watson' },
                    { lrn: '50693001014', name: 'Ellie Brooks' },
                    { lrn: '50693001015', name: 'Dylan Kelly' },
                    { lrn: '50693001016', name: 'Stella Sanders' },
                    { lrn: '50693001017', name: 'Luke Price' },
                    { lrn: '50693001018', name: 'Aurora Bennett' },
                    { lrn: '50693001019', name: 'Grayson Wood' },
                    { lrn: '50693001020', name: 'Violet Barnes' },
                ],
                [
                    { lrn: '60693001001', name: 'Levi Ross' },
                    { lrn: '60693001002', name: 'Savannah Henderson' },
                    { lrn: '60693001003', name: 'Hudson Coleman' },
                    { lrn: '60693001004', name: 'Ava Thompson' },
                    { lrn: '60693001005', name: 'Liam Johnson' },
                    { lrn: '60693001006', name: 'Sophia Lee' },
                    { lrn: '60693001007', name: 'Noah Smith' },
                    { lrn: '60693001008', name: 'Mia Brown' },
                    { lrn: '60693001009', name: 'Lucas Garcia' },
                    { lrn: '60693001010', name: 'Isabella Martinez' },
                    { lrn: '60693001011', name: 'Mason Davis' },
                    { lrn: '60693001012', name: 'Charlotte Wilson' },
                    { lrn: '60693001013', name: 'Elijah Anderson' },
                    { lrn: '60693001014', name: 'Oliver Moore' },
                    { lrn: '60693001015', name: 'Emily Taylor' },
                    { lrn: '60693001016', name: 'Jacob Thomas' },
                    { lrn: '60693001017', name: 'Madison White' },
                    { lrn: '60693001018', name: 'Carter Harris' },
                    { lrn: '60693001019', name: 'Ella Martin' },
                    { lrn: '60693001020', name: 'Logan Thompson' },
                ],
            ],
        };
    },
    methods: {
        setTab(tab) {
            this.activeTab = tab;
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
        handleEnter(idx) {
            this.showBlankView(idx);
        },
        backFromDetail() {
            this.showGrade7Detail = false;
            this.showBlank = false;
        },
    },
    computed: {
        filteredTableData() {
            let filteredData = this.dummyTableData[this.enteredIdx];
            
            // Apply gender filter
            if (this.rightGender && this.rightGender !== "") {
                filteredData = filteredData.filter(row => row.gender === this.rightGender);
            }
            
            // Apply search filter
            if (this.rightSearch) {
                const searchTerm = this.rightSearch.toLowerCase();
                filteredData = filteredData.filter(row => 
                    row.name.toLowerCase().includes(searchTerm) || 
                    row.lrn.toLowerCase().includes(searchTerm)
                );
            }
            
            return filteredData;
        }
    },
};
</script>

<style scoped>
.grade7-detail-container {
    min-height: 400px;
}

.detail-content {
    margin-top: 24px;
}

.dropdown-row {
    display: flex;
    gap: 24px;
    margin-bottom: 24px;
    background-color: #FFFFFF;
    padding: 30px;
    border: 0.5px solid #EEEEEE;
    border-radius: 5px;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.07);
}

.dropdown-item {
    min-width: 200px;
}

.curriculum-box {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
}

.curriculum-label {
    position: absolute;
    top: -8px;
    left: 16px;
    background-color: #fff;
    color: #292929;
    font-size: 13px;
    padding: 0 8px;
    pointer-events: none;
    font-weight: 500;
}

.curriculum-value {
    font-weight: bold;
    font-size: 16px;
    color: #242424;
    border: 1px solid #E3E9EC;
    border-radius: 6px;
    padding: 8px 16px;
    background: #fff;
}

.detail-placeholder {
    min-height: 200px;
    background: #f9f9f9;
    border-radius: 8px;
    margin-top: 32px;

}

.custom-select {
    width: 180px;
    padding: 8px 12px;
    border: 1px solid #E3E9EC;
    border-radius: 6px;
    background: #fff;
    font-size: 16px;
    color: #242424;
    font-weight: 500;

}

.add-teacher-btn-container {
    display: flex;
    align-items: flex-end;
    margin-left: auto;
}

.add-teacher-btn {
    background: #295F98;
    color: #fff;
    font-size: 16px;
    font-weight: 400;
    border: none;
    border-radius: 6px;
    padding: 10px 25px;
    cursor: pointer;
    transition: background 0.2s;
}

.add-teacher-btn:hover {
    background: #1d4066;
}

.dummy-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 16px;
    background: #fff;
}

.dummy-table th,
.dummy-table td {
    /* border: 1px solid #e0e0e0; */
    padding: 8px 12px;
    text-align: left;
}

.dummy-table th {
    background: #F6F6F6;
    font-weight: 600;
}

.dummy-table td {
    cursor: pointer;
}

.dummy-table tbody tr:hover {
    background: #e0e0e0;
}

.detail-flex {
    display: flex;
    gap: 24px;
    margin-bottom: 20px;
}

.left-panel {
    background: #fff;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
    width: 410px;
    min-width: 280px;
    display: flex;
    flex-direction: column;
    padding: 16px 12px 12px 12px;
}

.left-dropdown-row {
    margin-bottom: 8px;
}

.left-select {
    width: 35%;
    padding: 6px 10px;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    font-size: 15px;
    color: #242424;
    background: #fff;
}

.left-list {
    flex: 1;
    overflow-y: auto;
    max-height: 600px;
    margin-bottom: 12px;
    border-radius: 4px;
    border: 1px solid #e0e0e0;
    background: #fafbfc;
    padding: 4px 0;
    cursor: pointer;
}

.left-list-row:hover {
    background: #e0e0e0;
}

.left-list-row {
    display: flex;
    align-items: center;
    padding: 6px 8px;
    border-bottom: 1px solid #f0f0f0;
    font-size: 14px;
    color: #222;
    gap: 40px;
}

.left-list-row:last-child {
    border-bottom: none;
}

.left-lrn {
    margin-left: 5px;
    width: 90px;
    font-weight: 500;
}

.left-name {
    flex: 1;
    margin-left: -5px;
    font-weight: 500;
}

.left-arrow {
    margin-right: 8px;
    font-size: 18px;
    color: #222;
}

.left-submit {
    margin-top: 8px;
    width: 30%;
    background: #295F98;
    color: #fff;
    border: none;
    border-radius: 6px;
    padding: 8px 0;
    font-size: 15px;
    cursor: pointer;
    transition: background 0.2s;
    display: block;
    margin-left: auto;
}

.left-submit:hover {
    background: #1d4066;
}

.right-panel {
    flex: 1;
    background: #fff;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
    padding: 16px 18px 18px 18px;
    display: flex;
    flex-direction: column;
    /* height: 100%; */
    min-width: 0;
}

.right-controls {
    display: flex;
    align-items: center;
    gap: 12px;
}

.right-select {
    width: 130px;
    padding: 6px 10px;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    font-size: 15px;
    color: #242424;
    background: #fff;
}

.right-search {
    width: 220px;
    margin-left: auto;
    display: flex;
    align-items: center;
    background: #fafbfc;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    padding: 0 8px;
    height: 36px;
}

.right-search input {
    border: none;
    outline: none;
    background: transparent;
    width: 100%;
    font-size: 15px;
    color: #222;
}

.right-table-container {
    flex: 1;
    overflow-y: auto;
    margin-bottom: 10px;
    max-height: 600px;
    position: relative;
}

.no-results {
    text-align: center;
    color: #666;
    font-size: 15px;
    padding: 20px 0;
    background: #fff;
    border-bottom: 1px solid #e0e0e0;
}

.right-select-btn {
    margin-top: 8px;
    align-self: flex-end;
    background: #295F98;
    color: #fff;
    border: none;
    border-radius: 6px;
    padding: 8px 22px;
    font-size: 15px;
    cursor: pointer;
    transition: background 0.2s;
}

.right-select-btn:hover {
    background: #1d4066;
}

.search-icon {
    width: 18px;
    height: 18px;
    margin-left: 5px;
    margin-right: 5px;
    opacity: 0.7;
}
</style>
