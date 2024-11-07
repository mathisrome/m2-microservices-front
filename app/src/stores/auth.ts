import {ref} from 'vue'
import {defineStore} from 'pinia'
import {User} from '@/models/user'
import { jwtDecode } from "jwt-decode";

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null)

    async function fetchProfile(uuid: string|null): Promise<null | User> {
        user.value = null

        return await fetch(
            "http://localhost:84/api/customer/1.0/users/" + uuid,
            {
                headers: {Authorization: 'Bearer ' + localStorage.getItem("token")},
            }
        )
            .then(res => {
                if (res.status === 401) {
                    return null
                }
    
                return res.json()
            })
            .then(data => {
                user.value = data

                return data; // Add this line
            })
    }

    async function login(
        username: string | undefined,
        password: string | undefined
    ) {
        return await fetch(
            "http://localhost:84/api/login",
            {
                method: "POST",
                headers: new Headers({'content-type': 'application/json'}),
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            }
        )
            .then(res => {
                if (res.status === 401) {
                    return null
                }

                return res.json()
            })
            .then(async (token) => {
                if (token !== null) {
                    localStorage.setItem("token", token)

                    const {uuid} = jwtDecode(token)

                    user.value = await fetchProfile(uuid)

                    return true
                } else {
                    return false
                }
            })
    }

    function clearUser() {
        user.value = null
    }

    return {user, login, fetchProfile, clearUser}
})
