const BASE_URL = import.meta.env.VITE_API_URL || '/api';

async function handleResponse(res) {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: 'Error desconocido del servidor' }));
    throw new Error(errorData.error || `HTTP ${res.status}: Error en la petición`);
  }
  return res.json();
}

export const api = {
  // Catálogo de Componentes y Tareas
  async getComponents(includeInactive = false) {
    const res = await fetch(`${BASE_URL}/catalog/components?includeInactive=${includeInactive}`);
    return handleResponse(res);
  },

  async getComponentById(id) {
    const res = await fetch(`${BASE_URL}/catalog/components/${id}`);
    return handleResponse(res);
  },

  async createComponent(data) {
    const res = await fetch(`${BASE_URL}/catalog/components`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async updateComponent(id, data) {
    const res = await fetch(`${BASE_URL}/catalog/components/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async toggleComponentActive(id) {
    const res = await fetch(`${BASE_URL}/catalog/components/${id}/toggle-active`, {
      method: 'PATCH'
    });
    return handleResponse(res);
  },

  // Tareas
  async createTask(componentId, data) {
    const res = await fetch(`${BASE_URL}/catalog/components/${componentId}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async updateTask(taskId, data) {
    const res = await fetch(`${BASE_URL}/catalog/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async deleteTask(taskId) {
    const res = await fetch(`${BASE_URL}/catalog/tasks/${taskId}`, {
      method: 'DELETE'
    });
    return handleResponse(res);
  },

  // Referencias de Horas (RF-03)
  async addHourReference(taskId, data) {
    const res = await fetch(`${BASE_URL}/catalog/tasks/${taskId}/references`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async deleteHourReference(referenceId) {
    const res = await fetch(`${BASE_URL}/catalog/references/${referenceId}`, {
      method: 'DELETE'
    });
    return handleResponse(res);
  },

  async getHistoricalProjects() {
    const res = await fetch(`${BASE_URL}/catalog/historical-projects`);
    return handleResponse(res);
  },

  // Propuestas
  async getProposals() {
    const res = await fetch(`${BASE_URL}/proposals`);
    return handleResponse(res);
  },

  async getProposalById(id) {
    const res = await fetch(`${BASE_URL}/proposals/${id}`);
    return handleResponse(res);
  },

  async createProposal(data) {
    const res = await fetch(`${BASE_URL}/proposals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async updateProposal(id, data) {
    const res = await fetch(`${BASE_URL}/proposals/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async deleteProposal(id) {
    const res = await fetch(`${BASE_URL}/proposals/${id}`, {
      method: 'DELETE'
    });
    return handleResponse(res);
  },

  // Armado de Solución y Complejidad
  async addComponentToProposal(propuestaId, componenteId, complejidad = 'media') {
    const res = await fetch(`${BASE_URL}/proposals/${propuestaId}/components`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ componente_id: componenteId, complejidad })
    });
    return handleResponse(res);
  },

  async removeComponentFromProposal(propuestaId, propCompId) {
    const res = await fetch(`${BASE_URL}/proposals/${propuestaId}/components/${propCompId}`, {
      method: 'DELETE'
    });
    return handleResponse(res);
  },

  async updateComponentComplexity(propuestaId, propCompId, complejidad) {
    const res = await fetch(`${BASE_URL}/proposals/${propuestaId}/components/${propCompId}/complexity`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ complejidad })
    });
    return handleResponse(res);
  },

  // Edición Manual con Justificación (RF-09)
  async manualEditTask(propuestaId, propTaskId, horas, justificacion) {
    const res = await fetch(`${BASE_URL}/proposals/${propuestaId}/tasks/${propTaskId}/manual-edit`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ horas, justificacion })
    });
    return handleResponse(res);
  },

  async resetManualEditTask(propuestaId, propTaskId) {
    const res = await fetch(`${BASE_URL}/proposals/${propuestaId}/tasks/${propTaskId}/reset-manual-edit`, {
      method: 'PATCH'
    });
    return handleResponse(res);
  },

  // Comparación y Validación (RF-10)
  async updateComparison(propuestaId, data) {
    const res = await fetch(`${BASE_URL}/proposals/${propuestaId}/comparison`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  // Exportaciones (RF-08)
  getExcelExportUrl(propuestaId) {
    return `${BASE_URL}/export/proposals/${propuestaId}/excel`;
  },

  getCSVExportUrl(propuestaId) {
    return `${BASE_URL}/export/proposals/${propuestaId}/csv`;
  }
};
