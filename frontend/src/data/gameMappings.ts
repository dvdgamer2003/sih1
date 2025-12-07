// Game mappings for different topics
// Maps topic keys to available games

export interface GameMapping {
    gameId: string;
    gameName: string;
    gameScreen: string;
}

export const GAME_MAPPINGS: Record<string, GameMapping[]> = {
    // Class 9 - Science
    'class-9-science-motion': [
        { gameId: 'force', gameName: 'Force Simulator', gameScreen: 'ForcePlayGame' }
    ],
    'class-9-science-force_and_laws_of_motion': [
        { gameId: 'force', gameName: 'Force Simulator', gameScreen: 'ForcePlayGame' }
    ],

    // Class 10 - Science
    'class-10-science-chemical_reactions': [
        { gameId: 'chemistry', gameName: 'Balance Equations', gameScreen: 'ChemistryBalanceGame' }
    ],
    'class-10-science-acids_bases_and_salts': [
        { gameId: 'chemistry', gameName: 'Balance Equations', gameScreen: 'ChemistryBalanceGame' }
    ],

    // Class 7 - Science
    'class-7-science-nutrition_in_plants': [
        { gameId: 'cell', gameName: 'Cell Structure Quiz', gameScreen: 'CellStructureQuiz' }
    ],
    'class-7-science-human_body': [
        { gameId: 'organ', gameName: 'Label the Organ', gameScreen: 'LabelOrganGame' }
    ],

    // Class 8 - Science
    'class-8-science-cell_structure_and_functions': [
        { gameId: 'cell', gameName: 'Cell Structure Quiz', gameScreen: 'CellStructureQuiz' }
    ],
    'class-8-science-body_systems': [
        { gameId: 'organ', gameName: 'Label the Organ', gameScreen: 'LabelOrganGame' }
    ],

    // Class 9 - Biology
    'class-9-science-tissues': [
        { gameId: 'cell', gameName: 'Cell Structure Quiz', gameScreen: 'CellStructureQuiz' }
    ],
    'class-9-science-the_fundamental_unit_of_life': [
        { gameId: 'cell', gameName: 'Cell Structure Quiz', gameScreen: 'CellStructureQuiz' }
    ],

    // Math - All classes
    'class-6-mathematics-whole_numbers': [
        { gameId: 'math', gameName: 'Quick Math Challenge', gameScreen: 'QuickMathGame' }
    ],
    'class-7-mathematics-integers': [
        { gameId: 'math', gameName: 'Quick Math Challenge', gameScreen: 'QuickMathGame' }
    ],
    'class-8-mathematics-rational_numbers': [
        { gameId: 'math', gameName: 'Quick Math Challenge', gameScreen: 'QuickMathGame' }
    ],
    'class-9-mathematics-number_systems': [
        { gameId: 'math', gameName: 'Quick Math Challenge', gameScreen: 'QuickMathGame' }
    ],
    'class-10-mathematics-real_numbers': [
        { gameId: 'math', gameName: 'Quick Math Challenge', gameScreen: 'QuickMathGame' }
    ],
};

export const getGamesForTopic = (topicKey: string): GameMapping[] => {
    return GAME_MAPPINGS[topicKey] || [];
};

export const hasGamesForTopic = (topicKey: string): boolean => {
    return !!GAME_MAPPINGS[topicKey] && GAME_MAPPINGS[topicKey].length > 0;
};

export const generateTopicKey = (classNumber: string, subject: string, chapterName: string): string => {
    const normalizedClass = `class-${classNumber}`;
    const normalizedSubject = subject.toLowerCase().replace(/\s+/g, '_');
    const normalizedChapter = chapterName.toLowerCase().replace(/\s+/g, '_');
    return `${normalizedClass}-${normalizedSubject}-${normalizedChapter}`;
};
