import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/client';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [student, setStudent] = useState(null);
  const [studentLoading, setStudentLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchStudentProfile = useCallback(async () => {
    try {
      setStudentLoading(true);
      const res = await api.get('/students/1');
      setStudent(res.data);
    } catch (err) {
      console.error('Failed to fetch student profile:', err);
    } finally {
      setStudentLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudentProfile();
  }, [fetchStudentProfile]);

  const updateStudentProfile = async (updateData) => {
    try {
      const res = await api.put('/students/1', updateData);
      setStudent(res.data);
      return res.data;
    } catch (err) {
      console.error('Failed to update student profile:', err);
      throw err;
    }
  };

  return (
    <AppContext.Provider
      value={{
        student,
        studentLoading,
        fetchStudentProfile,
        updateStudentProfile,
        sidebarCollapsed,
        setSidebarCollapsed,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
