<template>
    <div class="flex flex-col overflow-hidden">
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
            <div v-for="grade in grades" :key="grade.mainTitle"
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
                    <div class="absolute top-[15px] right-[-55px] flex items-start justify-end pointer-events-none z-0">
                        <img src="/assets/img/logo.png" alt="School Logo"
                            class="w-[190px] h-[190px] object-contain opacity-50 pointer-events-none" />
                    </div>
                </div>

                <div class="bg-[#295F98] rounded-b-[12px] flex justify-between items-center px-5 py-3 mt-[18px] z-10">
                    <span class="text-white font-semibold text-base">Manage Class</span>
                    <button
                        class="bg-[#295F98] text-white border border-white rounded-lg px-6 py-1.5 text-base font-medium cursor-pointer transition-colors duration-200 hover:bg-white hover:text-[#295F98] hover:border-white">
                        Enter
                    </button>
                </div>
            </div>
        </div>

        <div v-else class="grid grid-cols-3 gap-8 my-8 min-h-[200px]"></div>
    </div>
</template>


<script>
export default {
    name: 'Dasboard',
    data() {
        return {
            activeTab: 'add',
            grades: [
                { mainTitle: 'Grade 7', subTitle: 'Junior High School', studentCount: '100 Total Students' },
                { mainTitle: 'Grade 8', subTitle: 'Junior High School', studentCount: '100 Total Students' },
                { mainTitle: 'Grade 9', subTitle: 'Junior High School', studentCount: '100 Total Students' },
                { mainTitle: 'Grade 10', subTitle: 'Junior High School', studentCount: '100 Total Students' },
                { mainTitle: 'Grade 11', subTitle: 'Senior High School', studentCount: '100 Total Students' },
                { mainTitle: 'Grade 12', subTitle: 'Senior High School', studentCount: '100 Total Students' },
            ],
        };
    },
    methods: {
        setTab(tab) {
            this.activeTab = tab;
        },
    },
};
</script>

<!-- <style scoped>
.container {
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.card-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
    margin-top: 32px;
    margin-bottom: 32px;
}

.card-grid.blank {
    min-height: 200px;
}

.custom-card {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.10);
    border: 1px solid #e0e0e0;
    padding: 0;
    display: flex;
    flex-direction: column;
    min-width: 300px;
    max-width: 360px;
    min-height: 180px;
    position: relative;
    overflow: hidden;
}

.custom-card-content {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    padding: 24px 20px 0 20px;
}

.custom-card-info {
    flex: 1;
}

.custom-card-title {
    font-size: 35.2px;
    font-weight: 700;
    color: #295F98;
    margin-bottom: 4px;
}

.custom-card-sub {
    font-size: 17.6px;
    color: #295F98;
    margin-bottom: 2px;
}

.custom-card-students {
    font-size: 16px;
    color: #295F98;
    font-weight: 400;
    font-style: italic;
}

.custom-card-logo {
    position: absolute;
    top: 15px;
    right: -55px;
    margin: 0;
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
    pointer-events: none;
    z-index: 0;
}

.custom-card-logo img {
    width: 190px;
    height: 190px;
    object-fit: contain;
    opacity: 0.5;
    pointer-events: none;
}

.custom-card-footer {
    background: #295F98;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 20px;
    margin-top: 18px;
    z-index: 1;
}

.custom-card-manage {
    color: #fff;
    font-weight: 600;
    font-size: 16px;
}

.custom-card-enter {
    background: #295F98;
    color: #fff;
    border: 1px solid #fff;
    border-radius: 8px;
    padding: 6px 24px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
}

.custom-card-enter:hover {
    background: #fff;
    color: #295F98;
    border: 1px solid #fff;
}
</style> -->