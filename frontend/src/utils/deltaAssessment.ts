/**
 * Time-Based Delta Decay Learning Assessment System
 * 
 * This module implements the core mathematical and assessment logic for the Delta Decay system.
 * It provides functions to calculate delta scores based on time, assess learning outcomes,
 * and track aggregate course progress.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// --- Configuration & Constants ---

export type GameDifficulty = 'easy' | 'medium' | 'hard';
export type ProficiencyLevel = 'Advanced' | 'Proficient' | 'Developing' | 'Needs Improvement';
export type TimeCategory = 'Excellent' | 'Good' | 'Average' | 'Slow';

interface DifficultyConfig {
    threshold: number; // Seconds before decay starts
    maxDelta: number;  // Maximum points possible
    minDelta: number;  // Minimum points floor
    k: number;         // Decay constant
}

const DIFFICULTY_CONFIG: Record<GameDifficulty, DifficultyConfig> = {
    easy: {
        threshold: 120, // 2 minutes
        maxDelta: 60,
        minDelta: 15,
        k: 0.004
    },
    medium: {
        threshold: 300, // 5 minutes
        maxDelta: 80,
        minDelta: 20,
        k: 0.003
    },
    hard: {
        threshold: 600, // 10 minutes
        maxDelta: 100,
        minDelta: 25,
        k: 0.002
    }
};

export interface DeltaResult {
    delta: number;
    proficiency: ProficiencyLevel;
    timeCategory: TimeCategory;
    isWithinThreshold: boolean;
    config: DifficultyConfig;
}

export interface LearningOutcome {
    achieved: boolean;
    reasons: string[]; // Why it failed (if it did)
    recommendations: string[];
}

export interface GameResultData {
    gameId: string;
    gameType?: string;
    classLevel?: string;
    subject?: string;
    difficulty: GameDifficulty;
    score: number; // 0-100 or raw score
    maxScore: number;
    timeTaken: number; // Seconds
    attempts?: number;
    hintsUsed?: number;
    timestamp: number;
    // ... computed fields will be added on save
}

// --- Core Calculations ---

/**
 * Calculates the Delta score based on time taken and difficulty.
 * Implements exponential decay: Delta = Min + (Max - Min) * e^(-k * (Time - Threshold))
 */
export const calculateDelta = (
    timeTaken: number,
    difficulty: GameDifficulty = 'medium'
): DeltaResult => {
    const config = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.medium;
    let delta = 0;
    const isWithinThreshold = timeTaken <= config.threshold;

    if (isWithinThreshold) {
        delta = config.maxDelta;
    } else {
        const timeOver = timeTaken - config.threshold;
        const decayFactor = Math.exp(-config.k * timeOver);
        const range = config.maxDelta - config.minDelta;
        delta = config.minDelta + (range * decayFactor);
    }

    // Round to 2 decimal places
    delta = Math.round(delta * 100) / 100;

    // Determine Proficiency
    const range = config.maxDelta - config.minDelta;
    const earnedAboveMin = delta - config.minDelta;
    const percentageOfRange = earnedAboveMin / range;

    let proficiency: ProficiencyLevel = 'Needs Improvement';
    if (isWithinThreshold || percentageOfRange >= 0.8) proficiency = 'Advanced';
    else if (percentageOfRange >= 0.6) proficiency = 'Proficient';
    else if (percentageOfRange >= 0.4) proficiency = 'Developing';

    // Determine Time Category
    let timeCategory: TimeCategory = 'Slow';
    if (timeTaken <= config.threshold) timeCategory = 'Excellent';
    else if (timeTaken <= config.threshold * 1.5) timeCategory = 'Good';
    else if (timeTaken <= config.threshold * 2.0) timeCategory = 'Average';

    return {
        delta,
        proficiency,
        timeCategory,
        isWithinThreshold,
        config
    };
};


/**
 * Multi-Factor Learning Outcome Assessment
 * Checks if the student truly mastered the concept based on Delta, Score, and Attempts.
 */
