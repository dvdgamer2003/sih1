import api from './api';
import { getData, storeData } from '../offline/offlineStorage';
import { STORAGE_KEYS } from '../utils/constants';
import offlineDataService from './offlineDataService';

const CACHE_PREFIX = 'learn_cache_';

// Set to true to force offline mode (bypass API and cache)
// Set to true to force offline mode (bypass API and cache)
const FORCE_OFFLINE = true;

export const learnService = {
    getClasses: async () => {
        if (FORCE_OFFLINE) {
            console.log('[OFFLINE MODE] Using offline data for classes');
            return offlineDataService.getClasses();
        }

        try {
            const response = await api.get('/learn/classes');
            await storeData(`${CACHE_PREFIX}classes`, response.data);
            return response.data;
        } catch (error) {
            const cached = await getData(`${CACHE_PREFIX}classes`);
            if (cached) return cached;

            console.log('Using offline data for classes');
            return offlineDataService.getClasses();
        }
    },

    getSubjects: async (classId: string) => {
        if (FORCE_OFFLINE) {
            console.log('[OFFLINE MODE] Using offline data for subjects');
            return offlineDataService.getSubjects(classId);
        }

        try {
            const response = await api.get(`/learn/classes/${classId}/subjects`);
            await storeData(`${CACHE_PREFIX}subjects_${classId}`, response.data);
            return response.data;
        } catch (error) {
            const cached = await getData(`${CACHE_PREFIX}subjects_${classId}`);
            if (cached) return cached;

            console.log('Using offline data for subjects');
            return offlineDataService.getSubjects(classId);
        }
    },

    getChapters: async (subjectId: string) => {
        if (FORCE_OFFLINE) {
            console.log('[OFFLINE MODE] Using offline data for chapters');
            return offlineDataService.getChapters(subjectId);
        }

        try {
            const response = await api.get(`/learn/subjects/${subjectId}/chapters`);
            await storeData(`${CACHE_PREFIX}chapters_${subjectId}`, response.data);
            return response.data;
        } catch (error) {
            const cached = await getData(`${CACHE_PREFIX}chapters_${subjectId}`);
            if (cached) return cached;

            console.log('Using offline data for chapters');
            return offlineDataService.getChapters(subjectId);
        }
    },

    getSubchapters: async (chapterId: string) => {
        if (FORCE_OFFLINE) {
            console.log('[OFFLINE MODE] Using offline data for lessons');
            return offlineDataService.getLessons(chapterId);
        }

        try {
            const response = await api.get(`/learn/chapters/${chapterId}/subchapters`);
            await storeData(`${CACHE_PREFIX}subchapters_${chapterId}`, response.data);
            return response.data;
        } catch (error) {
            const cached = await getData(`${CACHE_PREFIX}subchapters_${chapterId}`);
            if (cached) return cached;

            console.log('Using offline data for lessons');
            return offlineDataService.getLessons(chapterId);
        }
    },

    getSubchapter: async (id: string) => {
        if (FORCE_OFFLINE) {
            console.log('[OFFLINE MODE] Using offline data for lesson');
            return offlineDataService.getLesson(id);
        }

        try {
            const response = await api.get(`/learn/subchapters/${id}`);
            await storeData(`${CACHE_PREFIX}subchapter_${id}`, response.data);
            return response.data;
        } catch (error) {
            const cached = await getData(`${CACHE_PREFIX}subchapter_${id}`);
            if (cached) return cached;

            console.log('Using offline data for lesson');
            return offlineDataService.getLesson(id);
        }
    },

    getQuiz: async (subchapterId: string) => {
        if (FORCE_OFFLINE) {
            console.log('[OFFLINE MODE] Using offline data for quiz');
            return offlineDataService.getQuiz(subchapterId);
        }

        try {
            const response = await api.get(`/learn/subchapters/${subchapterId}/quiz`);
            await storeData(`${CACHE_PREFIX}quiz_${subchapterId}`, response.data);
            return response.data;
        } catch (error) {
            const cached = await getData(`${CACHE_PREFIX}quiz_${subchapterId}`);
            if (cached) return cached;

            console.log('Using offline data for quiz');
            return offlineDataService.getQuiz(subchapterId);
        }
    },

    getChapterContent: async (chapterId: string) => {
        if (FORCE_OFFLINE) {
            console.log('[OFFLINE MODE] Using offline data for chapter content');
            return offlineDataService.getChapterContent(chapterId);
        }

        try {
            const response = await api.get(`/learn/chapters/${chapterId}/content`);
            await storeData(`${CACHE_PREFIX}chapter_content_${chapterId}`, response.data);
            return response.data;
        } catch (error) {
            const cached = await getData(`${CACHE_PREFIX}chapter_content_${chapterId}`);
            if (cached) return cached;

            console.log('Using offline data for chapter content');
            return offlineDataService.getChapterContent(chapterId);
        }
    }
};
