import { api_url } from "./constants";

export async function POST(path, payload){
    return fetch(api_url + path, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "POST"  ,
        body: JSON.stringify(payload)
    });
}

export async function PATCH(path, payload){
    return fetch(api_url + path, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "PATCH",
        body: JSON.stringify(payload)
    });
}

export async function DELETE(path){
    return fetch(api_url + path, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "DELETE",
    });
}

export async function GET(path){
    return await (await fetch(api_url + path, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "GET"
    })).json();
}

