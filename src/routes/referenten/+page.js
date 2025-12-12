import { api_url } from '$lib/constants.js';

export const ssr = false

export const load = async ({ fetch, params }) => {
    let res = await fetch(`${api_url}/api/evaluator`);
	const referenten = await res.json();
	
    return {
        referenten: referenten
    };
};
