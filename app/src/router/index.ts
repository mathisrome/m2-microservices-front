import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from "@/views/LoginView.vue";
import {useAuthStore} from "@/stores/auth";
import {computed} from "vue";
import OrderView from "@/views/OrderView.vue";
import {jwtDecode} from "jwt-decode";
import KitchenView from "@/views/KitchenView.vue";
import OrderTrackingView from '@/views/OrderTrackingView.vue';
import PlateView from '@/views/PlateView.vue';
import DeliveryView from '@/views/DeliveryView.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/login',
            name: 'login',
            component: LoginView
        },
        {
            path: '/order',
            name: 'order',
            component: OrderView
        },
        {
            path: '/order-tracking',
            name: 'order-tracking',
            component: OrderTrackingView
        },
        {
            path: '/plate',
            name: 'plate',
            component: PlateView
        },
        {
            path: '/kitchen',
            name: 'kitchen',
            component: KitchenView
        },
        {
            path: '/delivery',
            name: 'delivery',
            component: DeliveryView
        },
    ]
})

router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()
    const user = computed(() => authStore.user)
    const token = localStorage.getItem("token")
    if (token) {
        const {uuid} = jwtDecode(token)
        await authStore.fetchProfile(uuid)
    } else {
        authStore.clearUser()
    }

    if (to.name !== 'login' && user.value === null) {
        next({name: 'login'})
    } else {
        next()
    }
})

export default router