<template>
  <div class="waiting-room">
    <div class="room-code">Room Code: {{ roomCode }}</div>
    <div class="username">Username: {{ username }}</div>
    <div v-for="player in players" :key="player.id" :class="{ 'ready': player.isReady }">
      {{ player.username }}
      <span class="status">{{ player.isReady ? 'Ready' : 'Not Ready' }}</span>
    </div>
    
    <!-- Ready button -->
    <button @click="ready" :disabled="isReady">Ready</button>
  </div>
</template>

<script>
export default {
  name: 'WaitingRoom',
  props: {
    roomCode: String, // Prop to receive the room code from the parent component
    username: String, // Prop to receive the username from the route
  },

  mounted() {
    this.$socket.on('player-list', this.updatePlayerList);
  },

  data() {
    return {
      players: [],
      isReady: false, // Track the player's own readiness status
    };
  },
  methods: {
    ready() {
    this.isReady = !this.isReady; // Toggle readiness status
    console.log('Player is ready:', this.isReady);
    this.$socket.emit('player-ready', { isReady: this.isReady });
  },

    updatePlayerList(data) {
      console.log('Received player list:', data);
      this.players = data;
    },
  },
  sockets: {
  'player-list': function (data) {
    console.log('Received player list:', data);
    console.log('Current players:', this.players);
    this.players = data; // Make sure 'players' data property is updated
  },
},

};
</script>

<style>
/* Add styles for WaitingRoom component */
.room-code {
  font-size: 20px;
  margin-bottom: 10px;
}
.username {
  font-size: 16px;
}
.ready {
  font-weight: bold; /* Apply a style for ready players */
}
.status {
  margin-left: 10px; /* Add spacing between player name and status */
}
</style>
