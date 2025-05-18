import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default {
  /**
   * Fetch all classes with relationships (schoolYear, subjects, students).
   * Optionally filter by teacher_id.
   */
  async fetchClasses(teacherId = null) {
    try {
      const params = {};
      if (teacherId) params.teacher_id = teacherId;

      const response = await axios.get(`${API_BASE_URL}/classes`, {
        headers: { 'Accept': 'application/json' },
        params, // Pass the teacher_id as a query parameter
      });
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Fetch subjects and map them to { subject_id: subjectName }.
   */
  async fetchSubjects() {
    try {
      const response = await axios.get(`${API_BASE_URL}/subjects`);
      return response.data.reduce((acc, subject) => ({
        ...acc,
        [subject.Subject_ID]: subject.SubjectName, // Match your DB column name
      }), {});
    } catch (error) {
      console.error('Error fetching subjects:', error);
      throw new Error('Failed to load subjects. Please try again later.');
    }
  },
};