import axios from 'axios';
import { classService } from '@/service/classService';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: false,
});

// Function to submit grades (both single and bulk)
export const submitGrades = async (gradesData, classId) => {
  try {
    console.log('Received gradesData:', gradesData); // Debug log

    const userStr = localStorage.getItem('user');
    if (!userStr) {
      throw new Error('User data not found');
    }
    
    const user = JSON.parse(userStr);
    if (!user.teacher_ID) {
      throw new Error('Teacher ID not found in user data');
    }

    // Get students for the class
    const studentsResponse = await classService.getClassStudents(classId);
    console.log('Fetched students:', studentsResponse.data); // Debug log
    
    if (studentsResponse.status !== 'success' || !studentsResponse.data) {
      throw new Error('Failed to fetch students data');
    }

    // Map the grades data with student IDs
    const payload = {
      grades: gradesData.map(grade => {
        console.log('Processing grade entry:', grade); // Debug log

        // Ensure we have a valid Student_ID
        if (!grade.Student_ID) {
          throw new Error(`Student ID is missing for grade entry: ${JSON.stringify(grade)}`);
        }

        // Create the grade payload
        const gradePayload = {
          Student_ID: grade.Student_ID,
          Teacher_ID: user.teacher_ID, // Use the teacher ID from the logged-in user
          Subject_ID: grade.Subject_ID,
          Class_ID: classId,
          Q1: grade.Q1,
          Q2: grade.Q2,
          Q3: grade.Q3,
          Q4: grade.Q4,
          FinalGrade: grade.FinalGrade,
          Remarks: grade.Remarks,
          Status: 'Pending'
        };

        console.log('Created grade payload:', gradePayload); // Debug log
        return gradePayload;
      })
    };
    
    console.log('Final payload being sent to API:', payload); // Debug log
    
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await API.post('/grades/bulk', payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('API Response:', response.data); // Debug log
    return response.data;
  } catch (error) {
    console.error('Grade submission error:', error);
    if (error.response) {
      console.error('Validation errors:', error.response.data.errors);
      console.error('Response data:', error.response.data); // Debug log
    }
    throw error.response ? error.response.data : error;
  }
};

// Function to get grades for a specific subject and class
export const getSubjectGrades = async (subjectId, classId) => {
  try {
    console.log('Making API call with subjectId:', subjectId, 'classId:', classId);
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token not found');
    }
    
    const response = await API.get(
      `/grades/subject/${subjectId}/class/${classId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log('API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('API error:', error);
    throw error.response ? error.response.data : error;
  }
};

// Function to get grades for a specific student
export const getStudentGrades = async (studentId, subjectId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await API.get(
      `/grades/student/${studentId}/subject/${subjectId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('API error:', error);
    throw error.response ? error.response.data : error;
  }
};

function validateGradeData(gradeData) {
  const errors = [];
  
  if (!gradeData.Student_ID) {
    errors.push('Student ID is required');
  }
  if (!gradeData.Subject_ID) {
    errors.push('Subject ID is required');
  }
  if (!gradeData.Teacher_ID) {
    errors.push('Teacher ID is required');
  }
  
  // Validate quarter grades
  ['Q1', 'Q2', 'Q3', 'Q4'].forEach(quarter => {
    if (gradeData[quarter] !== null) {
      const grade = parseFloat(gradeData[quarter]);
      if (isNaN(grade) || grade < 0 || grade > 100) {
        errors.push(`${quarter} must be a number between 0 and 100`);
      }
    }
  });

  return errors;
}

export const updateGradeStatus = async (gradeId, status) => {
  try {
    const token = localStorage.getItem('token');
    const response = await API.put(
      `/grades/${gradeId}/status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('API error:', error);
    throw error.response ? error.response.data : error;
  }
};

export const getAllData = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await API.get('/superadmin/grading', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('API error:', error);
    throw error.response ? error.response.data : error;
  }
};


export const acceptData = async (student_id, grade_ids) => {
  try {
    const token = localStorage.getItem('token');
    const response = await API.post(
      '/subject-grades/accept',
      {
        student_id,
        grade_ids,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('API error:', error);
    throw error.response ? error.response.data : error;
  }
};

export const rejectData = async (student_id, grade_ids, comments = '') => {
  try {
    const token = localStorage.getItem('token');
    const response = await API.post(
      '/subject-grades/reject',
      {
        student_id,
        grade_ids,
        comments,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('API error:', error);
    throw error.response ? error.response.data : error;
  }
};

export const validateExcelData = async (data) => {
  try {
    const token = localStorage.getItem('token');
    const response = await API.post('/grades/validate-excel', { data }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Excel validation error:', error);
    throw error.response ? error.response.data : error;
  }
};

// Add this new function to get teacher's subjects
export const getTeacherSubjects = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await API.get('/subject/getSubjects', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching teacher subjects:', error);
    throw error.response ? error.response.data : error;
  }
};