<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 z-[100] flex items-center justify-center"
    :style="{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }"
    @click.self="$emit('update:modelValue', false)"
  >
    <div class="bg-white p-6 rounded-md w-[1000px] shadow-lg max-w-full">
      <h2 class="text-xl text-[#295f98] font-semibold mb-6">Add Personnel</h2>
      <form @submit.prevent="handleSubmit" class="space-y-4 p-2">
        <!-- Profile Section -->
        <h1 class="font-semibold text-[#295f98]">Profile</h1>
        <div class="flex gap-4 mb-6">
          <div class="floating-label flex-1" :class="{ filled: firstName }">
            <input v-model="firstName" type="text" placeholder=" " class="input" required />
            <label>First Name</label>
          </div>
          <div class="floating-label flex-1" :class="{ filled: middleName }">
            <input v-model="middleName" type="text" placeholder=" " class="input" />
            <label>Middle Name</label>
          </div>
          <div class="floating-label flex-1" :class="{ filled: lastName }">
            <input v-model="lastName" type="text" placeholder=" " class="input" required />
            <label>Last Name</label>
          </div>
          <div class="floating-label flex-1" :class="{ filled: suffix }">
            <select v-model="suffix" class="input">
              <option value="" disabled selected hidden>Suffix</option>
              <option value="Sr.">Sr.</option>
              <option value="Jr.">Jr.</option>
              <option value="II">II</option>
              <option value="III">III</option>
              <option value="IV">IV</option>
              <option value="V">V</option>
            </select>
            <label>Suffix</label>
            <span class="custom-arrow"></span>
          </div>
        </div>

        <!-- Employment Section -->
        <div class="flex gap-4 mb-6">
          <div class="floating-label flex-1" :class="{ filled: employeeNumber }">
            <input v-model="employeeNumber" type="text" placeholder=" " class="input" required />
            <label>Employee Number</label>
          </div>
          <div class="floating-label flex-1" :class="{ filled: teachingPosition }">
            <input v-model="teachingPosition" type="text" placeholder=" " class="input" />
            <label>Teaching Position</label>
          </div>
          <div class="floating-label flex-2" :class="{ filled: educationalAttainment }">
            <input v-model="educationalAttainment" type="text" placeholder=" " class="input" />
            <label>Educational Attainment</label>
          </div>
        </div>

        <!-- Additional Info -->
        <h1 class="font-semibold text-[#295f98]">Additional Info</h1>
        <div class="flex gap-4 mb-6">
          <div class="floating-label flex-1" :class="{ filled: birthDate }">
            <input v-model="birthDate" type="date" placeholder=" " class="input" />
            <label>Enter Birth Date</label>
          </div>
          <div class="floating-label flex-1" :class="{ filled: sex }">
            <select v-model="sex" class="input">
              <option value="" disabled selected hidden></option>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
            <label>Sex at Birth</label>
            <span class="custom-arrow"></span>
          </div>
        </div>

        <div class="flex gap-4 mb-6">
          <div class="floating-label flex-1" :class="{ filled: contactNumber }">
            <input
              v-model="contactNumber"
              type="text"
              placeholder=" "
              class="input"
              inputmode="numeric"
              pattern="[0-9]*"
              maxlength="11"
              @input="contactNumber = contactNumber.replace(/\D/g, '').slice(0, 11)"
            />
            <label>Contact Number</label>
          </div>
          <div class="floating-label flex-1" :class="{ filled: address }">
            <input v-model="address" type="text" placeholder=" " class="input" />
            <label>Address</label>
          </div>
        </div>

        <!-- Account Setup -->
        <h1 class="font-semibold text-[#295f98]">Account Setup</h1>
        <div class="flex gap-4 mb-6">
          <div class="floating-label flex-2" :class="{ filled: email }">
            <input v-model="email" type="email" placeholder=" " class="input" required />
            <label>Email</label>
          </div>
          <div class="floating-label flex-1" :class="{ filled: password }">
            <input v-model="password" type="password" placeholder=" " class="input" required />
            <label>Password</label>
          </div>
          <div class="floating-label flex-1" :class="{ filled: confirmPassword }">
            <input v-model="confirmPassword" type="password" placeholder=" " class="input" required />
            <label>Confirm Password</label>
          </div>
        </div>

        <!-- Teacher Subjects -->
        <div v-if="selectedAccession === 'Teacher'">
          <h1 class="font-semibold text-[#295f98] mb-2">Teacher Subject</h1>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div
              v-for="(field, idx) in 5"
              :key="idx"
              class="floating-label relative"
              :class="{ filled: subjectFields[idx] }"
              v-show="idx === 0 || showSubjects[idx]"
            >
              <select v-model="subjectFields[idx]" class="input" :required="idx === 0">
                <option value="" disabled selected hidden>Select Subject {{ idx + 1 }}</option>
                <option v-for="subject in subjects" :key="subject.id" :value="subject.id">{{ subject.name }}</option>
              </select>
              <label>{{ subjectFields[idx] ? capitalize(subjectFields[idx]) : `Subject ${idx + 1}` }}</label>
              <span class="custom-arrow"></span>
              <div class="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                <button
                  v-if="idx > 0 && showSubjects[idx]"
                  type="button"
                  @click="toggleSubjectField(idx, 'remove')"
                  class="px-2 py-1 text-white rounded bg-red-600 hover:bg-red-700 text-sm"
                >-</button>
                <button
                  v-if="idx === lastVisibleSubjectIdx && idx < 4"
                  type="button"
                  @click="toggleSubjectField(idx + 1, 'add')"
                  class="px-2 py-1 text-white rounded bg-blue-600 hover:bg-blue-700 text-sm"
                >+</button>
              </div>
            </div>
          </div>
        </div>


        <!-- Accession Section -->
        <h2 class="text-xl text-[#295f98] font-semibold mb-6">Accession</h2>
        <div class="flex gap-6 items-center">
          <label class="flex flex-col items-center gap-1 cursor-pointer select-none">
            <span class="font-semibold text-[#295f98] mb-4">Teacher</span>
            <input type="radio" value="Teacher" v-model="selectedAccession" class="hidden" />
            <div :class="['w-18 h-6 rounded-full flex items-center transition-colors duration-300', selectedAccession === 'Teacher' ? 'bg-blue-600' : 'bg-gray-300']">
              <div :class="['w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-300', selectedAccession === 'Teacher' ? 'translate-x-12' : 'translate-x-1']"></div>
            </div>
          </label>

          <label class="flex flex-col items-center gap-1 cursor-pointer select-none">
            <span class="font-semibold text-[#295f98] mb-4">Admin</span>
            <input type="radio" value="Admin" v-model="selectedAccession" class="hidden" />
            <div :class="['w-18 h-6 rounded-full flex items-center transition-colors duration-300', selectedAccession === 'Admin' ? 'bg-blue-600' : 'bg-gray-300']">
              <div :class="['w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-300', selectedAccession === 'Admin' ? 'translate-x-12' : 'translate-x-1']"></div>
            </div>
          </label>

          <label class="flex flex-col items-center gap-1 cursor-pointer select-none">
            <span class="font-semibold text-[#295f98] mb-4">Book-keeping</span>
            <input type="radio" value="Book-keeping" v-model="selectedAccession" class="hidden" />
            <div :class="['w-18 h-6 rounded-full flex items-center transition-colors duration-300', selectedAccession === 'Book-keeping' ? 'bg-blue-600' : 'bg-gray-300']">
              <div :class="['w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-300', selectedAccession === 'Book-keeping' ? 'translate-x-12' : 'translate-x-1']"></div>
            </div>
          </label>
        </div>

        <!-- Buttons -->
        <div class="flex justify-end mt-6 gap-2">
          <button type="button" @click="$emit('update:modelValue', false)" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer">Cancel</button>
          <button type="submit" class="px-4 py-2 bg-[#295f98] text-white rounded hover:bg-blue-900 cursor-pointer">Save</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import Swal from 'sweetalert2';
