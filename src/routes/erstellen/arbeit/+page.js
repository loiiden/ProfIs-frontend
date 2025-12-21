import { api_url } from '$lib/constants.js';

// SSR deaktivieren
export const ssr = false;

export const load = async ({ fetch }) => {
    try {
        // Liste aller Referenten vom Backend
        const res = await fetch(`${api_url}/api/evaluator`);
        
        if (res.ok) {
            const referenten = await res.json();
            return {
                referenten: referenten
            };
        } else {
            console.error("Fehler beim Laden der Referenten:", res.status);
            return { referenten: [] };
        }
    } catch (error) {
        console.error("Server nicht erreichbar:", error);
        return { referenten: [] };
    }
};