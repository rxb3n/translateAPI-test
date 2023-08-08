import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';
import { io } from 'socket.io-client';
import JoinRoom from './components/JoinRoom.vue';
import WaitingRoom from './components/WaitingRoom.vue';
import GameScreen from './components/GameScreen.vue';

const socket = io("http://localhost:3000");

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { 
      path: '/',
     component: JoinRoom 
    },

    {
      path: '/waiting-room',
      name: 'WaitingRoom',
      component: WaitingRoom,
      props: (route) => ({
        roomCode: route.query.roomCode,
        username: route.query.username,
      }),
    },

    { 
      path: '/game-screen', 
      component: GameScreen 
    },

  ],
});

router.beforeEach((to, from, next) => {
  console.log('Navigating to:', to);
  next();
});

const app = createApp(App);

app.config.globalProperties.$socket = socket;
app.use(router);
app.mount('#app');
