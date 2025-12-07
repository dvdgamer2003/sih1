import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import GradientBackground from '../../components/ui/GradientBackground';
import CustomCard from '../../components/ui/CustomCard';
import CustomInput from '../../components/ui/CustomInput';
import api from '../../services/api';

const InstituteListScreen = () => {
    const navigation = useNavigation();
    const [institutes, setInstitutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchInstitutes();
    }, []);

    const fetchInstitutes = async () => {
        try {
            const response = await api.get('/admin/institutes');
            setInstitutes(response.data);
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch institutes');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id: string) => {
        Alert.alert(
            'Delete Institute',
            'Are you sure you want to delete this institute?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await api.delete(`/admin/institute/${id}`);
                            fetchInstitutes();
                        } catch (error) {
                            Alert.alert('Error', 'Failed to delete institute');
                        }
                    },
                },
            ]
        );
    };

    const filteredInstitutes = institutes.filter((inst: any) =>
        inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inst.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderItem = ({ item }: { item: any }) => (
        <CustomCard style={styles.card}>
            <View style={styles.cardHeader}>
                <View>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.code}>Code: {item.code}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: item.status === 'active' ? '#D1FAE5' : '#FEE2E2' }]}>
                    <Text style={[styles.statusText, { color: item.status === 'active' ? '#059669' : '#DC2626' }]}>
                        {item.status.toUpperCase()}
                    </Text>
                </View>
            </View>
            <Text style={styles.email}>{item.adminEmail}</Text>
            <View style={styles.actions}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => (navigation as any).navigate('EditInstitute', { institute: item })}
                >
                    <Ionicons name="create-outline" size={20} color="#4F46E5" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDelete(item._id)}
                >
                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                </TouchableOpacity>
            </View>
        </CustomCard>
    );

    return (
        <GradientBackground>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Institutes</Text>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => (navigation as any).navigate('CreateInstitute')}
                    >
                        <Ionicons name="add" size={24} color="#4F46E5" />
                    </TouchableOpacity>
                </View>

                <CustomInput
                    label="Search"
                    placeholder="Search institutes..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    icon={<Ionicons name="search" size={24} color="#6B7280" />}
                    style={styles.searchBar}
                />

                {loading ? (
                    <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />
                ) : (
                    <FlatList
                        data={filteredInstitutes}
                        renderItem={renderItem}
                        keyExtractor={(item: any) => item._id}
                        contentContainerStyle={styles.list}
                        ListEmptyComponent={
                            <Text style={styles.emptyText}>No institutes found</Text>
                        }
                    />
                )}
            </View>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 60,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    backButton: {
        padding: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    addButton: {
        backgroundColor: '#fff',
        padding: 8,
        borderRadius: 20,
    },
    searchBar: {
        marginBottom: 20,
    },
    list: {
        paddingBottom: 20,
    },
    card: {
        marginBottom: 15,
        padding: 15,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    code: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 2,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    email: {
        fontSize: 14,
        color: '#4B5563',
        marginBottom: 15,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
    },
    actionButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
    },
    editButton: {
        backgroundColor: '#E0E7FF',
    },
    deleteButton: {
        backgroundColor: '#FEE2E2',
    },
    emptyText: {
        color: '#fff',
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
    },
});

export default InstituteListScreen;
