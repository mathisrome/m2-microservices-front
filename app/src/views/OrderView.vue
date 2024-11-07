<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import Modal from '../components/Modal.vue';
import {usePlateStore} from "@/stores/plate";
import {Plate} from "@/models/plate";
import {useAuthStore} from "@/stores/auth";

const loading = ref(false);
const cartItems = ref([]); 
const isModalVisible = ref(false);

const load = () => {
    loading.value = true;
    setTimeout(() => {
        loading.value = false;
    }, 2000);
};

const plateStore = usePlateStore()

const entries = computed(() => plateStore.plates.filter((datum) => datum.plateType === 1))
const plates = computed(() => plateStore.plates.filter((datum) => datum.plateType === 2))
const desserts = computed(() => plateStore.plates.filter((datum) => datum.plateType === 3))
const drinks = computed(() => plateStore.plates.filter((datum) => datum.plateType === 4))

const authStore = useAuthStore()
const user = computed(() => authStore.user)

const addToCart = (item: any) => {
    console.log("Ajout de l'article au panier:", item); // Pour vérifier ce qui est ajouté
    cartItems.value.push(item); // Ajoute l'article au panier
    console.log("État actuel du panier:", cartItems.value); // Pour voir le contenu du panier
};

const totalPrice = () => {
    return cartItems.value.reduce((total, item: any) => {
        // Enlève le symbole € et convertit en float
        const price = item.price;
        return total + price;
    }, 0).toFixed(2);
};

const removeFromCart = (index: number) => {
    cartItems.value.splice(index, 1);
};

const sendOrder = async (addressData: any) => {
  loading.value = true;
  try {
    const itemCounts = cartItems.value.reduce((acc: any, item: any) => {
      if (!acc[item.id]) {
        acc[item.id] = { plate: {"uuid": item.uuid}, quantity: 0 };
      }
      acc[item.id].quantity += 1;
      return acc;
    }, {});

    const orderData = {
      user: user.value?.uuid,
      details: Object.values(itemCounts),
      address1: addressData.address,
      address2: addressData.address,
      city: addressData.city,
      country: addressData.country,
      postalCode: addressData.postalCode,
    };
    console.log("Objet envoyé :", orderData)

    const response = await fetch('http://localhost:80/api/order/1.0/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem("token")
      },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erreur de validation:', errorData);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Commande envoyée avec succès:', result);
    cartItems.value = []; // Vide le panier

  } catch (error) {
    console.error('Erreur lors de l\'envoi de la commande:', error);
    alert('Une erreur est survenue lors de la commande. Veuillez réessayer.');
  } finally {
    loading.value = false;
  }
};


const modalVisible = () => {
  isModalVisible.value = true;
}

const handleModalSubmit = (addressData: any) => {
  console.log('Données reçues:', addressData);
  sendOrder(addressData);
};

onMounted(() => {
  plateStore.fetchPlates()
})
</script>

<template>
    <div class="container">
        <section class="menu-container">
            <div class="menu-content">
                <h1 class="menu-title">Menu</h1>

                <Modal 
                  v-if="isModalVisible" 
                  title="Adresse de livraison" 
                  message="Veuillez renseigner une adresse de livraison afin qu'un livreur puisse vous livrez la commande." 
                  :isVisible="isModalVisible" 
                  @close="isModalVisible = false"
                  @customEvent="handleModalSubmit" 
                />
              <h2 class="category-title">Entrées</h2>
              <div class="grid">
                <div
                    v-for="item in entries"
                    :key="item.id"
                    class="card"
                >
                  <div class="card-content">
                    <div class="text-container">
                      <h3 class="recipe-title">{{ item.name }}</h3>
