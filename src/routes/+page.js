export const ssr = false

export const load = async ({ fetch, params }) => {
	let res = await fetch(`http://localhost:1234/marks/average`);
	const marks = await res.json();
	
	res = await fetch(`http://localhost:1234/sws/info`);
	const sws = await res.json();

    return {
        marks: marks,
        sws: sws
    };
};