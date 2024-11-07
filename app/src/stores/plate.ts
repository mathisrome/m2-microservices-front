import {ref} from 'vue'
import {defineStore} from 'pinia'
import {User} from '@/models/user'
import type {Plate} from "@/models/plate";

export const usePlateStore = defineStore('plate', () => {
    const plates = ref<Plate[]>([])

    async function fetchPlates(): Promise<Plate[]> {
        plates.value = []
    
        return await fetch(
            "http://localhost:80/api/kitchen/1.0/plates",
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
                plates.value = data
                return data; // Add this line
            })
    }

    return {fetchPlates, plates}
})
