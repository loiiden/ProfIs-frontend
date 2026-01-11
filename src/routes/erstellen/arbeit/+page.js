import { api_url } from '$lib/constants.js';

// SSR deaktivieren
export const ssr = false;

export const load = async ({ fetch }) => {
    try {
        // Liste aller Referenten vom Backend
        const res = await fetch(`${api_url}/api/evaluator`);
        
        if (res.ok) {
            const referenten = await res.json();

            let res1 = await fetch(`${api_url}/api/study-program`);
            const study_programs = await res1.json();

            res1 = await fetch(`${api_url}/api/student`);
            const students = await res1.json();

            return {
                referenten: referenten,
                students: students,
                study_programs: study_programs
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