import axios from 'axios';
import personnelService from '@/service/personnelService';

const props = defineProps({ modelValue: Boolean });
const emit = defineEmits(['update:modelValue', 'submit']);

// Form refs
const firstName = ref('');
const middleName = ref('');
const lastName = ref('');
const suffix = ref('');
const employeeNumber = ref('');
const educationalAttainment = ref('');
const teachingPosition = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const selectedAccession = ref('');
const birthDate = ref('');
const sex = ref('');
const contactNumber = ref('');
const address = ref('');
const showSubjects = ref([true, false, false, false, false]);
const subjectFields = ref(['', '', '', '', '']);
const subjects = ref([]);

// Helper to find the last visible subject field index
const lastVisibleSubjectIdx = computed(() => {
  let idx = 0;
  for (let i = 0; i < showSubjects.value.length; i++) {
    if (showSubjects.value[i]) idx = i;
  }
  return idx;
});

// Validation helpers
const isTextOnly = value => /^[A-Za-z\s]+$/.test(value || '');
const isValidContact = value => /^\d{11}$/.test(value || '');
const is18OrOlder = date => {
  const birth = new Date(date);
  const today = new Date();
  const age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  return age > 18 || (age === 18 && m >= 0 && today.getDate() >= birth.getDate());
};

const toggleSubjectField = (idx, action) => {
  if (action === 'add') {
    // Find the next hidden field after the last visible one
    for (let i = 0; i < showSubjects.value.length; i++) {
      if (!showSubjects.value[i]) {
        showSubjects.value[i] = true;
        break;
      }
    }
  } else if (action === 'remove') {
    showSubjects.value[idx] = false;
    subjectFields.value[idx] = '';
  }
};

const getSelectedSubjects = () => subjectFields.value.filter(Boolean);

