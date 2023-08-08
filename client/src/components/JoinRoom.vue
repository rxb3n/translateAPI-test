<template>
    <div class="join-room">
      <input v-model="username" type="text" placeholder="Enter your username" />
      <input v-model="roomCode" placeholder="Enter room code" maxlength="4" />
      <button @click="joinRoom">Join Room</button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'JoinRoom',
    data() {
      return {
        username: '',
        roomCode: '',
      };
    },
    methods: {
      joinRoom() {
        // Emit "Join Room" event with username and room code
        this.$socket.emit('join-room', { username: this.username, roomCode: this.roomCode });
        this.$router.push({
  name: 'WaitingRoom',
  query: {
    roomCode: this.roomCode,
    username: this.username,
  },
});
      },
    },
  };
  </script>
  
  <style>
  /* Add styles for JoinRoom component */
  </style>
  