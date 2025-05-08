<template>
  <div class="class-card">
    <div class="card-header">
      <div class="card-info">
        <div class="grade">{{ grade }}</div>
        <div class="school-type">{{ schoolType }}</div>
        <div class="total-students">{{ totalStudents }} Total Students</div>
      </div>
      <img class="school-logo" src="/logo.png" alt="School Logo" />
    </div>
    <div class="card-actions">
      <span class="manage-btn">Manage Class</span>
      <button class="enter-btn">Enter</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Card',
  props: {
    grade: String,
    schoolType: String,
    totalStudents: Number,
    gradeLevel: Number,
  },
};
</script>

<style scoped>
.class-card {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 200px;
  border: 1.5px solid #e0e0e0;
  position: relative;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24px 20px 0 20px;
  position: relative;
  z-index: 1;
}
.card-info {
  flex: 1;
  z-index: 2;
}
.grade {
  font-size: 2.3rem;
  font-weight: 700;
  color: #3260a8;
  margin-bottom: 4px;
}
.school-type {
  font-size: 1.1rem;
  color: #3260a8;
  font-weight: 600;
}
.total-students {
  font-size: 1rem;
  color: #7da0c4;
  font-style: italic;
  margin-top: 2px;
}
.school-logo {
  width: 120px;
  height: 120px;
  object-fit: contain;
  position: absolute;
  right: -30px;
  top: 18px;
  z-index: 0;
}
.card-actions {
  background: #3260a8;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 13px 20px 13px 20px;
  margin-top: 0;
}
.manage-btn {
  color: #fff;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
}
.enter-btn {
  background: transparent;
  color: #fff;
  border: 2px solid #fff;
  border-radius: 8px;
  padding: 4px 22px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.enter-btn:hover {
  background: #fff;
  color: #3260a8;
}
</style> 