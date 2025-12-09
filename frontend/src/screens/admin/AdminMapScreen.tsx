import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Surface, TextInput } from 'react-native-paper';
import { WebView } from 'react-native-webview';
import GradientBackground from '../../components/ui/GradientBackground';
import api from '../../services/api';
import { getCityCoordinates, DEFAULT_COORDINATES } from '../../data/cityCoordinates';

interface CityData {
    city: string;
    totalUsers: number;
    students: number;
    teachers: number;
    institutes: number;
}

interface UserData {
    _id: string;
    name: string;
    email: string;
    role: string;
    city?: string;
}

const AdminMapScreen = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [cities, setCities] = useState<CityData[]>([]);
    const [selectedCity, setSelectedCity] = useState<string>('');
    const [citySearch, setCitySearch] = useState('');
    const [showCityList, setShowCityList] = useState(false);
    const [cityUsers, setCityUsers] = useState<{
        students: UserData[];
        teachers: UserData[];
        institutes: UserData[];
        counts: { students: number; teachers: number; institutes: number };
    } | null>(null);
    const [mapHtml, setMapHtml] = useState('');
    const webViewRef = useRef<WebView>(null);

    useEffect(() => {
        fetchCities();
    }, []);

    useEffect(() => {
        if (selectedCity) {
            fetchUsersByCity(selectedCity);
        } else {
            // Show all cities on map
            updateMapWithAllCities();
        }
    }, [selectedCity, cities]);

    const fetchCities = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/cities');
            setCities(response.data);
        } catch (error) {
            console.error('Failed to fetch cities:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsersByCity = async (city: string) => {
        try {
            const response = await api.get(`/admin/users/by-city?city=${encodeURIComponent(city)}`);
            setCityUsers({
                students: response.data.students,
                teachers: response.data.teachers,
                institutes: response.data.institutes,
                counts: response.data.counts
            });
            updateMapWithCity(city, response.data);
        } catch (error) {
            console.error('Failed to fetch users by city:', error);
        }
    };

    const updateMapWithAllCities = () => {
        const markers = cities
            .filter(city => city.city) // Filter out null/empty cities
            .map(city => {
                const coords = getCityCoordinates(city.city);
                return {
                    lat: coords.lat,
                    lng: coords.lng,
                    city: city.city,
                    students: city.students,
                    teachers: city.teachers,
                    institutes: city.institutes,
                    total: city.totalUsers
                };
            });

        const html = generateMapHtml(markers, DEFAULT_COORDINATES.lat, DEFAULT_COORDINATES.lng, 5);
        setMapHtml(html);
    };

    const updateMapWithCity = (city: string, data: any) => {
        const coords = getCityCoordinates(city);
        const markers = [{
            lat: coords.lat,
            lng: coords.lng,
            city: city,
            students: data.counts.students,
            teachers: data.counts.teachers,
            institutes: data.counts.institutes,
            total: data.totalUsers
        }];

        const html = generateMapHtml(markers, coords.lat, coords.lng, 12);
        setMapHtml(html);
    };

    const generateMapHtml = (markers: any[], centerLat: number, centerLng: number, zoom: number) => {
        const markersJson = JSON.stringify(markers);

        return `
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body, #map { width: 100%; height: 100%; }
        .custom-popup { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        .popup-title { font-weight: bold; font-size: 16px; margin-bottom: 8px; color: #1F2937; }
        .popup-row { display: flex; align-items: center; gap: 8px; margin: 4px 0; font-size: 14px; }
        .dot { width: 10px; height: 10px; border-radius: 50%; }
        .student-dot { background-color: #10B981; }
        .teacher-dot { background-color: #3B82F6; }
        .institute-dot { background-color: #8B5CF6; }
        .legend {
            position: absolute;
            bottom: 20px;
            right: 10px;
            background: white;
            padding: 12px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.15);
            z-index: 1000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 12px;
        }
        .legend-title { font-weight: bold; margin-bottom: 8px; font-size: 14px; }
        .legend-item { display: flex; align-items: center; gap: 8px; margin: 4px 0; }
    </style>
</head>
<body>
    <div id="map"></div>
    <div class="legend">
        <div class="legend-title">User Types</div>
        <div class="legend-item"><div class="dot student-dot"></div> Students</div>
        <div class="legend-item"><div class="dot teacher-dot"></div> Teachers</div>
        <div class="legend-item"><div class="dot institute-dot"></div> Institutes</div>
    </div>
    <script>
        var map = L.map('map').setView([${centerLat}, ${centerLng}], ${zoom});
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18
        }).addTo(map);

        var markers = ${markersJson};
        
        markers.forEach(function(m) {
            var totalSize = Math.min(40, Math.max(20, 10 + m.total * 2));
            
            var icon = L.divIcon({
                className: 'custom-marker',
                html: '<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); width: ' + totalSize + 'px; height: ' + totalSize + 'px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px;">' + m.total + '</div>',
                iconSize: [totalSize, totalSize],
                iconAnchor: [totalSize/2, totalSize/2]
            });

            var marker = L.marker([m.lat, m.lng], { icon: icon }).addTo(map);
            
            var popupContent = '<div class="custom-popup">' +
                '<div class="popup-title">' + m.city + '</div>' +
                '<div class="popup-row"><div class="dot student-dot"></div> Students: <strong>' + m.students + '</strong></div>' +
                '<div class="popup-row"><div class="dot teacher-dot"></div> Teachers: <strong>' + m.teachers + '</strong></div>' +
                '<div class="popup-row"><div class="dot institute-dot"></div> Institutes: <strong>' + m.institutes + '</strong></div>' +
                '</div>';
            
            marker.bindPopup(popupContent);
        });
    </script>
</body>
</html>
        `;
    };

    const filteredCities = cities.filter(c =>
        c.city && c.city.toLowerCase().includes(citySearch.toLowerCase())
    );

    const selectCity = (city: string) => {
        setSelectedCity(city);
        setCitySearch(city);
        setShowCityList(false);
    };

    const clearSelection = () => {
        setSelectedCity('');
        setCitySearch('');
        setCityUsers(null);
    };

    return (
        <GradientBackground>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.title}>User Locations</Text>
                    <TouchableOpacity onPress={fetchCities} style={styles.refreshButton}>
                        <Ionicons name="refresh" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* City Search */}
                <View style={styles.searchContainer}>
                    <TextInput
                        mode="outlined"
                        placeholder="Search city..."
                        value={citySearch}
                        onChangeText={(text) => {
                            setCitySearch(text);
                            setShowCityList(true);
                            if (!text) {
                                clearSelection();
                            }
                        }}
                        onFocus={() => setShowCityList(true)}
                        style={styles.searchInput}
                        left={<TextInput.Icon icon="magnify" />}
                        right={selectedCity ? <TextInput.Icon icon="close" onPress={clearSelection} /> : null}
                        outlineColor="#E2E8F0"
                        activeOutlineColor="#667eea"
                    />

                    {showCityList && citySearch && filteredCities.length > 0 && (
                        <Surface style={styles.cityList} elevation={4}>
                            <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled>
                                {filteredCities.map((city, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.cityItem}
                                        onPress={() => selectCity(city.city)}
                                    >
                                        <View style={styles.cityItemContent}>
                                            <MaterialCommunityIcons name="map-marker" size={20} color="#667eea" />
                                            <Text style={styles.cityName}>{city.city}</Text>
                                        </View>
                                        <Text style={styles.cityCount}>{city.totalUsers} users</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </Surface>
                    )}
                </View>

                {/* Stats Cards */}
                {cityUsers && (
                    <View style={styles.statsContainer}>
                        <Surface style={[styles.statCard, { backgroundColor: '#10B981' }]} elevation={2}>
                            <Ionicons name="school" size={20} color="#fff" />
                            <Text style={styles.statValue}>{cityUsers.counts.students}</Text>
                            <Text style={styles.statLabel}>Students</Text>
                        </Surface>
                        <Surface style={[styles.statCard, { backgroundColor: '#3B82F6' }]} elevation={2}>
                            <Ionicons name="person" size={20} color="#fff" />
                            <Text style={styles.statValue}>{cityUsers.counts.teachers}</Text>
                            <Text style={styles.statLabel}>Teachers</Text>
                        </Surface>
                        <Surface style={[styles.statCard, { backgroundColor: '#8B5CF6' }]} elevation={2}>
                            <Ionicons name="business" size={20} color="#fff" />
                            <Text style={styles.statValue}>{cityUsers.counts.institutes}</Text>
                            <Text style={styles.statLabel}>Institutes</Text>
                        </Surface>
                    </View>
                )}

                {/* Map */}
                <View style={styles.mapContainer}>
                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#667eea" />
                            <Text style={styles.loadingText}>Loading map data...</Text>
                        </View>
                    ) : cities.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <MaterialCommunityIcons name="map-marker-off" size={64} color="#9CA3AF" />
                            <Text style={styles.emptyTitle}>No Location Data</Text>
                            <Text style={styles.emptyText}>No users have set their city yet.</Text>
                            <Text style={styles.emptyHint}>Users can add their city in Profile → Edit Profile</Text>
                        </View>
                    ) : (
                        Platform.OS === 'web' ? (
                            <iframe
                                srcDoc={mapHtml}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    border: 'none',
                                    borderRadius: 16
                                }}
                                title="User Locations Map"
                            />
                        ) : (
                            <WebView
                                ref={webViewRef}
                                source={{ html: mapHtml }}
                                style={styles.map}
                                javaScriptEnabled={true}
                                domStorageEnabled={true}
                                startInLoadingState={true}
                                renderLoading={() => (
                                    <View style={styles.loadingContainer}>
                                        <ActivityIndicator size="large" color="#667eea" />
                                    </View>
                                )}
                                onError={(syntheticEvent) => {
                                    const { nativeEvent } = syntheticEvent;
                                    console.error('WebView error:', nativeEvent);
                                }}
                            />
                        )
                    )}
                </View>

                {/* Total Cities Info */}
                {!loading && cities.length > 0 && !selectedCity && (
                    <View style={styles.totalInfo}>
                        <MaterialCommunityIcons name="map-marker-multiple" size={20} color="#fff" />
                        <Text style={styles.totalText}>
                            {cities.length} cities with {cities.reduce((sum, c) => sum + c.totalUsers, 0)} total users
                        </Text>
                    </View>
                )}
            </View>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    backButton: {
        padding: 8,
    },
    refreshButton: {
        padding: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    searchContainer: {
        paddingHorizontal: 20,
        marginBottom: 15,
        zIndex: 100,
    },
    searchInput: {
        backgroundColor: '#fff',
    },
    cityList: {
        position: 'absolute',
        top: 60,
        left: 20,
        right: 20,
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        zIndex: 100,
    },
    cityItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    cityItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    cityName: {
        fontSize: 16,
        color: '#1F2937',
    },
    cityCount: {
        fontSize: 14,
        color: '#6B7280',
    },
    statsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 10,
        marginBottom: 15,
    },
    statCard: {
        flex: 1,
        padding: 12,
        borderRadius: 12,
        alignItems: 'center',
        gap: 4,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    statLabel: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.9)',
    },
    mapContainer: {
        flex: 1,
        marginHorizontal: 20,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#fff',
    },
    map: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#6B7280',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        backgroundColor: '#F9FAFB',
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#374151',
        marginTop: 16,
    },
    emptyText: {
        fontSize: 16,
        color: '#6B7280',
        marginTop: 8,
        textAlign: 'center',
    },
    emptyHint: {
        fontSize: 14,
        color: '#9CA3AF',
        marginTop: 16,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    totalInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 15,
    },
    totalText: {
        color: '#fff',
        fontSize: 14,
    },
});

export default AdminMapScreen;
