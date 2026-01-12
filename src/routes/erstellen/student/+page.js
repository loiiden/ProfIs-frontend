import { api_url } from '$lib/constants.js';

export const ssr = false

export const load = async ({ fetch, params }) => {
    let res_2 = await fetch(`${api_url}/api/study-program`);
    const study_programs = await res_2.json();
    
    return {
        study_programs: study_programs,
    };
};
