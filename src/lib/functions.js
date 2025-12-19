import { api_url } from "./constants";

export async function POST(path, payload){
    return fetch(api_url + path, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "post",
        body: JSON.stringify(payload)
    });
}

export async function GET(path){
    return await (await fetch(api_url + path, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "get"
    })).json();
}

