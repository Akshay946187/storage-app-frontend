export async function loginWithGoogle(idToken:string) {
    const response = await fetch('http://localhost:3000/user/google',{
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