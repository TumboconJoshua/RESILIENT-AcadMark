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

            <div v-else class="submitted-section">
                <!-- Filter Bar -->
                <div class="flex flex-row gap-4 items-center bg-white p-6 border border-[#EEEEEE] rounded-[5px] shadow mb-6">
                    <Dropdown v-model="selectedSubmittedGrade" :options="gradeOptions" placeholder="Select Grade" customClass="w-[180px] p-2 border border-[#E3E9EC] rounded-[6px] bg-white text-base text-[#242424] font-medium" />
                    <Dropdown v-model="selectedSubmittedCurriculum" :options="curriculumOptions" placeholder="Select Curriculum" customClass="w-[180px] p-2 border border-[#E3E9EC] rounded-[6px] bg-white text-base text-[#242424] font-medium" />
                    <Dropdown v-model="selectedSubmittedTrack" :options="trackOptions" placeholder="Select Track" customClass="w-[180px] p-2 border border-[#E3E9EC] rounded-[6px] bg-white text-base text-[#242424] font-medium" />
                    <Dropdown v-model="selectedSubmittedStatus" :options="statusOptions" placeholder="Select Status" customClass="w-[180px] p-2 border border-[#E3E9EC] rounded-[6px] bg-white text-base text-[#242424] font-medium" />
                    <div class="flex items-center w-[220px] ml-auto bg-[#fafbfc] border border-[#e0e0e0] rounded-[6px] px-2 h-10">
                        <img src="/assets/img/search-icon.svg" alt="search" class="w-5 h-5 mx-1 opacity-70" />
                        <input type="text" v-model="rightSearch" placeholder="Search..." class="bg-transparent border-none outline-none w-full text-[15px] text-gray-700" />
                    </div>
                </div>

                <!-- Table -->
                <div class="bg-white rounded-lg shadow border border-gray-200 overflow-x-auto mb-4">
                    <table class="min-w-[900px] w-full border-collapse table-fixed">
                        <thead>
                            <tr>
                                <th class="bg-[#f6f6f6] font-semibold text-[#222] text-[16px] text-center px-3 py-2">Grade Level</th>
                                <th class="bg-[#f6f6f6] font-semibold text-[#222] text-[16px] text-center px-3 py-2">Curriculum</th>
                                <th class="bg-[#f6f6f6] font-semibold text-[#222] text-[16px] text-center px-3 py-2">Track</th>
                                <th class="bg-[#f6f6f6] font-semibold text-[#222] text-[16px] text-center px-3 py-2">Class Section</th>
                                <th class="bg-[#f6f6f6] font-semibold text-[#222] text-[16px] text-center px-3 py-2">Class Adviser</th>
                                <th class="bg-[#f6f6f6] font-semibold text-[#222] text-[16px] text-center px-3 py-2">Student Added</th>
                                <th class="bg-[#f6f6f6] font-semibold text-[#222] text-[16px] text-center px-3 py-2">Date Added</th>
                                <th class="bg-[#f6f6f6] font-semibold text-[#222] text-[16px] text-center px-3 py-2">STATUS</th>
                            </tr>
                        </thead>
                    </table>
                    <div class="max-h-[400px] overflow-y-auto w-full">
                        <table class="min-w-[900px] w-full border-collapse table-fixed">
                            <tbody>
                                <tr v-for="(row, idx) in filteredSubmittedRows" :key="idx" class="border-b border-[#e0e0e0]">
                                    <td class="text-[14px] text-center px-3 py-2 text-[#222]">{{ row.grade }}</td>
                                    <td class="text-[14px] text-center px-3 py-2 text-[#222]">{{ row.curriculum }}</td>
                                    <td class="text-[14px] text-center px-3 py-2 text-[#222]">{{ row.track }}</td>
                                    <td class="text-[14px] text-center px-3 py-2 text-[#222]">{{ row.section }}</td>
                                    <td class="adviser-cell cursor-pointer text-[#222] underline text-[14px] text-center px-3 py-2" @click="openClassInfoModal(row)">{{ row.adviser }}</td>
                                    <td class="text-[14px] text-center px-3 py-2 text-[#222]">{{ row.students }}</td>
                                    <td class="text-[14px] text-center px-3 py-2 text-[#222]">{{ row.date }}</td>
                                    <td class="text-[14px] text-center px-3 py-2">
                                        <span
                                            :class="[
                                                'inline-block min-w-[90px] text-center py-1 rounded-lg text-[12px] text-white',
                                                row.status === 'Pending' ? 'bg-[#ff9800]' : '',
                                                row.status === 'Accepted' ? 'bg-[#4caf50]' : '',
                                                row.status === 'Not Accepted' ? 'bg-[#f44336]' : ''
                                            ]"
                                        >
                                            {{ row.status }}
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </template>
        <template v-else-if="showGrade7Detail">
            <div class="min-h-[400px]">
                <button @click="backFromDetail" class="flex items-center mt-2 ml-2">
                    <span class="ml-1 text-lg text-[30px] text-[#242424] cursor-pointer">
                        < </span>
                            <span class="ml-1 text-lg font-semibold text-[#242424] underline cursor-pointer">Back</span>
                </button>
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
                                class="absolute -top-2 left-4 bg-white text-[#292929] text-sm px-2 pointer-events-none font-medium">Track</label>
                            <select v-model="selectedTrack"
                                class="w-[180px] p-2 border border-[#E3E9EC] rounded-[6px] bg-white text-base text-[#242424] font-medium">
                                <option value="SPA">SPA</option>
                                <option value="SPJ">SPJ</option>
                                <option value="BEC">BEC</option>
                            </select>
                        </div>
                        <div class="min-w-[200px] relative flex flex-col justify-end">
                            <label
                                class="absolute -top-2 left-4 bg-white text-[#292929] text-sm px-2 pointer-events-none font-medium">Class
                                Section</label>
                            <select v-model="selectedClassSection"
                                class="w-[180px] p-2 border border-[#E3E9EC] rounded-[6px] bg-white text-base text-[#242424] font-medium">
                                <option value="Einstein">Einstein</option>
                                <option value="Einstein2">Einstein</option>
                                <option value="Einstein3">Einstein</option>
                                <option value="Einstein4">Einstein</option>
                            </select>
                        </div>
                        <div class="flex items-end ml-auto">
                            <button
                                class="bg-[#295F98] text-white text-base font-normal border-none rounded-[6px] px-[25px] py-[10px] cursor-pointer transition-colors duration-200 hover:bg-[#1d4066]"
                                @click="openAddTeacherModal">Add Teacher</button>
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
                                    class="flex-1 overflow-y-auto max-h-[600px] mb-3 rounded-[4px] border border-[#e0e0e0] bg-[#fafbfc] p-1 cursor-pointer">
                                    <div v-for="row in dummyLeftListData[enteredIdx]" :key="row.lrn"
                                        class="flex items-center p-[6px_8px] border-b border-[#f0f0f0] text-sm text-[#222] gap-10 hover:bg-[#e0e0e0]">
                                        <span class="ml-[5px] w-[90px] font-medium">{{ row.lrn }}</span>
                                        <span class="flex-1 -ml-[5px] font-medium">{{ row.name }}</span>
                                        <span class="mr-2 text-lg text-[#222]">&#x21ba;</span>
                                    </div>
                                </div>
                                <button
                                    class="mt-2 w-[30%] bg-[#295F98] text-white border-none rounded-[6px] py-2 text-[15px] cursor-pointer transition-colors duration-200 hover:bg-[#1d4066] block ml-auto">Submit</button>
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
                                                <th v-if="showCheckboxes"></th>
                                                <th class="bg-[#F6F6F6] font-semibold p-2 text-left">LRN</th>
                                                <th class="bg-[#F6F6F6] font-semibold p-2 text-left">FULL NAME</th>
                                                <th class="bg-[#F6F6F6] font-semibold p-2 text-left">GENDER</th>
                                                <th class="bg-[#F6F6F6] font-semibold p-2 text-left">Age</th>
                                                <th class="bg-[#F6F6F6] font-semibold p-2 text-left">Track</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <template v-if="filteredTableData.length > 0">
                                                <tr v-for="row in filteredTableData" :key="row.lrn"
                                                    class="hover:bg-[#e0e0e0] cursor-pointer">
                                                    <td v-if="showCheckboxes"><input type="checkbox" /></td>
                                                    <td class="p-2 text-left">{{ row.lrn }}</td>
                                                    <td class="p-2 text-left">{{ row.name }}</td>
                                                    <td class="p-2 text-left">{{ row.gender }}</td>
                                                    <td class="p-2 text-left">{{ row.age }}</td>
                                                    <td class="p-2 text-left">{{ row.track }}</td>
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
                                <button
                                    class="mt-2 self-end bg-[#295F98] text-white border-none rounded-[6px] px-[22px] py-2 text-[15px] cursor-pointer transition-colors duration-200 hover:bg-[#1d4066]"
                                    @click="showCheckboxes = !showCheckboxes">Select Students</button>
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
    <div v-if="showAddTeacherModal" class="fixed inset-0 bg-black/20 z-[9999] flex items-center justify-center"
        @click.self="closeAddTeacherModal">
        <div
            class="bg-white shadow-[0_4px_32px_0_rgba(0,0,0,0.18)] w-[850px] h-[620px] p-[38px_38px_24px_38px] relative flex flex-col">
            <h2 class="text-[1.5rem] font-bold text-[#295F98] mb-7">Add Class Teacher</h2>
            <div class="mb-[22px]">
                <div class="text-[#295F98] text-[1rem] font-semibold mb-2">Advisory Teacher</div>
                <div class="flex gap-[22px] mb-2 justify-between">
                    <Dropdown :options="subjectOptions" placeholder="Subjects"
                        customClass="min-w-[240px] h-[48px] px-[12px] border border-[#E3E9EC] rounded-[6px] bg-white text-[1rem] text-[#242424] font-medium" />
                    <select
                        class="min-w-[240px] h-[48px] px-[12px] border border-[#E3E9EC] rounded-[6px] bg-white text-[1rem] text-[#242424] font-medium"
                        v-model="selectedAdviser">
                        <option value="" disabled selected>Adviser Name</option>
                        <option v-for="adviser in advisers" :key="adviser.id" :value="adviser.name">
                            {{ adviser.name }}
                        </option>
                    </select>
                    <div class="flex flex-col relative">
                        <label
                            class="absolute bg-white text-[14px] text-[#292929] font-medium mt-[-10px] mb-1 ml-[10px] px-[5px]">Employee
                            ID</label>
                        <input
                            class="min-w-[240px] h-[48px] px-[12px] border border-[#E3E9EC] rounded-[6px] bg-white text-[1rem] text-[#242424] font-medium"
                            placeholder="Auto Fill" :value="adviserIdByName(selectedAdviser)" readonly />
                    </div>
                </div>
            </div>
            <div class="mb-[22px]">
                <div class="text-[#295F98] text-[1rem] font-semibold mb-2">Subject Teacher</div>
                <div class="flex gap-[22px] mb-2 justify-between">
                    <Dropdown :options="subjectOptions" placeholder="Subjects"
                        customClass="min-w-[240px] h-[48px] px-[12px] border border-[#E3E9EC] rounded-[6px] bg-white text-[1rem] text-[#242424] font-medium" />
                    <select
                        class="min-w-[240px] h-[48px] px-[12px] border border-[#E3E9EC] rounded-[6px] bg-white text-[1rem] text-[#242424] font-medium"
                        v-model="selectedSubjectAdviser">
                        <option value="" disabled selected>Adviser Name</option>
                        <option v-for="adviser in advisers" :key="adviser.id + '-subject'" :value="adviser.name">
                            {{ adviser.name }}
                        </option>
                    </select>
                    <div class="flex flex-col relative">
                        <label
                            class="absolute bg-white text-[14px] text-[#292929] font-medium mt-[-10px] mb-1 ml-[10px] px-[5px]">Employee
                            ID</label>
                        <input
                            class="min-w-[240px] h-[48px] px-[12px] border border-[#E3E9EC] rounded-[6px] bg-white text-[1rem] text-[#242424] font-medium"
                            placeholder="Auto Fill" :value="adviserIdByName(selectedSubjectAdviser)" readonly />
                    </div>
                </div>
            </div>
            <button
                class="w-full bg-[#295F98] text-white text-[2rem] border-none rounded px-0 py-1 mt-[18px] mb-[18px] cursor-pointer transition-colors duration-200 hover:bg-[#1d4066]">+</button>
            <div class="flex justify-end gap-[18px] mt-[120px]">
                <button
                    class="bg-[#BFC3C8] text-white text-[1rem] font-medium border-none rounded-[6px] px-8 py-[10px] cursor-pointer transition-colors duration-200 hover:bg-[#a0a4a8]"
                    @click="closeAddTeacherModal">Cancel</button>
                <button
                    class="bg-[#295F98] text-white text-[1rem] font-medium border-none rounded-[6px] px-8 py-[10px] cursor-pointer transition-colors duration-200 shadow-[0_2px_4px_0_rgba(41,95,152,0.08)] hover:bg-[#1d4066]">Add
                    Faculty(s)</button>
            </div>
        </div>
    </div>
    <div v-if="showClassInfoModal" class="fixed inset-0 bg-black/20 z-[9999] flex items-center justify-center" @click.self="closeClassInfoModal">
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
            <textarea class="w-full h-[120px] border border-[#295F98] rounded-lg p-3 text-[15px] mb-6 resize-none"></textarea>
            <div class="flex justify-end">
                <button @click="closeClassInfoModal" class="bg-[#888] text-white px-8 py-2 rounded transition hover:bg-[#444] cursor-pointer">Close</button>
            </div>
        </div>
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
            showAddTeacherModal: false,
            subjectOptions: [
                { value: 'Math', label: 'Math' },
                { value: 'Science', label: 'Science' },
                { value: 'English', label: 'English' },
                { value: 'Filipino', label: 'Filipino' },
                { value: 'Araling Panlipunan', label: 'Araling Panlipunan' },
                { value: 'MAPEH', label: 'MAPEH' },
                { value: 'TLE', label: 'TLE' },
                { value: 'EPP', label: 'EPP' },
                { value: 'ESP', label: 'ESP' },
            ],
            advisers: [
                { name: 'Polaris Jumel Dasmarinas', id: 'EMP-001' },
                { name: 'Joshua Ralph Solomon', id: 'EMP-002' },
                { name: 'Harvey Samson', id: 'EMP-003' }
            ],
            selectedAdviser: '',
            selectedSubjectAdviser: '',
            gradeOptions: [
                { value: 'Grade 7', label: 'Grade 7' },
                { value: 'Grade 8', label: 'Grade 8' },
                { value: 'Grade 9', label: 'Grade 9' },
                { value: 'Grade 10', label: 'Grade 10' },
                { value: 'Grade 11', label: 'Grade 11' },
                { value: 'Grade 12', label: 'Grade 12' }
            ],
            curriculumOptions: [
                { value: 'Junior High School', label: 'Junior High School' },
                { value: 'Senior High School', label: 'Senior High School' }
            ],
            trackOptions: [
                { value: 'SPA', label: 'SPA' },
                { value: 'SPJ', label: 'SPJ' },
                { value: 'BEC', label: 'BEC' }
            ],
            statusOptions: [
                { value: 'Pending', label: 'Pending' },
                { value: 'Accepted', label: 'Accepted' },
                { value: 'Not Accepted', label: 'Not Accepted' }
            ],
            submittedRows: [
                {
                    grade: '7',
                    curriculum: 'Junior High School',
                    track: 'SPA',
                    section: 'Einstein',
                    adviser: 'Joshua Ralph Xander Jumel Solomon',
                    students: 10,
                    date: '04/01/25',
                    status: 'Pending'
                },
                {
                    grade: '7',
                    curriculum: 'Junior High School',
                    track: 'SPA',
                    section: 'Einstein',
                    adviser: 'Joshua Ralph Xander Jumel Solomon',
                    students: 42,
                    date: '04/01/25',
                    status: 'Accepted'
                },
                {
                    grade: '7',
                    curriculum: 'Junior High School',
                    track: 'SPA',
                    section: 'Einstein',
                    adviser: 'Joshua Ralph Xander Jumel Solomon',
                    students: 42,
                    date: '04/01/25',
                    status: 'Not Accepted'
                },
                {
                    grade: '7',
                    curriculum: 'Junior High School',
                    track: 'SPA',
                    section: 'Einstein',
                    adviser: 'Joshua Ralph Xander Jumel Solomon',
                    students: 42,
                    date: '04/01/25',
                    status: 'Not Accepted'
                },
                {
                    grade: '7',
                    curriculum: 'Junior High School',
                    track: 'SPA',
                    section: 'Einstein',
                    adviser: 'Joshua Ralph Xander Jumel Solomon',
                    students: 42,
                    date: '04/01/25',
                    status: 'Not Accepted'
                },
                {
                    grade: '7',
                    curriculum: 'Junior High School',
                    track: 'SPA',
                    section: 'Einstein',
                    adviser: 'Joshua Ralph Xander Jumel Solomon',
                    students: 42,
                    date: '04/01/25',
                    status: 'Not Accepted'
                },
                {
                    grade: '7',
                    curriculum: 'Junior High School',
                    track: 'SPA',
                    section: 'Einstein',
                    adviser: 'Joshua Ralph Xander Jumel Solomon',
                    students: 42,
                    date: '04/01/25',
                    status: 'Not Accepted'
                },
            ],
            selectedSubmittedGrade: '',
            selectedSubmittedCurriculum: '',
            selectedSubmittedTrack: '',
            selectedSubmittedStatus: '',
            showClassInfoModal: false,
            selectedClassInfo: null,
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
        openAddTeacherModal() {
            this.showAddTeacherModal = true;
        },
        closeAddTeacherModal() {
            this.showAddTeacherModal = false;
            this.selectedAdviser = '';
            this.selectedSubjectAdviser = '';
        },
        adviserIdByName(name) {
            const adviser = this.advisers.find(a => a.name === name);
            return adviser ? adviser.id : '';
        },
        openClassInfoModal(row) {
            this.selectedClassInfo = row;
            this.showClassInfoModal = true;
        },
        closeClassInfoModal() {
            this.showClassInfoModal = false;
            this.selectedClassInfo = null;
        },
    },
    computed: {
        filteredTableData() {
            let filteredData = this.dummyTableData[this.enteredIdx];

            // Apply gender filter
            if (this.rightGender && this.rightGender !== "" && this.rightGender !== "All") {
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
        },
        filteredSubmittedRows() {
            const selectedGrade = typeof this.selectedSubmittedGrade === 'object' ? this.selectedSubmittedGrade?.value : this.selectedSubmittedGrade;
            const selectedCurriculum = typeof this.selectedSubmittedCurriculum === 'object' ? this.selectedSubmittedCurriculum?.value : this.selectedSubmittedCurriculum;
            const selectedTrack = typeof this.selectedSubmittedTrack === 'object' ? this.selectedSubmittedTrack?.value : this.selectedSubmittedTrack;
            const selectedStatus = typeof this.selectedSubmittedStatus === 'object' ? this.selectedSubmittedStatus?.value : this.selectedSubmittedStatus;
            const search = this.rightSearch ? this.rightSearch.toLowerCase() : '';

            return this.submittedRows.filter(row => {
                const gradeMatch = !selectedGrade || row.grade === selectedGrade;
                const curriculumMatch = !selectedCurriculum || row.curriculum === selectedCurriculum;
                const trackMatch = !selectedTrack || row.track === selectedTrack;
                const statusMatch = !selectedStatus || row.status === selectedStatus;
                const searchMatch = !search ||
                    row.curriculum.toLowerCase().includes(search) ||
                    row.track.toLowerCase().includes(search) ||
                    row.section.toLowerCase().includes(search) ||
                    row.adviser.toLowerCase().includes(search);
                return gradeMatch && curriculumMatch && trackMatch && statusMatch && searchMatch;
            });
        }
    },
};
</script>
