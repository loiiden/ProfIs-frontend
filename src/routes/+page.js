import { api_url } from '$lib/constants.js';

export const ssr = false;

export const load = async ({ fetch }) => {
    // SWS laden
    let res = await fetch(`${api_url}/api/sws/main-user/current`);
    const currentSws = await res.json();

    res = await fetch(`${api_url}/api/event/next`);
    const termine = await res.json();

    res = await fetch(`${api_url}/api/scientific-work`);
    const sworks = await res.json();

    res = await fetch(`${api_url}/api/study-program`);
	const study_programs = await res.json();

    res = await fetch(`${api_url}/api/student`);
	const students = await res.json();

    res = await fetch(`${api_url}/api/mark/info`);
	const marks = await res.json();

    return {
        marks: marks,
        sws: {
            current: currentSws, // SWS-Wert aus der API
            target: 2.0 // ZIEL: Feste Zahl
        },
        termine: termine,
        sworks: sworks,
        study_programs: study_programs,
        students: students
    };
};