const capitalize = str => (typeof str === 'string' && str.length ? str.charAt(0).toUpperCase() + str.slice(1) : '');

const getMissingFields = () => {
  const missing = [];

  if (!firstName.value || !isTextOnly(firstName.value)) missing.push('Valid First Name');
  if (!lastName.value || !isTextOnly(lastName.value)) missing.push('Valid Last Name');
  if (middleName.value && !isTextOnly(middleName.value)) missing.push('Valid Middle Name');
  if (suffix.value && !isTextOnly(suffix.value)) missing.push('Valid Suffix');

  if (!employeeNumber.value) missing.push('Employee Number');
  if (!email.value) missing.push('Email');
  if (!password.value) missing.push('Password');
  if (!confirmPassword.value) missing.push('Confirm Password');
  if (!selectedAccession.value) missing.push('Accession');
  if (selectedAccession.value === 'Teacher' && !subjectFields.value[0]) missing.push('Subject 1');

  if (contactNumber.value && !isValidContact(contactNumber.value)) missing.push('Valid 11-digit Contact Number');
  if (birthDate.value && !is18OrOlder(birthDate.value)) missing.push('Birthdate must be 18 or older');

  return missing;
};

const handleSubmit = async () => {
  const missingFields = getMissingFields();

  if (missingFields.length > 0) {
    Swal.fire({
      icon: 'error',
      title: 'Invalid or Missing Fields',
      html: `<ul class="text-left">${missingFields.map(field => `<li>• ${field}</li>`).join('')}</ul>`,
    });
    return;
  }

  if (password.value !== confirmPassword.value) {
    Swal.fire({ icon: 'error', title: 'Password Mismatch', text: 'Password and Confirm Password do not match.' });
    return;
  }

  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'Do you want to save this faculty member?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, save it!',
    cancelButtonText: 'Cancel',
  });

  if (result.isConfirmed) {
    const formData = {
      Email: email.value,
      Password: password.value,
      ConfirmPassword: confirmPassword.value,
      EmployeeNo: employeeNumber.value,
      Educational_Attainment: educationalAttainment.value,
      Teaching_Position: teachingPosition.value,
      FirstName: firstName.value,
      LastName: lastName.value,
      MiddleName: middleName.value,
      Suffix: suffix.value,
      BirthDate: birthDate.value,
      Sex: sex.value,
      Position: selectedAccession.value,
      ContactNumber: contactNumber.value,
      Address: address.value,
      ...(selectedAccession.value === 'Teacher' && { Subject_IDs: getSelectedSubjects() }),
    };

    try {
      await personnelService.createTeacher(formData);
      emit('submit', formData);

      // Reset all fields
      [
        firstName, middleName, lastName, suffix, employeeNumber,
        educationalAttainment, teachingPosition,
        email, password, confirmPassword, selectedAccession,
        birthDate, sex, contactNumber, address,
      ].forEach(field => (field.value = ''));
      subjectFields.value = ['', '', '', '', ''];
      showSubjects.value = [true, false, false, false, false];

      emit('update:modelValue', false);
      Swal.fire({ icon: 'success', title: 'Saved!', text: 'Faculty member has been saved successfully.', timer: 1500, showConfirmButton: false });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An error occurred while saving the faculty member.';
      Swal.fire({ icon: 'error', title: 'Error', text: errorMessage });
      console.error(error);
    }
  }
};

onMounted(async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://127.0.0.1:8000/api/subject/getSubjects', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
    if (response.data.status === 'success') {
      subjects.value = response.data.data;
    }
  } catch (error) {
    console.error('Failed to fetch subjects:', error);
  }
});

watch(selectedAccession, (val) => {
  if (val !== 'Teacher') {
    subjectFields.value = ['', '', '', '', ''];
    showSubjects.value = [true, false, false, false, false];
  }
});
</script>



<style scoped>
.floating-label {
  position: relative;
  display: flex;
  flex-direction: column;
}

.floating-label .input {
  padding: 0.75rem 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.375rem;
  background: white;
  appearance: none;
}

.floating-label label {
  position: absolute;
  left: 0.5rem;
  top: 0.75rem;
  background: white;
  color: #888;
  padding: 0 0.25rem;
  transition: all 0.2s ease;
  pointer-events: none;
}

.floating-label input:focus + label,
.floating-label select:focus + label,
.floating-label.filled label {
  transform: translateY(-1.5rem);
  font-size: 0.75rem;
  color: #2563eb;
}

.custom-arrow {
  position: absolute;
  top: 50%;
  right: 0.75rem;
  pointer-events: none;
  width: 1rem;
  height: 1rem;
  background-image: url('data:image/svg+xml;utf8,<svg fill="%23888888" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>');
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  transform: translateY(-50%);
  transition: background-image 0.2s ease;
}

.floating-label select:focus + label + .custom-arrow {
  background-image: url('data:image/svg+xml;utf8,<svg fill="%232563eb" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>');
}
</style>
