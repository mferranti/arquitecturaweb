<template>
  <div class="container">
    <chat-box :messages="messages"></chat-box>
    <div class="input-container">
      <input
        type="text"
        class="msg"
        placeholder="..."
        v-model="msg"
        v-on:keyup.13="send"
        autofocus
      >
    </div>
  </div>
</template>

<script>
import ChatBox from './ChatBox'
import io from 'socket.io-client'

const socket = io('http://localhost:5000')

export default {
  name: 'chat',
  beforeRouteEnter (to, from, next) {
    window.$cookies.isKey('auth') ? next() : next('/')
  },
  data: () => ({
    nick: window.$cookies.get('auth'),
    messages: [
      { nick: 'dino', message: 'Hola, como andas?' },
      { nick: 'raul', message: 'Bien, y vos?' },
      { nick: 'dino', message: 'bien, al pedooooo' },
      { nick: '_klifort_', message: 'Que onda viejoooooo' },
      { nick: 'autobot', message: 'We can use the v-for directive to render a list of items based on an array. The v-for directive requires a special syntax in the form of item in items, where items is the source data array and item is an alias for the array element being iterate' },
      { nick: '_klifort_', message: 'jaja quien te conoce bot' }
    ],
    msg: ''
  }),
  methods: {
    send () {
      if (this.msg.length > 0) {
        this.messages = [...this.messages, {nick: this.nick, message: this.msg}]
        this.msg = ''
      }
    }
  },
  components: {
    ChatBox
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#chat-box {
  overflow: auto;
  height: 400px;
}
.chat-item {
  padding: 15px 15px;
  text-align: left;
}
.nick {
  font-weight: bold;
  color: #005fa2;
}
.input-container {
  padding: 0 15px;
  background: #F4F4F4;
}
.msg {
  width: 100%;
  height: 40px;
  padding: 0px;
  font-size: 1.3em;
  border: 0px;
  background: #F4F4F4;
}
.msg::placeholder {
  color: #80808073;
}
.container {
  position: relative;
  text-align: center;
  width: 700px;
  margin: 0 auto;
  background: #d4f6ff;
  border-radius: 5px;
}
input:focus, button:focus {
  outline: 0;
}
</style>
