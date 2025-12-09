// Predefined coordinates for major Indian cities
// Used for displaying user locations on the admin map

interface CityCoordinates {
    lat: number;
    lng: number;
}

// Major Indian cities with their coordinates
export const CITY_COORDINATES: Record<string, CityCoordinates> = {
    // Maharashtra
    'mumbai': { lat: 19.0760, lng: 72.8777 },
    'pune': { lat: 18.5204, lng: 73.8567 },
    'nagpur': { lat: 21.1458, lng: 79.0882 },
    'nashik': { lat: 19.9975, lng: 73.7898 },
    'aurangabad': { lat: 19.8762, lng: 75.3433 },
    'thane': { lat: 19.2183, lng: 72.9781 },
    'navi mumbai': { lat: 19.0330, lng: 73.0297 },

    // Delhi/NCR
    'delhi': { lat: 28.6139, lng: 77.2090 },
    'new delhi': { lat: 28.6139, lng: 77.2090 },
    'noida': { lat: 28.5355, lng: 77.3910 },
    'gurgaon': { lat: 28.4595, lng: 77.0266 },
    'gurugram': { lat: 28.4595, lng: 77.0266 },
    'faridabad': { lat: 28.4089, lng: 77.3178 },
    'ghaziabad': { lat: 28.6692, lng: 77.4538 },

    // Karnataka
    'bangalore': { lat: 12.9716, lng: 77.5946 },
    'bengaluru': { lat: 12.9716, lng: 77.5946 },
    'mysore': { lat: 12.2958, lng: 76.6394 },
    'mysuru': { lat: 12.2958, lng: 76.6394 },
    'mangalore': { lat: 12.9141, lng: 74.8560 },
    'hubli': { lat: 15.3647, lng: 75.1240 },

    // Tamil Nadu
    'chennai': { lat: 13.0827, lng: 80.2707 },
    'coimbatore': { lat: 11.0168, lng: 76.9558 },
    'madurai': { lat: 9.9252, lng: 78.1198 },
    'tiruchirappalli': { lat: 10.7905, lng: 78.7047 },
    'salem': { lat: 11.6643, lng: 78.1460 },

    // Telangana
    'hyderabad': { lat: 17.3850, lng: 78.4867 },
    'secunderabad': { lat: 17.4399, lng: 78.4983 },
    'warangal': { lat: 17.9689, lng: 79.5941 },

    // Gujarat
    'ahmedabad': { lat: 23.0225, lng: 72.5714 },
    'surat': { lat: 21.1702, lng: 72.8311 },
    'vadodara': { lat: 22.3072, lng: 73.1812 },
    'rajkot': { lat: 22.3039, lng: 70.8022 },
    'gandhinagar': { lat: 23.2156, lng: 72.6369 },

    // West Bengal
    'kolkata': { lat: 22.5726, lng: 88.3639 },
    'howrah': { lat: 22.5958, lng: 88.2636 },
    'durgapur': { lat: 23.5204, lng: 87.3119 },
    'siliguri': { lat: 26.7271, lng: 88.3953 },

    // Rajasthan
    'jaipur': { lat: 26.9124, lng: 75.7873 },
    'jodhpur': { lat: 26.2389, lng: 73.0243 },
    'udaipur': { lat: 24.5854, lng: 73.7125 },
    'kota': { lat: 25.2138, lng: 75.8648 },
    'ajmer': { lat: 26.4499, lng: 74.6399 },

    // Uttar Pradesh
    'lucknow': { lat: 26.8467, lng: 80.9462 },
    'kanpur': { lat: 26.4499, lng: 80.3319 },
    'agra': { lat: 27.1767, lng: 78.0081 },
    'varanasi': { lat: 25.3176, lng: 82.9739 },
    'prayagraj': { lat: 25.4358, lng: 81.8463 },
    'allahabad': { lat: 25.4358, lng: 81.8463 },
    'meerut': { lat: 28.9845, lng: 77.7064 },

    // Madhya Pradesh
    'bhopal': { lat: 23.2599, lng: 77.4126 },
    'indore': { lat: 22.7196, lng: 75.8577 },
    'gwalior': { lat: 26.2183, lng: 78.1828 },
    'jabalpur': { lat: 23.1815, lng: 79.9864 },

    // Punjab
    'chandigarh': { lat: 30.7333, lng: 76.7794 },
    'ludhiana': { lat: 30.9010, lng: 75.8573 },
    'amritsar': { lat: 31.6340, lng: 74.8723 },
    'jalandhar': { lat: 31.3260, lng: 75.5762 },

    // Haryana
    'ambala': { lat: 30.3752, lng: 76.7821 },
    'panipat': { lat: 29.3909, lng: 76.9635 },
    'rohtak': { lat: 28.8955, lng: 76.6066 },

    // Kerala
    'thiruvananthapuram': { lat: 8.5241, lng: 76.9366 },
    'kochi': { lat: 9.9312, lng: 76.2673 },
    'cochin': { lat: 9.9312, lng: 76.2673 },
    'kozhikode': { lat: 11.2588, lng: 75.7804 },
    'calicut': { lat: 11.2588, lng: 75.7804 },
    'thrissur': { lat: 10.5276, lng: 76.2144 },

    // Andhra Pradesh
    'visakhapatnam': { lat: 17.6868, lng: 83.2185 },
    'vijayawada': { lat: 16.5062, lng: 80.6480 },
    'guntur': { lat: 16.3067, lng: 80.4365 },
    'tirupati': { lat: 13.6288, lng: 79.4192 },
    'amaravati': { lat: 16.5131, lng: 80.5189 },

    // Odisha
    'bhubaneswar': { lat: 20.2961, lng: 85.8245 },
    'cuttack': { lat: 20.4625, lng: 85.8828 },
    'rourkela': { lat: 22.2604, lng: 84.8536 },

    // Bihar
    'patna': { lat: 25.5941, lng: 85.1376 },
    'gaya': { lat: 24.7955, lng: 85.0002 },
    'bhagalpur': { lat: 25.2425, lng: 87.0107 },

    // Jharkhand
    'ranchi': { lat: 23.3441, lng: 85.3096 },
    'jamshedpur': { lat: 22.8046, lng: 86.2029 },
    'dhanbad': { lat: 23.7957, lng: 86.4304 },

    // Assam
    'guwahati': { lat: 26.1445, lng: 91.7362 },
    'dibrugarh': { lat: 27.4728, lng: 94.9120 },

    // Chhattisgarh
    'raipur': { lat: 21.2514, lng: 81.6296 },
    'bilaspur': { lat: 22.0797, lng: 82.1391 },

    // Uttarakhand
    'dehradun': { lat: 30.3165, lng: 78.0322 },
    'haridwar': { lat: 29.9457, lng: 78.1642 },
    'rishikesh': { lat: 30.0869, lng: 78.2676 },

    // Goa
    'panaji': { lat: 15.4909, lng: 73.8278 },
    'goa': { lat: 15.2993, lng: 74.1240 },
    'vasco da gama': { lat: 15.3982, lng: 73.7952 },

    // Himachal Pradesh
    'shimla': { lat: 31.1048, lng: 77.1734 },
    'dharamshala': { lat: 32.2190, lng: 76.3234 },
    'manali': { lat: 32.2432, lng: 77.1892 },

    // Jammu & Kashmir
    'srinagar': { lat: 34.0837, lng: 74.7973 },
    'jammu': { lat: 32.7266, lng: 74.8570 },
};

// Default coordinates (center of India) for unknown cities
export const DEFAULT_COORDINATES: CityCoordinates = {
    lat: 20.5937,
    lng: 78.9629
};

// Get coordinates for a city (case-insensitive)
export const getCityCoordinates = (cityName: string): CityCoordinates => {
    if (!cityName) return DEFAULT_COORDINATES;

    const normalizedCity = cityName.toLowerCase().trim();
    return CITY_COORDINATES[normalizedCity] || DEFAULT_COORDINATES;
};

// Check if coordinates are known for a city
export const hasKnownCoordinates = (cityName: string): boolean => {
    if (!cityName) return false;
    const normalizedCity = cityName.toLowerCase().trim();
    return normalizedCity in CITY_COORDINATES;
};
