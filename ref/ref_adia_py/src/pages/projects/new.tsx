import React, { useState } from 'react';
import { useRouter } from 'next/router';

interface ProjectFormData {
  name: string;
  clientName: string;
  clientLocation: string;
  chillerCapacityTR: number;
  chillerType: string;
  workingDays: number;
  operatingHours: number;
  initialPowerKW: number;
  actualPowerKW: number;
  electricityTariff: number;
  waterCost: number;
  totalCFM: number;
  waterConsumption: number;
  projectCost: number;
}

/**
 * NewProject component for creating new projects
 */
export default function NewProject() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    clientName: '',
    clientLocation: '',
    chillerCapacityTR: 100,
    chillerType: 'Air-Cooled',
    workingDays: 300,
    operatingHours: 24,
    initialPowerKW: 100,
    actualPowerKW: 110,
    electricityTariff: 6.5,
    waterCost: 45,
    totalCFM: 50000,
    waterConsumption: 3,
    projectCost: 1000000
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseFloat(value) : value
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // First create the client
      const clientResponse = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.clientName,
          location: formData.clientLocation
        })
      });
      
      if (!clientResponse.ok) {
        throw new Error('Failed to create client');
      }
      
      const client = await clientResponse.json();
      
      // Then create the project with the client ID
      const projectResponse = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          clientId: client.id,
          constants: {
            clientName: formData.clientName,
            clientLocation: formData.clientLocation,
            reportDate: new Date(),
            preparedBy: 'User Input',
            chillerCapacityTR: formData.chillerCapacityTR,
            chillerType: formData.chillerType,
            workingDays: formData.workingDays,
            operatingHours: formData.operatingHours,
            initialPowerKW: formData.initialPowerKW,
            actualPowerKW: formData.actualPowerKW,
            expectedPowerReductionPct: 20,
            electricityTariff: formData.electricityTariff,
            waterCost: formData.waterCost,
            totalCFM: formData.totalCFM,
            waterConsumption: formData.waterConsumption,
            tdsRecommendation: 200,
            projectCost: formData.projectCost,
            maintenancePct: 2,
            gridEmissionFactor: 0.82,
            inflationRate: 4,
            discountRate: 8,
            projectLife: 15,
            tempReductionC: 8.15,
            copOem: 2.87,
            copActual: 2.6,
            copOptimized: 4.3
          }
        })
      });
      
      if (!projectResponse.ok) {
        throw new Error('Failed to create project');
      }
      
      const project = await projectResponse.json();
      
      // Redirect to the project page
      router.push(`/projects/${project.id}`);
      
    } catch (err) {
      console.error('Error creating project:', err);
      setError('An error occurred while creating the project. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Project</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-2">
            <h2 className="text-xl font-semibold mb-4">Project Information</h2>
          </div>
          
          <div>
            <label className="block mb-2">Project Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block mb-2">Client Name</label>
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block mb-2">Location</label>
            <input
              type="text"
              name="clientLocation"
              value={formData.clientLocation}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          
          <div className="col-span-2">
            <h2 className="text-xl font-semibold mt-6 mb-4">System Specifications</h2>
          </div>
          
          <div>
            <label className="block mb-2">Chiller Capacity (TR)</label>
            <input
              type="number"
              name="chillerCapacityTR"
              value={formData.chillerCapacityTR}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block mb-2">Chiller Type</label>
            <select
              name="chillerType"
              value={formData.chillerType}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            >
              <option value="Air-Cooled">Air-Cooled</option>
              <option value="Water-Cooled">Water-Cooled</option>
              <option value="Evaporative">Evaporative</option>
            </select>
          </div>
          
          <div>
            <label className="block mb-2">Working Days per Year</label>
            <input
              type="number"
              name="workingDays"
              value={formData.workingDays}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block mb-2">Operating Hours per Day</label>
            <input
              type="number"
              name="operatingHours"
              value={formData.operatingHours}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block mb-2">Initial Power (kW)</label>
            <input
              type="number"
              name="initialPowerKW"
              value={formData.initialPowerKW}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block mb-2">Actual Power (kW)</label>
            <input
              type="number"
              name="actualPowerKW"
              value={formData.actualPowerKW}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          
          <div className="col-span-2">
            <h2 className="text-xl font-semibold mt-6 mb-4">Economic Parameters</h2>
          </div>
          
          <div>
            <label className="block mb-2">Electricity Tariff (₹/kWh)</label>
            <input
              type="number"
              name="electricityTariff"
              value={formData.electricityTariff}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block mb-2">Water Cost (₹/m³)</label>
            <input
              type="number"
              name="waterCost"
              value={formData.waterCost}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block mb-2">Total CFM</label>
            <input
              type="number"
              name="totalCFM"
              value={formData.totalCFM}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block mb-2">Water Consumption (L/h)</label>
            <input
              type="number"
              name="waterConsumption"
              value={formData.waterConsumption}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block mb-2">Project Cost (₹)</label>
            <input
              type="number"
              name="projectCost"
              value={formData.projectCost}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
        </div>
        
        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 mr-4"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
          >
            {loading ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
}
