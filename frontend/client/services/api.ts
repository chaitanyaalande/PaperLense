import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

export interface ScanResponse {
  text: string;
  document_type: string;
  confidence: number;
}

// Helper to get token from localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem("scanify_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const ocrService = {
  scanDocument: async (file: File): Promise<ScanResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post<ScanResponse>(`${API_BASE_URL}/scan`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        ...getAuthHeaders(),
      },
    });
    return response.data;
  },

  saveClassifiedDocument: async (
    file: File,
    category: string,
    text: string = "",
    confidence: number = 0
  ): Promise<{ message: string; filename: string; category: string }> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("document_type", category);
    formData.append("text", text);
    formData.append("confidence", confidence.toString());
    formData.append("original_filename", file.name);

    const response = await axios.post(`${API_BASE_URL}/save-document`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        ...getAuthHeaders(),
      },
    });
    return response.data;
  },

  getCategories: async (): Promise<{ [key: string]: number }> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      return {};
    }
  },

  getCategoryDocuments: async (category: string): Promise<any[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/documents/${category}`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      return [];
    }
  },

  getAllDocuments: async (): Promise<any[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/documents`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      return [];
    }
  },

  deleteDocument: async (category: string, filename: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/documents/${category}/${filename}`, {
      headers: getAuthHeaders(),
    });
  },
};
