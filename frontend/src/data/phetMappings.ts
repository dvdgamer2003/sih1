// StreakWise Interactive Simulation Mappings
// Maps CBSE/MH Board topics to interactive simulations

export interface Simulation {
    title: string;
    fileName: string;
    description: string;
    subject: 'Physics' | 'Chemistry' | 'Math' | 'Biology';
    detailedDescription?: string;
    learningObjectives?: string[];
    difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
    estimatedTime?: string;
    topics?: string[];
    controls?: string[];
}

// Mapping of curriculum topics to interactive simulations
export const simulationMappings: Record<string, Simulation[]> = {
    // Physics Topics
    'motion_velocity_acceleration': [
        {
            title: 'Waves Intro',
            fileName: 'waves-intro_en.html',
            description: 'Explore wave motion and properties',
            subject: 'Physics',
            detailedDescription: 'Dive into the fascinating world of waves! This interactive simulation lets you explore different types of waves including water, sound, and light. Observe how waves propagate, reflect, and interfere with each other.',
            learningObjectives: [
                'Understand wave properties: amplitude, frequency, and wavelength',
                'Observe wave propagation in different mediums',
                'Explore wave interference and superposition',
                'Compare water waves, sound waves, and light waves'
            ],
            difficulty: 'Beginner',
            estimatedTime: '15-20 minutes',
            topics: ['Wave Motion', 'Wave Properties', 'Wave Types'],
            controls: ['Select wave type (Water/Sound/Light)', 'Adjust frequency and amplitude', 'Add barriers and observe reflection']
        }
    ],
    'force_and_motion': [
        {
            title: 'Buoyancy',
            fileName: 'buoyancy_en.html',
            description: 'Explore buoyancy and floating objects',
            subject: 'Physics'
        },
        {
            title: 'Buoyancy Basics',
            fileName: 'buoyancy-basics_en.html',
            description: 'Learn the basics of buoyancy',
            subject: 'Physics'
        }
    ],
    'electricity_magnetism': [
        {
            title: 'Faraday\'s Electromagnetic Lab',
            fileName: 'faradays-electromagnetic-lab_en.html',
            description: 'Explore electromagnetic induction',
            subject: 'Physics'
        },
        {
            title: 'Generator',
            fileName: 'generator_en.html',
            description: 'Learn how generators work',
            subject: 'Physics'
        }
    ],
    'waves_and_sound': [
        {
            title: 'Waves Intro',
            fileName: 'waves-intro_en.html',
            description: 'Introduction to wave properties',
            subject: 'Physics'
        }
    ],
    'quantum_physics': [
        {
            title: 'Models of the Hydrogen Atom',
            fileName: 'models-of-the-hydrogen-atom_en.html',
            description: 'Explore different models of the hydrogen atom',
            subject: 'Physics'
        },
        {
            title: 'Quantum Coin Toss',
            fileName: 'quantum-coin-toss_en.html',
            description: 'Understand quantum probability',
            subject: 'Physics'
        },
        {
            title: 'Blackbody Spectrum',
            fileName: 'blackbody-spectrum_en.html',
            description: 'Explore blackbody radiation and quantum theory',
            subject: 'Physics'
        }
    ],
    'energy': [
        {
            title: 'Energy Forms and Changes',
            fileName: 'energy-forms-and-changes_en.html',
            description: 'Explore different forms of energy and transformations',
            subject: 'Physics'
        }
    ],
    'light_optics': [
        {
            title: 'Color Vision',
            fileName: 'color-vision_en.html',
            description: 'Understand how we see colors and light perception',
            subject: 'Physics'
        }
    ],
    'gravitation_astronomy': [
        {
            title: 'Kepler\'s Laws',
            fileName: 'keplers-laws_en.html',
            description: 'Explore planetary motion and Kepler\'s three laws',
            subject: 'Physics'
        }
    ],

    // Chemistry Topics
    'atomic_structure': [
        {
            title: 'Build an Atom',
            fileName: 'build-an-atom_en.html',
            description: 'Build atoms and explore their structure',
            subject: 'Chemistry'
        },
        {
            title: 'Models of the Hydrogen Atom',
            fileName: 'models-of-the-hydrogen-atom_en.html',
            description: 'Explore atomic models',
            subject: 'Chemistry'
        },
        {
            title: 'Isotopes and Atomic Mass',
            fileName: 'isotopes-and-atomic-mass_en.html',
            description: 'Learn about isotopes and calculate atomic mass',
            subject: 'Chemistry'
        }
    ],
    'chemical_bonding': [
        {
            title: 'Molecule Shapes',
            fileName: 'molecule-shapes_en.html',
            description: 'Explore molecular geometry and bonding',
            subject: 'Chemistry'
        },
        {
            title: 'Atomic Interactions',
            fileName: 'atomic-interactions_en.html',
            description: 'Explore forces between atoms and molecules',
            subject: 'Chemistry'
        }
    ],
    'states_of_matter': [
        {
            title: 'States of Matter',
            fileName: 'states-of-matter_en.html',
            description: 'Explore solid, liquid, and gas states',
            subject: 'Chemistry'
        },
        {
            title: 'Atomic Interactions',
            fileName: 'atomic-interactions_en.html',
            description: 'See how atomic forces affect states of matter',
            subject: 'Chemistry'
        }
    ],
    'acids_bases': [
        {
            title: 'pH Scale',
            fileName: 'ph-scale_en.html',
            description: 'Learn about pH and acidity',
            subject: 'Chemistry'
        }
    ],

    // Biology Topics
    'cell_biology': [
        {
            title: 'Membrane Transport',
            fileName: 'membrane-transport_en.html',
            description: 'Explore how molecules cross cell membranes',
            subject: 'Biology'
        },
        {
            title: 'Gene Expression Essentials',
            fileName: 'gene-expression-essentials_en.html',
            description: 'Learn about DNA, RNA, and protein synthesis',
            subject: 'Biology'
        }
    ],
    'genetics': [
        {
            title: 'Gene Expression Essentials',
            fileName: 'gene-expression-essentials_en.html',
            description: 'Understand gene expression and regulation',
            subject: 'Biology'
        },
        {
            title: 'Natural Selection',
            fileName: 'natural-selection_en.html',
            description: 'Explore evolution by natural selection',
            subject: 'Biology'
        }
    ],
    'evolution': [
        {
            title: 'Natural Selection',
            fileName: 'natural-selection_en.html',
            description: 'See how traits evolve over time',
            subject: 'Biology'
        }
    ],
    'nervous_system': [
        {
            title: 'Neuron',
            fileName: 'neuron_en.html',
            description: 'Explore how neurons transmit signals',
            subject: 'Biology'
        }
    ],
};

// Helper functions
export const getSimulationsByTopic = (topicKey: string): Simulation[] => {
    return simulationMappings[topicKey] || [];
};

export const getAllSimulations = (): Simulation[] => {
    const allSims: Simulation[] = [];
    Object.values(simulationMappings).forEach(sims => {
        allSims.push(...sims);
    });
    // Remove duplicates based on fileName
    const uniqueSims = allSims.filter((sim, index, self) =>
        index === self.findIndex((s) => s.fileName === sim.fileName)
    );
    return uniqueSims;
};

export const getSimulationsBySubject = (subject: 'Physics' | 'Chemistry' | 'Math' | 'Biology'): Simulation[] => {
    return getAllSimulations().filter(sim => sim.subject === subject);
};
