// Utility functions for school applications API calls

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Get all school applications (for admin)
 */
export const fetchAllSchoolApplications = async (status = 'all') => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/school-applications/all?status=${status}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();
    
    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Failed to fetch school applications');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching school applications:', error);
    throw error;
  }
};

/**
 * Get all approved schools (for admin)
 */
export const fetchAllSchools = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/school-applications/schools`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();
    
    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Failed to fetch schools');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching schools:', error);
    throw error;
  }
};

/**
 * Get my school applications (for users)
 */
export const fetchMySchoolApplications = async (userId: string | number) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/school-applications/my-applications/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();
    
    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Failed to fetch my school applications');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching my school applications:', error);
    throw error;
  }
};

/**
 * Get school application by ID
 */
export const fetchSchoolApplicationById = async (id: string | number) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/school-applications/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();
    
    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Failed to fetch school application');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching school application:', error);
    throw error;
  }
};

/**
 * Submit school application
 */
export const submitSchoolApplication = async (applicationData: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/school-applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(applicationData)
    });

    const result = await response.json();
    
    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Failed to submit school application');
    }

    return result.data;
  } catch (error) {
    console.error('Error submitting school application:', error);
    throw error;
  }
};

/**
 * Approve school application
 */
export const approveSchoolApplication = async (id: string | number, approvalData: any) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/school-applications/${id}/approve`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(approvalData)
    });

    const result = await response.json();
    
    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Failed to approve school application');
    }

    return result.data;
  } catch (error) {
    console.error('Error approving school application:', error);
    throw error;
  }
};

/**
 * Reject school application
 */
export const rejectSchoolApplication = async (id: string | number, rejectionData: any) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/school-applications/${id}/reject`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(rejectionData)
    });

    const result = await response.json();
    
    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Failed to reject school application');
    }

    return result.data;
  } catch (error) {
    console.error('Error rejecting school application:', error);
    throw error;
  }
};