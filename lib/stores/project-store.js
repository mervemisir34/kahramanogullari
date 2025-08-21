import { create } from 'zustand';

export const useProjectStore = create((set, get) => ({
  projects: [],
  isLoading: false,
  error: null,
  pagination: null,
  stats: {
    totalProjects: 0,
    completedProjects: 0,
    ongoingProjects: 0
  },

  // Fetch projects from API
  fetchProjects: async (options = {}) => {
    set({ isLoading: true, error: null });
    try {
      const { 
        page = 1, 
        limit = 12, 
        status = null, 
        homepage = false,
        append = false 
      } = options;
      
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      if (status) params.append('status', status);
      if (homepage) params.append('homepage', 'true');
      
      const response = await fetch(`/api/projects?${params}`);
      const result = await response.json();
      
      if (result.success) {
        const projects = result.data.map(project => ({
          ...project,
          id: project._id, // MongoDB _id'yi id'ye çevir
        }));
        
        if (append) {
          // Mevcut projelere ekleme yap
          set(state => ({
            projects: [...state.projects, ...projects],
            pagination: result.pagination,
            isLoading: false
          }));
        } else {
          // Projeleri değiştir
          set({ 
            projects, 
            pagination: result.pagination,
            isLoading: false 
          });
        }
      } else {
        set({ error: result.error, isLoading: false });
      }
    } catch (error) {
      console.error('Projeler yüklenemedi:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  // Homepage için hızlı fetch
  fetchHomepageProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/projects?homepage=true');
      const result = await response.json();
      
      if (result.success) {
        // API artık { completed: [], ongoing: [] } formatında döndürüyor
        const completedProjects = result.data.completed.map(project => ({
          ...project,
          id: project._id,
        }));
        const ongoingProjects = result.data.ongoing.map(project => ({
          ...project,
          id: project._id,
        }));
        
        // Tüm projeleri birleştir
        const allProjects = [...completedProjects, ...ongoingProjects];
        set({ projects: allProjects, isLoading: false });
      } else {
        set({ error: result.error, isLoading: false });
      }
    } catch (error) {
      console.error('Homepage projeleri yüklenemedi:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  // Get all projects
  getAllProjects: () => {
    return get().projects;
  },

  // Get completed projects
  getCompletedProjects: () => {
    return get().projects.filter(project => project.status === 'COMPLETED');
  },

  // Get ongoing projects
  getOngoingProjects: () => {
    return get().projects.filter(project => project.status === 'ONGOING');
  },

  // Get project by slug
  getProjectBySlug: (slug) => {
    return get().projects.find(project => project.slug === slug);
  },

  // Get project by ID
  getProjectById: (id) => {
    return get().projects.find(project => project.id === id);
  },

  // Add new project (for admin)
  addProject: (project) => {
    const newProject = {
      ...project,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set(state => ({
      projects: [newProject, ...state.projects]
    }));
    return newProject;
  },

  // Update project (for admin)
  updateProject: (id, updates) => {
    set(state => ({
      projects: state.projects.map(project => 
        project.id === id 
          ? { ...project, ...updates, updatedAt: new Date().toISOString() }
          : project
      )
    }));
  },

  // Delete project (for admin)
  deleteProject: async (id) => {
    try {
      const response = await fetch(`/api/projects?id=${id}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (result.success) {
        set(state => ({
          projects: state.projects.filter(project => project.id !== id)
        }));
        return { success: true };
      } else {
        throw new Error(result.error || 'Proje silinemedi');
      }
    } catch (error) {
      console.error('Proje silme hatası:', error);
      set({ error: error.message });
      return { success: false, error: error.message };
    }
  },

  // Set loading state
  setLoading: (isLoading) => {
    set({ isLoading });
  },

  // Set error state
  setError: (error) => {
    set({ error });
  },

  // Fetch stats
  fetchStats: async () => {
    try {
      const response = await fetch('/api/stats');
      const result = await response.json();
      
      if (result.success) {
        set({ stats: result.data });
      } else {
        console.error('Stats getirme hatası:', result.error);
      }
    } catch (error) {
      console.error('Stats API hatası:', error);
    }
  },

  // Get stats
  getStats: () => {
    return get().stats;
  },
}));