import { api_url } from '$lib/constants.js';

export const ssr = false

export const load = async ({ fetch, params }) => {
	let res = await fetch(`${api_url}/marks/average`);
	const marks = await res.json();
	
	res = await fetch(`${api_url}/sws/info`);
	const sws = await res.json();

    return {
        marks: marks,
        sws: sws
    };
};