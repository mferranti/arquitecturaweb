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

const socket = io()

export default {
  name: 'chat',
  beforeRouteEnter (to, from, next) {
    window.$cookies.isKey('auth') ? next() : next('/')
  },
  data: () => ({
    nick: window.$cookies.get('auth'),
    messages: [],
    msg: ''
  }),
  methods: {
    send () {
      if (this.msg.length > 0) {
        socket.emit('chat', {
          nick: this.nick,
          message: this.msg
        })
        this.msg = ''
      }
    }
  },
  components: {
    ChatBox
  },
  created () {
    socket.on('chat', (data) => {
      this.messages.push(data)
    })
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
