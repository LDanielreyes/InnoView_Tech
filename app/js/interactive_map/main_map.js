import { fetchFromAPI, getMedicines, searchMedicineInPoints } from './api_map.js';
import { calculateDistance, transformToPharmacyFormat } from './utils.js';
import { initializeMap, addPharmacyMarkers, toggleMap } from './map.js';
import { displayResults, createPharmacyCard, showNoResults } from './ui.js';

const medications = [
    "Paracetamol", "Ibuprofeno", "Amoxicilina", "Aspirina", "Loratadina",
    "Omeprazol", "Simvastatina", "Metformina", "Enalapril", "Diclofenaco"
];

let userLocation = null;
let map = null;
let mapMarkers = [];
let isMapVisible = false;
let medicinesCache = null;

const searchInput = document.getElementById('medicationSearch');
const searchBtn = document.getElementById('searchBtn');
const searchText = document.getElementById('searchText');
const loadingSpinner = document.getElementById('loadingSpinner');
const locationStatus = document.getElementById('locationStatus');
const resultsSection = document.getElementById('resultsSection');
const pharmacyList = document.getElementById('pharmacyList');
const noResults = document.getElementById('noResults');
const initialState = document.getElementById('initialState');
const resultsCount = document.getElementById('resultsCount');
const toggleMapBtn = document.getElementById('toggleMapBtn');
const mapToggleText = document.getElementById('mapToggleText');
const mapContainer = document.getElementById('mapContainer');

async function getUserLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    resolve(userLocation);
                },
                error => {
                    userLocation = { lat: 10.9685, lng: -74.7813 };
                    resolve(userLocation);
                }
            );
        } else {
            userLocation = { lat: 10.9685, lng: -74.7813 };
            resolve(userLocation);
        }
    });
}

async function searchMedication() {
    const medication = searchInput.value.trim();
    
    if (!medication) {
        alert('Por favor ingresa el nombre de un medicamento');
        return;
    }

    searchText.textContent = 'Buscando...';
    loadingSpinner.classList.remove('hidden');
    searchBtn.disabled = true;
    locationStatus.classList.remove('hidden');
    
    resultsSection.classList.add('hidden');
    noResults.classList.add('hidden');
    initialState.classList.add('hidden');

    try {
        await getUserLocation();
        const searchResults = await searchMedicineInPoints(medication, 1);
        
        if (!searchResults || searchResults.length === 0) {
            showNoResults();
            return;
        }

        const availablePharmacies = transformToPharmacyFormat(searchResults, userLocation.lat, userLocation.lng);
        availablePharmacies.sort((a, b) => a.distance - b.distance);
        displayResults(availablePharmacies, medication);
        
    } catch (error) {
        console.error('Error searching medication:', error);
        showNoResults();
    } finally {
        searchText.textContent = 'Buscar';
        loadingSpinner.classList.add('hidden');
        searchBtn.disabled = false;
        locationStatus.classList.add('hidden');
    }
}

async function initializeData() {
    try {
        medicinesCache = await getMedicines();
        const realMedications = medicinesCache.map(med => med.name);
        medications.splice(0, medications.length, ...realMedications);
    } catch (error) {
        console.error('Error initializing data:', error);
    }
}

searchBtn.addEventListener('click', searchMedication);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchMedication();
    }
});

toggleMapBtn.addEventListener('click', () => {
    toggleMap();
    if (isMapVisible && window.currentPharmacies) {
        setTimeout(() => {
            addPharmacyMarkers(window.currentPharmacies, window.currentMedication);
        }, 200);
    }
});

searchInput.addEventListener('input', (e) => {
    const value = e.target.value.toLowerCase();
    if (value.length > 2 && medicinesCache) {
        const suggestions = medicinesCache.filter(med => 
            med.name.toLowerCase().includes(value)
        );
    }
});

document.addEventListener('DOMContentLoaded', () => {
    initializeData();
});

export { userLocation, map, mapMarkers, isMapVisible, medications, medicinesCache };