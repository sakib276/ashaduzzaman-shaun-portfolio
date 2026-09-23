import React, { useState, useEffect, useCallback } from 'react';
import { initialPortfolioData } from './data/initialData';
import {
  fetchPortfolio,
  updateProfile,
  addAchievement,
  deleteAchievement,
  addProject,
  deleteProject,
  addExperience,
  deleteExperience,
  addEducation,
  deleteEducation
} from './services/api';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Achievements from './components/Achievements';
import Projects from './components/Projects';
import Education from './components/Education';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Admin from './components/Admin';

import './styles/style.css';
import './styles/responsive.css';
import './styles/admin.css';

const STORAGE_KEY = 'portfolio_data_v2';

export default function App() {
  // Initialize state with localStorage cache or seeded defaults
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load saved portfolio data:', e);
    }
    return initialPortfolioData;
  });

  // Track active view ('portfolio' or 'admin')
  const [currentView, setCurrentView] = useState(() => {
    return window.location.hash === '#admin' ? 'admin' : 'portfolio';
  });

  // Listen for hash change (#admin)
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setCurrentView('admin');
      } else if (window.location.hash === '' || window.location.hash.startsWith('#home')) {
        setCurrentView('portfolio');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Sync data from Backend API on mount
  const refreshFromAPI = useCallback(async () => {
    try {
      const remoteData = await fetchPortfolio();
      if (remoteData && remoteData.profile) {
        setData(remoteData);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(remoteData));
      }
    } catch (e) {
      // Backend not running or offline, keep local cache
      console.log('Using cached portfolio data:', e.message);
    }
  }, []);

  useEffect(() => {
    refreshFromAPI();
  }, [refreshFromAPI]);

  // Persist state updates to local cache
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to cache portfolio data:', e);
    }
  }, [data]);

  // Admin mutation handlers
  const handleUpdateProfile = async (profileUpdates) => {
    try {
      const updated = await updateProfile(profileUpdates);
      setData((prev) => ({
        ...prev,
        profile: updated.profile || { ...prev.profile, ...profileUpdates },
        contact: updated.contact || { ...prev.contact, ...(profileUpdates.contact || {}) }
      }));
    } catch (e) {
      // Offline fallback
      setData((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          ...profileUpdates
        },
        contact: profileUpdates.contact ? { ...prev.contact, ...profileUpdates.contact } : prev.contact
      }));
    }
  };

  const handleAddAchievement = async (newAchievement) => {
    try {
      const updated = await addAchievement(newAchievement);
      if (updated && updated.achievements) {
        setData(updated);
      } else {
        setData((prev) => ({
          ...prev,
          achievements: [{ ...newAchievement, id: `ach-${Date.now()}` }, ...(prev.achievements || [])]
        }));
      }
    } catch (e) {
      setData((prev) => ({
        ...prev,
        achievements: [{ ...newAchievement, id: `ach-${Date.now()}` }, ...(prev.achievements || [])]
      }));
    }
  };

  const handleDeleteAchievement = async (id) => {
    try {
      const updated = await deleteAchievement(id);
      if (updated && updated.achievements) {
        setData(updated);
      } else {
        setData((prev) => ({
          ...prev,
          achievements: (prev.achievements || []).filter((a) => a.id !== id)
        }));
      }
    } catch (e) {
      setData((prev) => ({
        ...prev,
        achievements: (prev.achievements || []).filter((a) => a.id !== id)
      }));
    }
  };

  const handleAddProject = async (newProject) => {
    try {
      const updated = await addProject(newProject);
      if (updated && updated.projects) {
        setData(updated);
      } else {
        setData((prev) => ({
          ...prev,
          projects: [{ ...newProject, id: `proj-${Date.now()}` }, ...(prev.projects || [])]
        }));
      }
    } catch (e) {
      setData((prev) => ({
        ...prev,
        projects: [{ ...newProject, id: `proj-${Date.now()}` }, ...(prev.projects || [])]
      }));
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      const updated = await deleteProject(id);
      if (updated && updated.projects) {
        setData(updated);
      } else {
        setData((prev) => ({
          ...prev,
          projects: (prev.projects || []).filter((p) => p.id !== id)
        }));
      }
    } catch (e) {
      setData((prev) => ({
        ...prev,
        projects: (prev.projects || []).filter((p) => p.id !== id)
      }));
    }
  };

  const handleAddExperience = async (newExp) => {
    try {
      const updated = await addExperience(newExp);
      if (updated && updated.experience) {
        setData(updated);
      } else {
        setData((prev) => ({
          ...prev,
          experience: [{ ...newExp, id: `exp-${Date.now()}` }, ...(prev.experience || [])]
        }));
      }
    } catch (e) {
      setData((prev) => ({
        ...prev,
        experience: [{ ...newExp, id: `exp-${Date.now()}` }, ...(prev.experience || [])]
      }));
    }
  };

  const handleDeleteExperience = async (id) => {
    try {
      const updated = await deleteExperience(id);
      if (updated && updated.experience) {
        setData(updated);
      } else {
        setData((prev) => ({
          ...prev,
          experience: (prev.experience || []).filter((e) => e.id !== id)
        }));
      }
    } catch (e) {
      setData((prev) => ({
        ...prev,
        experience: (prev.experience || []).filter((e) => e.id !== id)
      }));
    }
  };

  const handleAddEducation = async (newEdu) => {
    try {
      const updated = await addEducation(newEdu);
      if (updated && updated.education) {
        setData(updated);
      } else {
        setData((prev) => ({
          ...prev,
          education: [{ ...newEdu, id: `edu-${Date.now()}` }, ...(prev.education || [])]
        }));
      }
    } catch (e) {
      setData((prev) => ({
        ...prev,
        education: [{ ...newEdu, id: `edu-${Date.now()}` }, ...(prev.education || [])]
      }));
    }
  };

  const handleDeleteEducation = async (id) => {
    try {
      const updated = await deleteEducation(id);
      if (updated && updated.education) {
        setData(updated);
      } else {
        setData((prev) => ({
          ...prev,
          education: (prev.education || []).filter((e) => e.id !== id)
        }));
      }
    } catch (e) {
      setData((prev) => ({
        ...prev,
        education: (prev.education || []).filter((e) => e.id !== id)
      }));
    }
  };

  const handleToggleView = (view) => {
    setCurrentView(view);
    if (view === 'admin') {
      window.location.hash = '#admin';
    } else {
      if (window.location.hash === '#admin') {
        window.history.replaceState(null, '', window.location.pathname);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const firstName = data.profile?.name ? data.profile.name.split(' ')[0] : 'Shaun';

  return (
    <div className="app-root">
      {currentView === 'portfolio' ? (
        <>
          <Navbar
            currentView={currentView}
            onToggleView={handleToggleView}
            logoName={firstName}
            profile={data.profile}
            contact={data.contact}
          />
          <main>
            <Hero profile={data.profile} contact={data.contact} />
            <About profile={data.profile} contact={data.contact} />
            <Experience experience={data.experience} />
            <Achievements achievements={data.achievements} />
            <Projects projects={data.projects} />
            <Education education={data.education} />
            <Contact contact={data.contact} />
          </main>
          <Footer profileName={data.profile?.name} onToggleView={handleToggleView} />
        </>
      ) : (
        <Admin
          portfolioData={data}
          onUpdateProfile={handleUpdateProfile}
          onAddAchievement={handleAddAchievement}
          onDeleteAchievement={handleDeleteAchievement}
          onAddProject={handleAddProject}
          onDeleteProject={handleDeleteProject}
          onAddExperience={handleAddExperience}
          onDeleteExperience={handleDeleteExperience}
          onAddEducation={handleAddEducation}
          onDeleteEducation={handleDeleteEducation}
          onToggleView={handleToggleView}
        />
      )}
    </div>
  );
}
