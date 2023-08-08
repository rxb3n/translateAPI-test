<template>
    <div class="game-screen">
      <div class="word">{{ currentWord }}</div>
      <div class="answer" v-for="answer in answers" :key="answer.id" @click="selectAnswer(answer)">
        {{ answer.text }}
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'GameScreen',
    data() {
      return {
        currentWord: '',
        answers: [],
      };
    },
    methods: {
      selectAnswer(answer) {
        // Emit "Answer Selected" event with the selected answer
        this.$socket.emit('answer-selected', answer);
      },
    },
    sockets: {
      // Receive the current word and answer choices from the server
      'game-data': function (data) {
        this.currentWord = data.word;
        this.answers = data.answers;
      },
    },
  };
  </script>
  
  <style>
  /* Add styles for GameScreen component */
  </style>
  