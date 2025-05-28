<template>
    <div class="w-full">
        <div v-if="selectedCard">
            <StudentList :selectedCard="selectedCard" @goBack="selectedCard = null" />
        </div>
        <div v-else>
           <div class="flex items-center space-x-6 mb-6">
                <h1 class="text-5xl font-bold text-[#295f98]">Masterlist</h1>
            </div>

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
                <!-- Filters -->
                <div class="filters flex flex-wrap gap-4 mb-6">
                    <select v-model="selectedGrade" class="filter-dropdown border border-gray-300 rounded-lg p-3">
                        <option value="">Grade Level</option>
                        <option v-for="grade in grades" :key="grade" :value="grade">
                            Grade {{ grade }}
                        </option>
                    </select>

                    <select v-model="selectedCurriculum" class="filter-dropdown border border-gray-300 rounded-lg p-3">
                        <option value="">Curriculum</option>
                        <option v-for="curriculum in curriculums" :key="curriculum" :value="curriculum">
                            {{ getSchoolLevel(curriculum) }}
                        </option>
                    </select>

                    <select v-model="selectedTrack" class="filter-dropdown border border-gray-300 rounded-lg p-3">
                        <option value="">Track</option>
                        <option v-for="track in tracks" :key="track" :value="track">
                            {{ track }}
                        </option>
                    </select>
                </div>
                
                <!-- Cards Grid -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                    <div v-for="(card, index) in filteredCards" :key="index"
                        class="rounded-xl shadow-lg border border-gray-300 overflow-hidden cursor-pointer transition-transform hover:scale-105"
                        @click="handleCardClick(card)">
                        <!-- Curriculum Background Color -->
                        <div
                            :class="['py-3 px-4 text-center font-semibold', getStatusBgClass(card.Status), 'text-white']">
                            {{ getSchoolLevel(card.Curriculum) }}
                        </div>

                        <div class="bg-white p-6 relative pb-20">
                            <div class="relative z-10 mt-[-17px]">
                                <!-- Grade Level Color -->
                                <h2 :class="['text-5xl font-bold mb-2', getStatusTextClass(card.Status)]">
                                    Grade {{ card.Grade_Level }}
                                </h2>

                                <!-- Track & Section Color -->
                                <p :class="['text-lg font-semibold', getStatusTextClass(card.Status)]">
                                    {{ card.Track }} – {{ card.Section }}
                                </p>
                            </div>

                            <div class="absolute top-0 right-0 w-full h-full overflow-hidden">
                                <img src="/assets/img/logo.png" alt="School Logo"
                                    class="opacity-40 h-40 absolute top-10 right-[-40px]" />
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Cards Grid -->



            </div>
        </div>
    </div>
</template>

<script>
import StudentList from '@/views/admin/MasterList/StudentList.vue';
import { getClassesExcludingIncomplete } from '@/service/teacherSubjectsService';

export default {
    name: 'Masterlist',
    components: {
        StudentList,
    },
    data() {
        return {
            loading: true,
            error: null,
            selectedCard: null,
            selectedGrade: '',
            selectedCurriculum: '',
            selectedTrack: '',
            grades: ['7', '8', '9', '10'],
            curriculums: ['JHS', 'SHS'],
            tracks: ['STEM', 'ABM', 'BEC'],
            cards: []
        };
    },
    computed: {
        filteredCards() {
            return this.cards.filter((card) => {
                return (
                    (!this.selectedGrade || card.Grade_Level === this.selectedGrade) &&
                    (!this.selectedCurriculum || card.Curriculum === this.selectedCurriculum) &&
                    (!this.selectedTrack || card.Track === this.selectedTrack)
                );
            });
        },
    },
    methods: {
        async fetchAcceptedClasses() {
            try {
                const classes = await getClassesExcludingIncomplete();
                this.cards = classes;
                console.log("CARDS", classes);
            } catch (error) {
                this.error = error.message || 'Failed to fetch classes';
                console.error('Error fetching accepted classes:', error);
            } finally {
                this.loading = false;
            }
        },
        handleCardClick(card) {
            this.selectedCard = card;
            console.log("SENT:", this.selectedCard);
        },
        getSchoolLevel(curriculum) {
            if (curriculum === 'JHS') return 'Junior High School';
            if (curriculum === 'SHS') return 'Senior High School';
            return curriculum;
        },
        getStatusBgClass(Status) {
            switch (Status) {
                case 'Pending':
                    return 'bg-orange';
                case 'Declined':
                    return 'bg-red';
                case 'Accepted':
                    return 'bg-blue';
                default:
                    return 'bg-gray';
            }
        },
        getStatusTextClass(Status) {
            switch (Status) {
                case 'Pending':
                    return 'text-orange';
                case 'Declined':
                    return 'text-red';
                case 'Accepted':
                    return 'text-blue';
                default:
                    return 'text-gray';
            }
        }
    },
    mounted() {
        this.fetchAcceptedClasses();
    },
};
</script>

<style scoped>

.filters {
    display: flex;
    gap: 15px;
    margin-bottom: 20px;
}

.filter-dropdown {
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 14px;
}

.cards-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 25px;
    margin-top: 20px;
}

@media (max-width: 768px) {
    .cards-container {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    }
}
</style>

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

</style>