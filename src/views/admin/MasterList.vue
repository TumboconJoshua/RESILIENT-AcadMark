<template>
  <div class="masterlist-container">
    <div v-if="selectedCard">
      <StudentList :selectedCard="selectedCard" @back="selectedCard = null" />
    </div>
    <div v-else>
      <h1 class="text-4xl font-bold mb-6">Masterlist</h1>

      <!-- Filters -->
      <div class="flex flex-wrap gap-4 mb-6">
        <select
          v-model="selectedGrade"
          class="border border-gray-300 rounded-lg p-3"
        >
          <option value="">Grade Level</option>
          <option v-for="grade in grades" :key="grade" :value="grade">
            Grade {{ grade }}
          </option>
        </select>

        <select
          v-model="selectedCurriculum"
          class="border border-gray-300 rounded-lg p-3"
        >
          <option value="">Curriculum</option>
          <option
            v-for="curriculum in curriculums"
            :key="curriculum"
            :value="curriculum"
          >
            {{ curriculum }}
          </option>
        </select>

        <select
          v-model="selectedTrack"
          class="border border-gray-300 rounded-lg p-3"
        >
          <option value="">Track</option>
          <option v-for="track in tracks" :key="track" :value="track">
            {{ track }}
          </option>
        </select>
      </div>

      <!-- Cards Grid -->
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
      >
        <div
          v-for="(card, index) in filteredCards"
          :key="index"
          class="rounded-xl shadow-lg border border-gray-300 overflow-hidden cursor-pointer transition-transform hover:scale-105"
          @click="handleCardClick(card)"
        >
          <div class="bg-blue text-white py-3 px-4 text-center font-semibold">
            Junior High School
          </div>
          <div class="bg-white p-6 relative pb-20">
            <div class="relative z-10 mt-[-17px]">
              <h2 class="text-5xl font-bold text-blue mb-2">
                Grade {{ card.grade }}
              </h2>
              <p class="text-lg font-semibold text-blue">
                {{ card.track }} – {{ card.curriculum }}
              </p>
            </div>
            <div class="absolute top-0 right-0 w-full h-full overflow-hidden">
              <img
                src="/assets/img/logo.png"
                alt="School Logo"
                class="opacity-40 h-40 absolute top-10 right-[-40px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import StudentList from '@/views/teacher/classes/Studentlist.vue';

  export default {
    name: 'Masterlist',
    components: {
      StudentList,
    },
    data() {
      return {
        selectedCard: null,
        selectedGrade: '',
        selectedCurriculum: '',
        selectedTrack: '',
        grades: [7, 8, 9, 10],
        curriculums: ['BEC', 'STEM', 'ABM'],
        tracks: ['Einstein', 'Rizal', 'Bonifacio'],
        cards: [
          { grade: 7, curriculum: 'BEC', track: 'Einstein' },
          { grade: 8, curriculum: 'BEC', track: 'Einstein' },
          { grade: 9, curriculum: 'BEC', track: 'Einstein' },
          { grade: 7, curriculum: 'STEM', track: 'Rizal' },
          { grade: 8, curriculum: 'STEM', track: 'Rizal' },
          { grade: 9, curriculum: 'STEM', track: 'Rizal' },
          { grade: 7, curriculum: 'ABM', track: 'Bonifacio' },
          { grade: 8, curriculum: 'ABM', track: 'Bonifacio' },
          { grade: 9, curriculum: 'ABM', track: 'Bonifacio' },
        ],
      };
    },
    computed: {
      filteredCards() {
        return this.cards.filter((card) => {
          return (
            (!this.selectedGrade ||
              card.grade === parseInt(this.selectedGrade)) &&
            (!this.selectedCurriculum ||
              card.curriculum === this.selectedCurriculum) &&
            (!this.selectedTrack || card.track === this.selectedTrack)
          );
        });
      },
    },
    methods: {
      handleCardClick(card) {
        this.selectedCard = card;
      },
    },
  };
</script>

<style scoped>
  .masterlist-container {
    padding: 30px;
  }

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