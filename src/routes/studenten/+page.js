export const ssr = false

export const load = async ({ fetch, params }) => {
	let res = await fetch(`http://localhost:1234/student/all`);
	const students = await res.json();
	
    return {
        students: students
    };
};