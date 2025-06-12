<template>
  <div class="fixed inset-0 flex items-center justify-center z-50" style="background-color: rgba(0, 0, 0, 0.2);">
    <div class="bg-white rounded-lg w-full max-w-3xl p-6 shadow-lg relative">
      <!-- Close Button -->
      <button @click="$emit('close')"
        class="absolute top-2 right-4 text-gray-500 hover:text-gray-800 text-3xl cursor-pointer">&times;</button>

      <!-- STUDENT INFO -->
      <h2 class="text-blue-800 font-semibold text-xl mb-4" style="color: #295F98;">STUDENT INFO</h2>
      <div class="grid grid-cols-2 gap-4 mb-6 text-sm">
        <div>
          <div class="font-semibold" style="color: #295F98;">Student Name</div>
          <div class="text-lg">{{ student.lastName }}, {{ student.firstName }}</div>
        </div>
        <div>
          <div class="font-semibold" style="color: #295F98;">SEX</div>
          <div class="text-lg">{{ student.sex }}</div>
        </div>
        <div>
          <div class="font-semibold" style="color: #295F98;">Birthdate</div>
          <div class="text-lg">{{ formatDate(student.birthDate) }}</div>
        </div>
        <div>
          <div class="font-semibold" style="color: #295F98;">LRN</div>
          <div class="text-lg">{{ student.lrn }}</div>
        </div>
        <div>
          <div class="font-semibold" style="color: #295F98;">CURRICULUM</div>
          <div class="text-lg">{{ student.curriculum }}</div>
        </div>
        <div>
          <div class="font-semibold" style="color: #295F98;">ACADEMIC TRACK</div>
          <div class="text-lg">{{ student.track }}</div>
        </div>
      </div>

      <!-- GRADING -->
      <h2 class="text-blue-800 font-semibold text-xl mb-4" style="color: #295F98;">GRADING</h2>
      <div class="flex items-center gap-4 mb-6">
        <div>
          <label class="block text-sm font-semibold text-center mb-1">1st Quarter</label>
          <input type="number" class="border text-center px-2 py-1 w-24" :value="student.subject_grades.Q1" readonly />
        </div>
        <div>
          <label class="block text-sm font-semibold text-center mb-1">2nd Quarter</label>
          <input type="number" class="border text-center px-2 py-1 w-24" :value="student.subject_grades.Q2" readonly />
        </div>
        <div>
          <label class="block text-sm font-semibold text-center mb-1">3rd Quarter</label>
          <input type="number" class="border text-center px-2 py-1 w-24" :value="student.subject_grades.Q3" readonly />
        </div>
        <div>
          <label class="block text-sm font-semibold text-center mb-1">4th Quarter</label>
          <input type="number" class="border text-center px-2 py-1 w-24" :value="student.subject_grades.Q4" readonly />
        </div>
        <div>
          <label class="block text-sm font-semibold text-center mb-1">Final Grade</label>
          <input type="number" class="border text-center px-2 py-1 w-24" :value="student.subject_grades.FinalGrade"
            readonly />
        </div>
        <div>
          <label class="block text-sm font-semibold text-center mb-1">Remarks</label>
          <div :class="remarkClass" class="px-3 py-1 rounded border text-center w-28">
            {{ student.subject_grades.Status }}
          </div>
        </div>
      </div>

      <!-- COMMENT -->
      <h2 class="text-blue-800 font-semibold text-xl mb-4" style="color: #295F98;">COMMENT</h2>
      <textarea v-model="student.subject_grades.Comments" rows="4" class="w-full border rounded px-3 py-2 mb-4"
        placeholder="Enter comment..."></textarea>


      <!-- ACTION BUTTONS -->
      <div class="flex justify-end space-x-4"
        v-if="student.subject_grades?.Status !== 'Approved' && student.subject_grades?.Status !== 'Declined'">
        <button class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded" @click="reject">
          Decline
        </button>
        <button class="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded" @click="accept">
          Accept
        </button>
      </div>

    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2'
import { acceptData, rejectData } from '@/service/gradeService';

