<template>
  <div class="waiting-room">
    <div class="room-code">Room Code: {{ roomCode }}</div>
    <div class="username">Username: {{ username }}</div>
    <div v-for="player in players" :key="player.id" :class="{ 'ready': player.isReady }">
      {{ player.username }}
      <span class="status">{{ player.ready ? 'Ready' : 'Not Ready' }}</span>
    </div>
    
    <!-- Ready button -->
    <button @click="ready" :disabled="isReady">Ready</button>

     <!-- Start button -->
     <button @click="startGame" :disabled="!allPlayersReady">Start</button>

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

  computed: {
    allPlayersReady() {
      return this.players.length > 0 && this.players.every(player => player.ready);
    },
  },

  methods: {
    ready() {
    this.isReady = !this.isReady; // Toggle readiness status
    this.$socket.emit('player-ready', { isReady: this.isReady }); // Emit the event to the server
    console.log("you're ready", this.isReady)
  },

  startGame() {
      // Add logic to start the game
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
  'player-ready': function (data) {
    console.log('Received player ready event:', data);
    // Update isReady value based on data from server
    this.isReady = data.isReady;
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
