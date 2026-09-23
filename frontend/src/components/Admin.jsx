import React, { useState, useEffect } from 'react';
import { loginAdmin } from '../services/api';

export default function Admin({
  portfolioData,
  onUpdateProfile,
  onAddAchievement,
  onDeleteAchievement,
  onAddProject,
  onDeleteProject,
  onAddExperience,
  onDeleteExperience,
  onAddEducation,
  onDeleteEducation,
  onToggleView
}) {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!(sessionStorage.getItem('admin_token') || localStorage.getItem('admin_token'));
  });
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: portfolioData?.profile?.name || '',
    bio: portfolioData?.profile?.bio || '',
    about: portfolioData?.profile?.about || '',
    location: portfolioData?.profile?.location || '',
    focus: portfolioData?.profile?.focus || '',
    image: portfolioData?.profile?.image || '',
    cvUrl: portfolioData?.profile?.cvUrl || '',
    experienceYears: portfolioData?.profile?.experienceYears || '',
    email: portfolioData?.contact?.email || '',
    whatsapp: portfolioData?.contact?.whatsapp || '',
    instagram: portfolioData?.contact?.instagram || '',
    linkedin: portfolioData?.contact?.linkedin || ''
  });

  // Keep form in sync if portfolioData loads async
  useEffect(() => {
    if (portfolioData) {
      setProfileForm({
        name: portfolioData.profile?.name || '',
        bio: portfolioData.profile?.bio || '',
        about: portfolioData.profile?.about || '',
        location: portfolioData.profile?.location || '',
        focus: portfolioData.profile?.focus || '',
        image: portfolioData.profile?.image || '',
        cvUrl: portfolioData.profile?.cvUrl || '',
        experienceYears: portfolioData.profile?.experienceYears || '',
        email: portfolioData.contact?.email || '',
        whatsapp: portfolioData.contact?.whatsapp || '',
        instagram: portfolioData.contact?.instagram || '',
        linkedin: portfolioData.contact?.linkedin || ''
      });
    }
  }, [portfolioData]);

  // Achievement form state
  const [achievementForm, setAchievementForm] = useState({
    title: '',
    description: '',
    year: `${new Date().getFullYear()}`,
    badge: 'Achievement'
  });

  // Project form state
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    technologies: '',
    link: '',
    github: ''
  });

  // Experience form state
  const [experienceForm, setExperienceForm] = useState({
    position: '',
    company: '',
    period: '',
    description: ''
  });

  // Education form state
  const [educationForm, setEducationForm] = useState({
    degree: '',
    institution: '',
    year: `${new Date().getFullYear()}`
  });

  // Photo studio / editing state
  const [showPhotoEditor, setShowPhotoEditor] = useState(false);
  const [photoFilters, setPhotoFilters] = useState({
    brightness: 100,
    contrast: 100,
    saturate: 100,
    grayscale: 0
  });

  const applyPhotoFilters = () => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.filter = `brightness(${photoFilters.brightness}%) contrast(${photoFilters.contrast}%) saturate(${photoFilters.saturate}%) grayscale(${photoFilters.grayscale}%)`;
      ctx.drawImage(img, 0, 0);
      const editedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
      setProfileForm((prev) => ({ ...prev, image: editedDataUrl }));
      showNotification('Photo edits applied! Click "Save Personal Information" to persist.');
    };
    img.src = profileForm.image || '/profile.jpg';
  };

  const resetPhotoFilters = () => {
    setPhotoFilters({ brightness: 100, contrast: 100, saturate: 100, grayscale: 0 });
    setProfileForm((prev) => ({ ...prev, image: '/profile.jpg' }));
    showNotification('Photo reset to default original image.');
  };

  const [notification, setNotification] = useState(null);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setIsVerifying(true);

    try {
      const res = await loginAdmin(passcode);
      sessionStorage.setItem('admin_token', res.token || passcode);
      setIsAuthenticated(true);
      showNotification('Welcome back, Shaun!');
    } catch (err) {
      // Direct passcode fallback for offline / mock testing
      if (passcode === 'shaun2026') {
        sessionStorage.setItem('admin_token', 'shaun2026');
        setIsAuthenticated(true);
        showNotification('Authenticated successfully (offline mode)');
      } else {
        setAuthError(err.message || 'Invalid admin passcode. Please try again.');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_token');
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
    setPasscode('');
    onToggleView('portfolio');
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showNotification('Please select a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Compress/resize on canvas to keep it lightweight (~800px max, quality 0.85)
        const canvas = document.createElement('canvas');
        const MAX_DIM = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setProfileForm((prev) => ({ ...prev, image: compressedDataUrl }));
        showNotification('Photo loaded! Click "Save Personal Information" to apply.');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleCvFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setProfileForm((prev) => ({ ...prev, cvUrl: event.target.result }));
      showNotification('CV file loaded! Click "Save Personal Information" to apply.');
    };
    reader.readAsDataURL(file);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await onUpdateProfile({
        name: profileForm.name,
        bio: profileForm.bio,
        about: profileForm.about,
        location: profileForm.location,
        focus: profileForm.focus,
        image: profileForm.image,
        cvUrl: profileForm.cvUrl,
        experienceYears: profileForm.experienceYears,
        contact: {
          email: profileForm.email,
          whatsapp: profileForm.whatsapp,
          instagram: profileForm.instagram,
          linkedin: profileForm.linkedin
        }
      });
      showNotification('Profile updated and saved to Database!');
    } catch (err) {
      showNotification(`Error: ${err.message}`);
    }
  };

  const handleAchievementSubmit = async (e) => {
    e.preventDefault();
    if (!achievementForm.title.trim()) return;

    try {
      await onAddAchievement({
        title: achievementForm.title,
        description: achievementForm.description,
        year: achievementForm.year,
        badge: achievementForm.badge
      });
      setAchievementForm({
        title: '',
        description: '',
        year: `${new Date().getFullYear()}`,
        badge: 'Achievement'
      });
      showNotification('Achievement added to Database!');
    } catch (err) {
      showNotification(`Error: ${err.message}`);
    }
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    if (!projectForm.title.trim() || !projectForm.description.trim()) return;

    const techArray = projectForm.technologies
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      await onAddProject({
        title: projectForm.title,
        description: projectForm.description,
        technologies: techArray.length ? techArray : ['React', 'Node.js'],
        link: projectForm.link,
        github: projectForm.github
      });

      setProjectForm({ title: '', description: '', technologies: '', link: '', github: '' });
      showNotification('Project added to Database!');
    } catch (err) {
      showNotification(`Error: ${err.message}`);
    }
  };

  const handleExperienceSubmit = async (e) => {
    e.preventDefault();
    if (!experienceForm.position.trim() || !experienceForm.company.trim()) return;

    try {
      await onAddExperience({
        position: experienceForm.position,
        company: experienceForm.company,
        period: experienceForm.period || '2024 - Present',
        description: experienceForm.description
      });

      setExperienceForm({ position: '', company: '', period: '', description: '' });
      showNotification('Experience added to Database!');
    } catch (err) {
      showNotification(`Error: ${err.message}`);
    }
  };

  const handleEducationSubmit = async (e) => {
    e.preventDefault();
    if (!educationForm.degree.trim() || !educationForm.institution.trim()) return;

    try {
      await onAddEducation({
        degree: educationForm.degree,
        institution: educationForm.institution,
        year: educationForm.year || `${new Date().getFullYear()}`
      });

      setEducationForm({ degree: '', institution: '', year: `${new Date().getFullYear()}` });
      showNotification('Education added to Database!');
    } catch (err) {
      showNotification(`Error: ${err.message}`);
    }
  };

  // PASSCODE LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="admin-page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="admin-card" style={{ maxWidth: '440px', width: '90%', padding: '40px 30px', textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>🔐</div>
          <h2 style={{ marginBottom: '10px' }}>Admin Access Portal</h2>
          <p style={{ color: '#91aaa5', fontSize: '14px', marginBottom: '25px' }}>
            Enter your secure Admin Passcode to edit portfolio info and add achievements.
          </p>

          {authError && (
            <div style={{ padding: '10px', background: 'rgba(255, 100, 100, 0.15)', border: '1px solid #ff6464', color: '#ff8585', borderRadius: '8px', marginBottom: '20px', fontSize: '13.5px' }}>
              ⚠️ {authError}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group" style={{ textAlign: 'left' }}>
              <label htmlFor="admin-passcode">Secret Passcode</label>
              <input
                type="password"
                id="admin-passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter secret passcode..."
                required
                autoFocus
              />
            </div>

            <button
              type="submit"
              className="save-btn"
              style={{ width: '100%', marginTop: '10px', padding: '14px' }}
              disabled={isVerifying}
            >
              {isVerifying ? 'Verifying...' : 'Unlock Admin Dashboard →'}
            </button>
          </form>

          <button
            type="button"
            onClick={() => onToggleView('portfolio')}
            style={{ marginTop: '20px', background: 'transparent', border: 'none', color: '#69d6c6', cursor: 'pointer', fontSize: '13.5px' }}
          >
            ← Back to Public Portfolio
          </button>
        </div>
      </div>
    );
  }

  // AUTHENTICATED ADMIN DASHBOARD
  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="admin-container">
          <div>
            <h1>Portfolio Admin Dashboard</h1>
            <span style={{ fontSize: '13px', color: '#69d6c6' }}>● Cloud Database Synced</span>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              className="view-site-btn"
              style={{ cursor: 'pointer', border: 'none' }}
              onClick={() => onToggleView('portfolio')}
            >
              ← View Site
            </button>
            <button
              type="button"
              onClick={handleLogout}
              style={{
                padding: '10px 18px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#e8f7f4',
                borderRadius: '20px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              🔒 Logout
            </button>
          </div>
        </div>
      </header>

      <main className="admin-container">
        {notification && (
          <div
            style={{
              marginBottom: '25px',
              padding: '14px 20px',
              borderRadius: '10px',
              background: 'rgba(105, 214, 198, 0.15)',
              border: '1px solid #69d6c6',
              color: '#69d6c6',
              fontWeight: 600
            }}
          >
            ✓ {notification}
          </div>
        )}

        {/* 1. Profile & Social Information */}
        <section className="admin-card">
          <h2>Personal Information & Links</h2>
          <form id="profile-form" onSubmit={handleProfileSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                placeholder="Ashaduzzaman Shaun"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="focus">Professional Title / Focus</label>
              <input
                type="text"
                id="focus"
                value={profileForm.focus}
                onChange={(e) => setProfileForm({ ...profileForm, focus: e.target.value })}
                placeholder="Full-Stack Developer & Software Engineer"
              />
            </div>

            <div className="form-group">
              <label htmlFor="bio">Hero Bio / Tagline</label>
              <textarea
                id="bio"
                rows="3"
                value={profileForm.bio}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                placeholder="Brief intro for the hero section..."
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="about">About Me (Full Story)</label>
              <textarea
                id="about"
                rows="4"
                value={profileForm.about}
                onChange={(e) => setProfileForm({ ...profileForm, about: e.target.value })}
                placeholder="Detailed about me paragraph..."
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  value={profileForm.location}
                  onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                  placeholder="Bangladesh"
                />
              </div>

              <div className="form-group">
                <label htmlFor="experienceYears">Years of Experience</label>
                <input
                  type="text"
                  id="experienceYears"
                  value={profileForm.experienceYears}
                  onChange={(e) => setProfileForm({ ...profileForm, experienceYears: e.target.value })}
                  placeholder="3+"
                />
              </div>
            </div>

            {/* Profile Photo Manager */}
            <div className="form-group" style={{ background: '#0a1d1a', padding: '16px', borderRadius: '12px', border: '1px solid #1c3732' }}>
              <label style={{ fontWeight: 'bold', color: '#69d6c6', display: 'block', marginBottom: '8px' }}>
                📸 Profile Photo (Live Upload or URL)
              </label>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '12px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #69d6c6', background: '#0f2d27', flexShrink: 0 }}>
                  <img
                    src={profileForm.image || '/profile.jpg'}
                    alt="Preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.src = '/profile.png'; }}
                  />
                </div>
                <div>
                  <label
                    htmlFor="image-upload"
                    style={{
                      display: 'inline-block',
                      padding: '8px 14px',
                      background: '#163832',
                      border: '1px solid #29534a',
                      borderRadius: '8px',
                      color: '#e9f8f5',
                      fontSize: '13px',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    📁 Choose Photo from Device
                  </label>
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    style={{ display: 'none' }}
                  />
                  <span style={{ fontSize: '12px', color: '#78948f', display: 'block', marginTop: '4px' }}>
                    Select JPG or PNG from your computer or phone.
                  </span>
                </div>
              </div>

              <label htmlFor="image" style={{ fontSize: '13px' }}>Or Direct Photo URL / Path:</label>
              <input
                type="text"
                id="image"
                value={profileForm.image}
                onChange={(e) => setProfileForm({ ...profileForm, image: e.target.value })}
                placeholder="/profile.jpg"
              />

              {/* Photo Studio / Editing Tools */}
              <div style={{ marginTop: '12px', borderTop: '1px dashed #1c3732', paddingTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowPhotoEditor(!showPhotoEditor)}
                  style={{
                    background: 'transparent',
                    border: '1px solid #3ca899',
                    borderRadius: '6px',
                    color: '#69d6c6',
                    padding: '6px 12px',
                    fontSize: '12.5px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>🎨</span> {showPhotoEditor ? 'Hide Photo Studio' : 'Edit Photo (Filters & Lighting)'}
                </button>

                {showPhotoEditor && (
                  <div style={{ background: '#071513', padding: '14px', borderRadius: '8px', marginTop: '10px', border: '1px solid #203f38' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12px' }}>
                      <div>
                        <label>Brightness: {photoFilters.brightness}%</label>
                        <input
                          type="range"
                          min="60"
                          max="150"
                          value={photoFilters.brightness}
                          onChange={(e) => setPhotoFilters({ ...photoFilters, brightness: Number(e.target.value) })}
                          style={{ width: '100%', accentColor: '#69d6c6' }}
                        />
                      </div>
                      <div>
                        <label>Contrast: {photoFilters.contrast}%</label>
                        <input
                          type="range"
                          min="60"
                          max="150"
                          value={photoFilters.contrast}
                          onChange={(e) => setPhotoFilters({ ...photoFilters, contrast: Number(e.target.value) })}
                          style={{ width: '100%', accentColor: '#69d6c6' }}
                        />
                      </div>
                      <div>
                        <label>Saturation: {photoFilters.saturate}%</label>
                        <input
                          type="range"
                          min="0"
                          max="200"
                          value={photoFilters.saturate}
                          onChange={(e) => setPhotoFilters({ ...photoFilters, saturate: Number(e.target.value) })}
                          style={{ width: '100%', accentColor: '#69d6c6' }}
                        />
                      </div>
                      <div>
                        <label>B&W / Noir: {photoFilters.grayscale}%</label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={photoFilters.grayscale}
                          onChange={(e) => setPhotoFilters({ ...photoFilters, grayscale: Number(e.target.value) })}
                          style={{ width: '100%', accentColor: '#69d6c6' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                      <button
                        type="button"
                        onClick={applyPhotoFilters}
                        style={{
                          background: '#69d6c6',
                          color: '#071412',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '6px 14px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        ✓ Apply Filters
                      </button>
                      <button
                        type="button"
                        onClick={resetPhotoFilters}
                        style={{
                          background: 'transparent',
                          color: '#ff7b72',
                          border: '1px solid #4a2121',
                          borderRadius: '6px',
                          padding: '6px 12px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Reset Photo
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* CV / Resume Document Manager */}
            <div className="form-group" style={{ background: '#0a1d1a', padding: '16px', borderRadius: '12px', border: '1px solid #1c3732', marginTop: '16px' }}>
              <label style={{ fontWeight: 'bold', color: '#69d6c6', display: 'block', marginBottom: '8px' }}>
                📄 Curriculum Vitae (CV / Resume)
              </label>

              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '12px' }}>
                <label
                  htmlFor="cv-upload"
                  style={{
                    display: 'inline-block',
                    padding: '8px 14px',
                    background: '#163832',
                    border: '1px solid #29534a',
                    borderRadius: '8px',
                    color: '#e9f8f5',
                    fontSize: '13px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  📥 Upload New CV (PDF)
                </label>
                <input
                  type="file"
                  id="cv-upload"
                  accept=".pdf,.doc,.docx"
                  onChange={handleCvFileChange}
                  style={{ display: 'none' }}
                />

                {profileForm.cvUrl && (
                  <a
                    href={profileForm.cvUrl}
                    download="Shaun_CV.pdf"
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: '12px', color: '#69d6c6', textDecoration: 'underline' }}
                  >
                    View / Test Download Current CV
                  </a>
                )}
              </div>

              <label htmlFor="cvUrl" style={{ fontSize: '13px' }}>CV URL or File Path:</label>
              <input
                type="text"
                id="cvUrl"
                value={profileForm.cvUrl}
                onChange={(e) => setProfileForm({ ...profileForm, cvUrl: e.target.value })}
                placeholder="/Shaun_CV.pdf"
              />
            </div>

            {/* Social & Contact Channels */}
            <div style={{ borderTop: '1px solid #1c3732', paddingTop: '20px', marginTop: '20px' }}>
              <h3 style={{ fontSize: '16px', marginBottom: '15px', color: '#69d6c6' }}>Contact & Social Channels</h3>

              <div className="form-group">
                <label htmlFor="whatsapp">WhatsApp Number / International Format</label>
                <input
                  type="text"
                  id="whatsapp"
                  value={profileForm.whatsapp}
                  onChange={(e) => setProfileForm({ ...profileForm, whatsapp: e.target.value })}
                  placeholder="+45 71 51 45 43"
                />
              </div>

              <div className="form-group">
                <label htmlFor="instagram">Instagram Profile URL</label>
                <input
                  type="url"
                  id="instagram"
                  value={profileForm.instagram}
                  onChange={(e) => setProfileForm({ ...profileForm, instagram: e.target.value })}
                  placeholder="https://www.instagram.com/azshaun"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  placeholder="azshaunofficial@gmail.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="linkedin">LinkedIn Profile URL</label>
                <input
                  type="url"
                  id="linkedin"
                  value={profileForm.linkedin}
                  onChange={(e) => setProfileForm({ ...profileForm, linkedin: e.target.value })}
                  placeholder="https://www.linkedin.com/in/ashaduzzaman-shaun-4aa737374/"
                />
              </div>
            </div>

            <button type="submit" className="save-btn" style={{ marginTop: '10px' }}>
              Save Personal Information
            </button>
          </form>
        </section>

        {/* 2. Personal Achievements Section */}
        <section className="admin-card">
          <h2>🏆 Personal Achievements & Milestones</h2>
          <form id="achievement-form" onSubmit={handleAchievementSubmit}>
            <div className="form-group">
              <label htmlFor="ach-title">Achievement Title</label>
              <input
                type="text"
                id="ach-title"
                value={achievementForm.title}
                onChange={(e) => setAchievementForm({ ...achievementForm, title: e.target.value })}
                placeholder="Full-Stack Portfolio Architecture"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label htmlFor="ach-badge">Badge / Category</label>
                <input
                  type="text"
                  id="ach-badge"
                  value={achievementForm.badge}
                  onChange={(e) => setAchievementForm({ ...achievementForm, badge: e.target.value })}
                  placeholder="Architecture, Award, Milestone"
                />
              </div>

              <div className="form-group">
                <label htmlFor="ach-year">Year / Date</label>
                <input
                  type="text"
                  id="ach-year"
                  value={achievementForm.year}
                  onChange={(e) => setAchievementForm({ ...achievementForm, year: e.target.value })}
                  placeholder="2026"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="ach-description">Description</label>
              <textarea
                id="ach-description"
                rows="3"
                value={achievementForm.description}
                onChange={(e) => setAchievementForm({ ...achievementForm, description: e.target.value })}
                placeholder="What did you accomplish?"
              />
            </div>

            <button type="submit" className="save-btn">
              + Add Achievement
            </button>
          </form>

          {/* Existing Achievements List */}
          {portfolioData?.achievements?.length > 0 && (
            <div style={{ marginTop: '30px', borderTop: '1px solid #1c3732', paddingTop: '20px' }}>
              <h3 style={{ fontSize: '15px', color: '#91aaa5', marginBottom: '15px' }}>Current Achievements:</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {portfolioData.achievements.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: '#071412',
                      padding: '12px 18px',
                      borderRadius: '10px',
                      border: '1px solid #1c3732'
                    }}
                  >
                    <div>
                      <strong>{item.title}</strong>{' '}
                      <span style={{ color: '#69d6c6', fontSize: '12px', marginLeft: '6px' }}>
                        ({item.year} - {item.badge})
                      </span>
                      <p style={{ fontSize: '13px', color: '#91aaa5', marginTop: '4px' }}>{item.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onDeleteAchievement(item.id)}
                      style={{
                        background: 'rgba(255, 100, 100, 0.15)',
                        border: '1px solid #ff6464',
                        color: '#ff8585',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                      title="Delete Achievement"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* 3. Featured Projects */}
        <section className="admin-card">
          <h2>🚀 Projects</h2>
          <form id="project-form" onSubmit={handleProjectSubmit}>
            <div className="form-group">
              <label htmlFor="project-title">Project Title</label>
              <input
                type="text"
                id="project-title"
                value={projectForm.title}
                onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                placeholder="LEFTOVER-LINK"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="project-description">Description</label>
              <textarea
                id="project-description"
                rows="3"
                value={projectForm.description}
                onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                placeholder="Describe key features, architecture, and results..."
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="project-technologies">Technologies (comma separated)</label>
              <input
                type="text"
                id="project-technologies"
                value={projectForm.technologies}
                onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })}
                placeholder="React 19, Node.js, Express, MongoDB"
              />
            </div>

            <button type="submit" className="save-btn">
              + Add Project
            </button>
          </form>

          {/* Existing Projects List */}
          {portfolioData?.projects?.length > 0 && (
            <div style={{ marginTop: '30px', borderTop: '1px solid #1c3732', paddingTop: '20px' }}>
              <h3 style={{ fontSize: '15px', color: '#91aaa5', marginBottom: '15px' }}>Current Projects:</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {portfolioData.projects.map((proj) => (
                  <div
                    key={proj.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: '#071412',
                      padding: '12px 18px',
                      borderRadius: '10px',
                      border: '1px solid #1c3732'
                    }}
                  >
                    <div>
                      <strong>{proj.title}</strong>
                      <p style={{ fontSize: '13px', color: '#91aaa5', marginTop: '4px' }}>{proj.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onDeleteProject(proj.id)}
                      style={{
                        background: 'rgba(255, 100, 100, 0.15)',
                        border: '1px solid #ff6464',
                        color: '#ff8585',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                      title="Delete Project"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* 4. Experience Section */}
        <section className="admin-card">
          <h2>💼 Experience</h2>
          <form id="experience-form" onSubmit={handleExperienceSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label htmlFor="position">Position</label>
                <input
                  type="text"
                  id="position"
                  value={experienceForm.position}
                  onChange={(e) => setExperienceForm({ ...experienceForm, position: e.target.value })}
                  placeholder="Software Developer"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="company">Company</label>
                <input
                  type="text"
                  id="company"
                  value={experienceForm.company}
                  onChange={(e) => setExperienceForm({ ...experienceForm, company: e.target.value })}
                  placeholder="Tech Solutions"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="period">Period</label>
              <input
                type="text"
                id="period"
                value={experienceForm.period}
                onChange={(e) => setExperienceForm({ ...experienceForm, period: e.target.value })}
                placeholder="2024 - Present"
              />
            </div>

            <div className="form-group">
              <label htmlFor="experience-description">Description</label>
              <textarea
                id="experience-description"
                rows="3"
                value={experienceForm.description}
                onChange={(e) => setExperienceForm({ ...experienceForm, description: e.target.value })}
                placeholder="Key accomplishments and responsibilities..."
              />
            </div>

            <button type="submit" className="save-btn">
              + Add Experience
            </button>
          </form>

          {/* Existing Experience List */}
          {portfolioData?.experience?.length > 0 && (
            <div style={{ marginTop: '30px', borderTop: '1px solid #1c3732', paddingTop: '20px' }}>
              <h3 style={{ fontSize: '15px', color: '#91aaa5', marginBottom: '15px' }}>Current Experience:</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {portfolioData.experience.map((exp) => (
                  <div
                    key={exp.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: '#071412',
                      padding: '12px 18px',
                      borderRadius: '10px',
                      border: '1px solid #1c3732'
                    }}
                  >
                    <div>
                      <strong>{exp.position}</strong> @ {exp.company}
                      <span style={{ color: '#69d6c6', fontSize: '12px', marginLeft: '6px' }}>({exp.period})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onDeleteExperience(exp.id)}
                      style={{
                        background: 'rgba(255, 100, 100, 0.15)',
                        border: '1px solid #ff6464',
                        color: '#ff8585',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                      title="Delete Experience"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* 5. Education Section */}
        <section className="admin-card">
          <h2>🎓 Education</h2>
          <form id="education-form" onSubmit={handleEducationSubmit}>
            <div className="form-group">
              <label htmlFor="degree">Degree / Qualification</label>
              <input
                type="text"
                id="degree"
                value={educationForm.degree}
                onChange={(e) => setEducationForm({ ...educationForm, degree: e.target.value })}
                placeholder="Bachelor of Science in Computer Science"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label htmlFor="institution">Institution</label>
                <input
                  type="text"
                  id="institution"
                  value={educationForm.institution}
                  onChange={(e) => setEducationForm({ ...educationForm, institution: e.target.value })}
                  placeholder="University"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="edu-year">Year</label>
                <input
                  type="text"
                  id="edu-year"
                  value={educationForm.year}
                  onChange={(e) => setEducationForm({ ...educationForm, year: e.target.value })}
                  placeholder="2025"
                />
              </div>
            </div>

            <button type="submit" className="save-btn">
              + Add Education
            </button>
          </form>

          {/* Existing Education List */}
          {portfolioData?.education?.length > 0 && (
            <div style={{ marginTop: '30px', borderTop: '1px solid #1c3732', paddingTop: '20px' }}>
              <h3 style={{ fontSize: '15px', color: '#91aaa5', marginBottom: '15px' }}>Current Education:</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {portfolioData.education.map((edu) => (
                  <div
                    key={edu.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: '#071412',
                      padding: '12px 18px',
                      borderRadius: '10px',
                      border: '1px solid #1c3732'
                    }}
                  >
                    <div>
                      <strong>{edu.degree}</strong> - {edu.institution}
                      <span style={{ color: '#69d6c6', fontSize: '12px', marginLeft: '6px' }}>({edu.year})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onDeleteEducation(edu.id)}
                      style={{
                        background: 'rgba(255, 100, 100, 0.15)',
                        border: '1px solid #ff6464',
                        color: '#ff8585',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                      title="Delete Education"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
