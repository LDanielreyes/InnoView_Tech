import { samplePharmacies } from './data.js';

const API_BASE_URL = 'http://localhost:3000';

async function fetchFromAPI(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            ...options
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}
async function getMedicines() {
    try {
        return await fetchFromAPI('/medicines');
    } catch (error) {
        console.error('Error fetching medicines:', error);
        return medications.map((name, index) => ({
            id_medicine: index + 1,
            name: name,
            quantity: Math.floor(Math.random() * 100) + 10
        }));
    }
}

async function searchMedicineInPoints(medicineName, epsId = 1) {
    try {
        const response = await fetchFromAPI(`/search_medicine?medicine_name=${encodeURIComponent(medicineName)}&eps_id=${epsId}`);
        return response;
    } catch (error) {
        console.error('Error searching medicine:', error);
        if (error.message.includes('404')) {
            return [];
        }
        return samplePharmacies.filter(() => Math.random() > 0.3).map(pharmacy => ({
            point_name: pharmacy.name,
            address: pharmacy.address,
            quantity: pharmacy.stockCount
        }));
    }
}

export { fetchFromAPI, getMedicines, searchMedicineInPoints };