<template>
  <div class="join-room">
    <input v-model="username" type="text" placeholder="Enter your username" />
    <input v-model="roomCode" type="text" placeholder="Enter room code" maxlength="6" />
    <select v-model="selectedLanguage">
      <option value="French">French</option>
      <option value="German">German</option>
      <option value="Spanish">Spanish</option>
    </select>
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
      selectedLanguage: 'French', // Default selected language
    };
  },
  methods: {
    joinRoom() {
      // Emit "Join Room" event with username, room code, and selected language
      this.$socket.emit('join-room', {
        username: this.username,
        roomCode: this.roomCode,
        language: this.selectedLanguage,
      });
      
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
</style>