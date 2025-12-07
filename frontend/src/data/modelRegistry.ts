export const MODEL_REGISTRY: Record<string, any> = {
    'Thorax and Abdomen': require('../../assets/models/thorax.glb'),
    'Human Brain': require('../../assets/models/3d-allen-f-brain.glb'),
    'Blood Vasculature': require('../../assets/models/3d-vh-f-blood-vasculature.glb'),
    'Human Heart': require('../../assets/models/3d-vh-f-heart.glb'),
    'Human Kidney': require('../../assets/models/3d-vh-f-kidney-l.glb'),
    'Human Liver': require('../../assets/models/3d-vh-f-liver.glb'),
    'Human Lung': require('../../assets/models/3d-vh-f-lung.glb'),
    'Human Eye': require('../../assets/models/3d-vh-m-eye-l.glb'),
    'Whole Heart': require('../../assets/models/heart-_whole.glb'),
    'Brain Model': require('../../assets/models/brain1.glb'),
    'Digestive System': require('../../assets/models/digestivesystem.glb'),
    'Lungs Model': require('../../assets/models/lungs1.glb'),
};

export const getModelAssets = () => Object.keys(MODEL_REGISTRY).map(key => ({
    name: key,
    module: MODEL_REGISTRY[key]
}));