export default {
  props: {
    student: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      grade: '75',
      comment: '',
    };
  },
  computed: {
    remark() {
      return this.grade >= 75 ? 'Passed' : 'Failed';
    },
    remarkClass() {
      return this.grade >= 75 ? 'bg-green-100 text-green-800 border-green-400' : 'bg-red-100 text-red-800 border-red-400';
    },
  },
 methods: {
   reject() {
     if (!this.comment || this.comment.trim() === '') {
       Swal.fire({
         icon: 'warning',
         title: 'Comment Required',
         text: 'Please provide a comment before rejecting.',
         confirmButtonText: 'OK',
         confirmButtonColor: '#D30000'
       });
       return;
     }

     Swal.fire({
       title: 'Are you sure?',
       text: 'Do you really want to reject this?',
       icon: 'warning',
       showCancelButton: true,
       confirmButtonColor: '#D30000',
       cancelButtonColor: '#6c757d',
       confirmButtonText: 'Yes, Reject',
       cancelButtonText: 'Cancel'
     }).then(async result => {
       if (result.isConfirmed) {
         try {
           const studentId = this.student.student_id;
           const gradeId = this.student.subject_grades?.grade_id;

           if (!gradeId) {
             throw new Error('Grade ID not found.');
           }

           const response = await rejectData(studentId, [gradeId], this.comment);
           console.log('Rejected with grade:', gradeId, 'Response:', response);

           // Update sessionStorage
           const classData = JSON.parse(sessionStorage.getItem('selectedClassData') || '{}');
           if (classData.students) {
             const idx = classData.students.findIndex(s => s.student_id === studentId);
             if (idx !== -1) {
               const grade = classData.students[idx].subject_grades?.find(
                 g => g.grade_id === gradeId
               );
               if (grade) {
                 grade.Status = 'Declined';
                 grade.Comments = this.comment;
               }
               sessionStorage.setItem('selectedClassData', JSON.stringify(classData));
             }
           }

           Swal.fire({
             icon: 'success',
             title: 'Rejected',
             text: 'The grade has been rejected.',
             timer: 1500,
             showConfirmButton: false
           });

           setTimeout(() => {
             window.location.reload();
           }, 1000);

           this.$emit('rejected', studentId);
           this.$emit('close');

         } catch (error) {
           Swal.fire({
             icon: 'error',
             title: 'Error',
             text: error.message || 'Failed to reject grade.'
           });
           console.error('Error during rejection:', error);
         }
       }
     });
   },
   accept() {
     Swal.fire({
       title: 'Are you sure?',
       text: 'Do you want to accept this?',
       icon: 'question',
       showCancelButton: true,
       confirmButtonColor: '#28a745',
       cancelButtonColor: '#6c757d',
       confirmButtonText: 'Yes, Accept',
       cancelButtonText: 'Cancel'
     }).then(async result => {
       if (result.isConfirmed) {
         try {
           const studentId = this.student.student_id;
           const gradeId = this.student.subject_grades?.grade_id;

           if (!gradeId) {
             throw new Error('Grade ID not found.');
           }

           const response = await acceptData(studentId, [gradeId]);
           console.log('Accepted with grade:', gradeId, 'Response:', response);

           // Update sessionStorage only
           const classData = JSON.parse(sessionStorage.getItem('selectedClassData') || '{}');
           if (classData.students) {
             const idx = classData.students.findIndex(s => s.student_id === studentId);
             if (idx !== -1) {
               const grade = classData.students[idx].subject_grades?.find(
                 g => g.grade_id === gradeId
               );
               if (grade) grade.Status = 'Approved';
             }
             sessionStorage.setItem('selectedClassData', JSON.stringify(classData));
           }

           Swal.fire({
             icon: 'success',
             title: 'Accepted',
             text: 'The grade has been accepted successfully.',
             timer: 1500,
             showConfirmButton: false
           });

           setTimeout(() => {
             window.location.reload();
           }, 1000);

           this.$emit('accepted', studentId); // Emit accepted event with studentId
           this.$emit('close'); // Close modal

         } catch (error) {
           Swal.fire({
             icon: 'error',
             title: 'Error',
             text: error.message || 'Failed to accept grade.'
           });
           console.error('Error during acceptance:', error);
         }
       }
     });
   },
   formatDate(dateString) {
     const date = new Date(dateString);
     return date.toLocaleDateString('en-PH', {
       year: 'numeric',
       month: 'long',
       day: 'numeric'
     });
   },
}

};
</script>
