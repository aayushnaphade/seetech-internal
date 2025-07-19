import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

/**
 * Projects list page
 * Shows all projects and allows creation of new projects
 */
export default function Projects() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch('/api/projects');
        if (res.ok) {
          const data = await res.json();
          setProjects(data);
        } else {
          console.error('Failed to fetch projects');
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Projects</h1>
      
      {loading ? (
        <p>Loading projects...</p>
      ) : (
        <div>
          {projects.length === 0 ? (
            <p>No projects found. Create a new project to get started.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div 
                  key={project.id} 
                  className="border rounded-lg p-4 shadow hover:shadow-md transition-shadow"
                >
                  <h2 className="text-xl font-semibold">{project.name}</h2>
                  <p className="text-gray-600">{project.client?.name}</p>
                  <p className="text-sm text-gray-500">
                    Created: {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                  <div className="mt-4 flex space-x-3">
                    <Link href={`/projects/${project.id}`}>
                      <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded">
                        View
                      </button>
                    </Link>
                    <Link href={`/pdf/${project.id}`}>
                      <button className="px-3 py-1 text-sm bg-green-500 text-white rounded">
                        PDF
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-8">
            <button 
              onClick={() => router.push('/projects/new')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Create New Project
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