export const assessLearningOutcome = (
    delta: number,
    scorePercentage: number, // 0-100
    attempts: number,
    hintsUsed: number,
    difficulty: GameDifficulty
): LearningOutcome => {
    const reasons: string[] = [];
    const recommendations: string[] = [];
    let achieved = true;

    // 1. Minimum Delta Thresholds
    const minDeltaReq = difficulty === 'easy' ? 25 : difficulty === 'medium' ? 35 : 50;
    if (delta < minDeltaReq) {
        achieved = false;
        reasons.push(`Delta score too low (${delta}/${minDeltaReq})`);
        recommendations.push("Focus on speed and recall. Review core concepts before attempting.");
    }

    // 2. Minimum Score Thresholds
    const minScoreReq = difficulty === 'easy' ? 60 : difficulty === 'medium' ? 70 : 80;
    if (scorePercentage < minScoreReq) {
        achieved = false;
        reasons.push(`Score too low (${Math.round(scorePercentage)}%/${minScoreReq}%)`);
        recommendations.push("Work on accuracy. Re-read the question carefully.");
    }

    // 3. Maximum Attempts
    const maxAttempts = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 2 : 1;
    if (attempts > maxAttempts) {
        achieved = false;
        reasons.push(`Too many attempts (${attempts}/${maxAttempts})`);
        recommendations.push("Practice similar problems. Consider reviewing tutorial materials.");
    }

    // 4. Hints Check (Soft fail or just recommendation)
    if (hintsUsed > 2) {
        // Doesn't strictly fail outcome, but adds recommendation
        recommendations.push("Try to solve without hints next time to build independence.");
    }

    // Success Recommendations
    if (achieved) {
        if (difficulty !== 'hard') {
            recommendations.push(`Excellent work! Ready for ${difficulty === 'easy' ? 'Medium' : 'Hard'} challenges.`);
        } else {
            recommendations.push("Outstanding mastery! You are an expert on this topic.");
        }
    }

    return { achieved, reasons, recommendations };
};


// --- Leaderboard Integration ---

/**
 * Updates global leaderboard points based on Delta.
 * Multipliers: Easy x1.0, Medium x1.5, Hard x2.0
 */
export const updateLeaderboardPoints = async (
    delta: number,
    difficulty: GameDifficulty,
    userId: string
): Promise<{ earned: number, total: number }> => {
    try {
        const multiplier = difficulty === 'easy' ? 1.0 : difficulty === 'medium' ? 1.5 : 2.0;
        const pointsEarned = Math.round(delta * multiplier);

        const key = `leaderboard_points_${userId}`;
        const currentTotalStr = await AsyncStorage.getItem(key);
        const currentTotal = currentTotalStr ? parseInt(currentTotalStr, 10) : 0;

        const newTotal = currentTotal + pointsEarned;
        await AsyncStorage.setItem(key, newTotal.toString());

        return { earned: pointsEarned, total: newTotal };
    } catch (error) {
        console.error('Failed to update leaderboard points:', error);
        return { earned: 0, total: 0 };
    }
};

// --- Aggregate Course Outcome ---

export interface CourseOutcome {
    totalGames: number;
    averageDelta: number;
    averageScore: number;
    advancedPercentage: number;
    achieved: boolean;
    requirements: {
        minGames: number;
        minAvgDelta: number;
        minAdvancedPercent: number;
    };
}

/**
 * Analyzes cumulative performance for a subject/class.
 */
export const assessCourseOutcome = async (
    userId: string,
    classLevel: string,
    subject: string
): Promise<CourseOutcome> => {
    try {
        const key = `gameResults_${userId}_${classLevel}_${subject}`;
        const storedResults = await AsyncStorage.getItem(key);

        if (!storedResults) {
            return {
                totalGames: 0, averageDelta: 0, averageScore: 0, advancedPercentage: 0, achieved: false,
                requirements: { minGames: 10, minAvgDelta: 40, minAdvancedPercent: 30 }
            };
        }

        const results: any[] = JSON.parse(storedResults);
        if (!Array.isArray(results) || results.length === 0) {
            return {
                totalGames: 0, averageDelta: 0, averageScore: 0, advancedPercentage: 0, achieved: false,
                requirements: { minGames: 10, minAvgDelta: 40, minAdvancedPercent: 30 }
            };
        }

        // Requirements Scaling
        const classInt = parseInt(classLevel) || 6;
        const requirements = {
            minGames: classInt <= 8 ? 15 : 30,
            minAvgDelta: classInt <= 8 ? 40 : 70,
            minAdvancedPercent: classInt <= 8 ? 30 : 60
        };

        const totalGames = results.length;
        const totalDelta = results.reduce((sum, r) => sum + (r.delta || 0), 0);
        const totalScore = results.reduce((sum, r) => sum + (r.score || 0), 0); // Assuming normalized 0-100 scores
        const advancedCount = results.filter(r => r.proficiency === 'Advanced').length;

        const averageDelta = totalDelta / totalGames;
        const averageScore = totalScore / totalGames; // Raw average
        const advancedPercentage = (advancedCount / totalGames) * 100;

        const achieved =
            totalGames >= requirements.minGames &&
            averageDelta >= requirements.minAvgDelta &&
            advancedPercentage >= requirements.minAdvancedPercent;

        return {
            totalGames,
            averageDelta: Math.round(averageDelta * 10) / 10,
            averageScore: Math.round(averageScore * 10) / 10,
            advancedPercentage: Math.round(advancedPercentage),
            achieved,
            requirements
        };

    } catch (error) {
        console.error('Error assessing course outcome:', error);
        return {
            totalGames: 0, averageDelta: 0, averageScore: 0, advancedPercentage: 0, achieved: false,
            requirements: { minGames: 0, minAvgDelta: 0, minAdvancedPercent: 0 }
        };
    }
};
