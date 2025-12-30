import type { AppState } from '../types';

// Updated to validate the full, shareable state object
const isStateObject = (obj: any): obj is AppState => {
    return (
        obj &&
        typeof obj === 'object' &&
        'problemFraming' in obj &&
        'realityWeights' in obj &&
        'biasTerms' in obj &&
        'activationFunction' in obj &&
        'calibrationWeights' in obj &&
        'focusedFactors' in obj &&
        'customFactors' in obj &&
        'problemFramingKeys' in obj &&
        'realityWeightsKeys' in obj &&
        'biasTermKeys' in obj
    );
};

export const serializeState = (state: AppState): string => {
    try {
        const jsonString = JSON.stringify(state);
        // Using btoa for simplicity, as it's built-in.
        // For very large states, a library like pako (for DEFLATE) could be used.
        return btoa(encodeURIComponent(jsonString));
    } catch (error) {
        console.error("Failed to serialize state:", error);
        return "";
    }
};

export const deserializeState = (encodedState: string): AppState | null => {
    try {
        if (!encodedState) return null;
        const jsonString = decodeURIComponent(atob(encodedState));
        const parsed = JSON.parse(jsonString);

        if (isStateObject(parsed)) {
            return parsed;
        }
        console.warn("Deserialized object is not a valid state object.");
        return null;
    } catch (error) {
        console.error("Failed to deserialize state:", error);
        return null;
    }
};