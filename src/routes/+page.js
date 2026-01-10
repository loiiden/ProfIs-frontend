import { api_url } from '$lib/constants.js';

export const ssr = false;

export const load = async ({ fetch }) => {
    // Noten laden
    let res = await fetch(`${api_url}/marks/average`);
    const marks = await res.json();
    
    // SWS laden
    res = await fetch(`${api_url}/api/sws/main-user/current`);
    const currentSws = await res.json();

    res = await fetch(`${api_url}/api/event/next`);
    const termine = await res.json();

    return {
        marks: marks,
        sws: {
            current: currentSws, // SWS-Wert aus der API
            target: 2.0 // ZIEL: Feste Zahl
        },
        termine: termine
    };
};