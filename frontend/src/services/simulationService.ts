import api from './api';

export interface Visualization {
    title: string;
    fileName: string;
    description?: string;
    subject?: string;
}

const simulationService = {
    // Get visualizations for a specific subchapter
    getVisualizations: async (subchapterId: string): Promise<Visualization[]> => {
        try {
            const response = await api.get(`/learn/subchapters/${subchapterId}/visuals`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch visualizations:', error);
            return [];
        }
    },

    // Get all available simulations (for browse screen)
    getAllSimulations: async (): Promise<Visualization[]> => {
        try {
            const response = await api.get('/learn/simulations');
            return response.data;
        } catch (error) {
            console.error('Failed to fetch all simulations:', error);
            return [];
        }
    }
};

export default simulationService;
