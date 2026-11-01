const BACKEND_URL = import.meta.env.VITE_BACKEND_BASE_URL;
export async function loginWithGoogle(idToken:string) {
    const response = await fetch(`${BACKEND_URL}/user/google`,{
        method : "POST",
        headers :{
            'Content-Type':"application/json"
        },
        body : JSON.stringify({idToken}),
        credentials : "include"
    })
    const data = await response.json()
    return data
}