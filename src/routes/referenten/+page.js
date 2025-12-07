export const ssr = false

export const load = async ({ fetch, params }) => {
	let res = await fetch(`http://localhost:1234/referent/all`);
	const referenten = await res.json();
	
    return {
        referenten: referenten
    };
};