<!--                      <p class="description">{{ item.description }}</p>-->
                      <p class="price">{{ item.price }} €</p>
                      <button @click="addToCart(item)" class="btn btn-secondary">Ajouter au panier</button>
                    </div>
                    <img src="https://images-ext-1.discordapp.net/external/1Bvyfshz0ejzlhVG0sLZZKaSazBP8GNG51fHbw8jEvw/%3Fq%3D80%26w%3D250%26auto%3Dformat%26fit%3Dcrop/https/plus.unsplash.com/premium_photo-1677686707466-2c86b174d072?format=webp&width=500&height=334" class="menu-image" />
                  </div>
                </div>
              </div>

              <h2 class="category-title">Plats</h2>
              <div class="grid">
                <div
                    v-for="item in plates"
                    :key="item.id"
                    class="card"
                >
                  <div class="card-content">
                    <div class="text-container">
                      <h3 class="recipe-title">{{ item.name }}</h3>
                      <!--                      <p class="description">{{ item.description }}</p>-->
                      <p class="price">{{ item.price }} €</p>
                      <button @click="addToCart(item)" class="btn btn-secondary">Ajouter au panier</button>
                    </div>
                    <img src="https://images-ext-1.discordapp.net/external/1Bvyfshz0ejzlhVG0sLZZKaSazBP8GNG51fHbw8jEvw/%3Fq%3D80%26w%3D250%26auto%3Dformat%26fit%3Dcrop/https/plus.unsplash.com/premium_photo-1677686707466-2c86b174d072?format=webp&width=500&height=334" class="menu-image" />
                  </div>
                </div>
              </div>
              <h2 class="category-title">Desserts</h2>
                <div class="grid">
                  <div
                      v-for="item in desserts"
                      :key="item.id"
                      class="card"
                  >
                    <div class="card-content">
                      <div class="text-container">
                        <h3 class="recipe-title">{{ item.name }}</h3>
                        <!--                      <p class="description">{{ item.description }}</p>-->
                        <p class="price">{{ item.price }} €</p>
                        <button @click="addToCart(item)" class="btn btn-secondary">Ajouter au panier</button>
                      </div>
                      <img src="https://images-ext-1.discordapp.net/external/1Bvyfshz0ejzlhVG0sLZZKaSazBP8GNG51fHbw8jEvw/%3Fq%3D80%26w%3D250%26auto%3Dformat%26fit%3Dcrop/https/plus.unsplash.com/premium_photo-1677686707466-2c86b174d072?format=webp&width=500&height=334" class="menu-image" />
                    </div>
                  </div>
                </div>
              <h2 class="category-title">Boissons</h2>
                  <div class="grid">
                    <div
                        v-for="item in drinks"
                        :key="item.id"
                        class="card"
                    >
                      <div class="card-content">
                        <div class="text-container">
                          <h3 class="recipe-title">{{ item.name }}</h3>
                          <!--                      <p class="description">{{ item.description }}</p>-->
                          <p class="price">{{ item.price }} €</p>
                          <button @click="addToCart(item)" class="btn btn-secondary">Ajouter au panier</button>
                        </div>
                        <img src="https://images-ext-1.discordapp.net/external/1Bvyfshz0ejzlhVG0sLZZKaSazBP8GNG51fHbw8jEvw/%3Fq%3D80%26w%3D250%26auto%3Dformat%26fit%3Dcrop/https/plus.unsplash.com/premium_photo-1677686707466-2c86b174d072?format=webp&width=500&height=334" class="menu-image" />
                      </div>
                    </div>
                  </div>
            </div>
        </section>

        <aside class="cart-container">
            <h2>Mon Panier</h2>
            <ul>
                <li v-for="(item, index) in cartItems" :key="index" class="cart-item">
                    <div class="cart-item-details">
                        <span class="cart-item-title">{{ item.name }}</span>
                        <span class="cart-item-price">{{ item.price }} €</span>
                        <button @click="removeFromCart(index)" class="btn btn-secondary">Supprimer</button>
                    </div>
                </li>
            </ul>
            <p class="cart-total">Total: {{ totalPrice() }}€</p>
            <div class="button-container">
                    <button @click="modalVisible" :disabled="loading|| cartItems.length === 0" class="btn btn-primary mt-4">
                        <span v-if="loading">Chargement...</span>
                        <span v-else>Commander</span>
                    </button>
                </div>
        </aside>



    </div>
</template>

<style scoped>
.container {
    display: flex;
}

.cart-container {
    position: sticky;
    top: 20px;
    width: 300px;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 10px;
    background-color: #f8f9fa;
    margin-left: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.cart-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    border-bottom: 1px solid #e9ecef;
}

.cart-item:last-child {
    border-bottom: none;
}

.cart-image {
    width: 50px;
    height: auto;
    border-radius: 5px;
    margin-right: 10px;
}

.cart-item-details {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
}

.cart-item-title {
    font-weight: bold;
    color: #343a40;
}

.cart-item-price {
    color: #28a745;
}

.cart-total {
    font-size: 1.25rem;
    font-weight: bold;
    margin-top: 10px;
    color: #28a745;
}

.cart-container {
  position: sticky;
  top: 20px;
  width: 250px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #f8f9fa;
  margin-left: 20px;
  height: fit-content;
  display: block; /* Assurez-vous que le panier est visible */
  color: black
}

.grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    margin-top: 15px;
}

.card {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 15px;
    border: 1px solid #ccc;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    background-color: #ffffff;
}

.card-content {
    display: flex;
    align-items: flex-start;
    gap: 15px;
    justify-content: space-between;
    flex-grow: 1;
}

.text-container {
    flex-grow: 1;
    margin-right: 15px;
}

.recipe-title {
    font-size: 1.25rem;
    margin-bottom: 5px;
    color: #343a40;
}

.description {
    font-size: 0.9rem;
    margin-bottom: 5px;
    color: #6c757d;
}

.price {
    font-size: 1rem;
    font-weight: bold;
    color: #28a745;
}

.menu-image {
    width: 100px;
    height: auto;
    object-fit: cover;
    border-radius: 8px;
}

.menu-container {
    background-color: white;
    padding: 20px;
    width: 100%;
    box-sizing: border-box;
    border-radius: 10px;
    flex: 1;
    overflow-y: auto; /* Permet de défiler le menu */
}

.menu-content {
    max-width: 1200px;
    margin: 0 auto;
}

.menu-title {
    font-size: 2.5rem;
    color: #343a40;
    margin-bottom: 20px;
    text-align: center;
}

.menu-category {
    margin: 30px 0;
}

.category-title {
    font-size: 1.5rem;
    color: #495057;
    text-transform: uppercase;
    margin-bottom: 10px;
    border-bottom: 2px solid #28a745;
    padding-bottom: 5px;
    letter-spacing: 1px;
}

.btn {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    background-color: #28a745;
    color: white;
    font-weight: bold;
    transition: background-color 0.3s;
}

.button-container {
    display: flex;
    justify-content: center;
    margin-top: 1rem;
}

.btn:hover:not(:disabled) {
    background-color: #28a745;
}

.btn:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.btn-secondary {
    padding: 5px 10px;
    border: none;
    border-radius: 5px;
    background-color: #6c757d;
    color: white;
    cursor: pointer;
    margin-top: 10px;
}

.btn-secondary:hover {
    background-color: #5a6268;
}

.mt-4 {
    margin-top: 1rem;
}

@media (max-width: 768px) {
    .menu-title {
        font-size: 2rem;
    }

    .category-title {
        font-size: 1.25rem;
    }

    .card {
        flex-direction: column;
        align-items: center;
    }

    .menu-image {
        width: 80%;
    }

    .grid {
        grid-template-columns: 1fr;
    }
}
</style>
