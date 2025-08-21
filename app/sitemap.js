import connectDB from '@/lib/mongodb';
import Project from '@/lib/models/project';

export default async function sitemap() {
  const baseUrl = 'https://kahramanmimar.vercel.app';
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/tamamlanan-projeler`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/devam-eden-projeler`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/hakkimizda`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/iletisim`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // Dynamic project pages from MongoDB
  let projectPages = [];
  try {
    await connectDB();
    const projects = await Project.find().lean();
    
    projectPages = projects.map(project => ({
      url: `${baseUrl}/projects/${project.slug}`,
      lastModified: new Date(project.updatedAt),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));
  } catch (error) {
    console.error('Sitemap projeler yüklenemedi:', error);
  }

  return [...staticPages, ...projectPages];
}