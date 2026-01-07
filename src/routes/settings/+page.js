import { api_url } from '$lib/constants.js';

export const ssr = false;

export const load = async ({ fetch }) => {
    // 1. Alle Referenten laden
    const refRes = await fetch(`${api_url}/api/evaluator`);
    const referenten = await refRes.json();

    // 2. Studiengänge laden
    const studyRes = await fetch(`${api_url}/api/study-program`);
    const studyPrograms = await studyRes.json();

    // 3. Main-User laden (aktuellen Benutzer)
    let currentUser = null;
    try {
        const userRes = await fetch(`${api_url}/api/evaluator/main-user`);
        if (userRes.ok) {
            currentUser = await userRes.json();
        }
    } catch (e) {
        console.warn("Konnte aktuellen Benutzer nicht laden:", e);
    }

    return {
        referenten: referenten,
        studyPrograms: studyPrograms,
        currentUser: currentUser
    };
};