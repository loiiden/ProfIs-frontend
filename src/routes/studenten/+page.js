import { api_url } from '$lib/constants.js';

export const ssr = false

export const load = async ({ fetch, params }) => {
	let res = await fetch(`${api_url}/api/student`);
	const students = await res.json();
	
    return {
        students: students
    };
};