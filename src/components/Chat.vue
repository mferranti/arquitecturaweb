<template>
  <div class="container">
    <div class="container-chat-box">
      <chat-menu class="chat-menu" :targets="targets" :changeTarget="changeTarget" :selected="selected"></chat-menu>
      <chat-box :messages="targetMessages" :changeTarget="changeTarget"></chat-box>
    </div>
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
import ChatMenu from './ChatMenu'

import io from 'socket.io-client'

const socket = io()

export default {
  name: 'chat',
  beforeRouteEnter (to, from, next) {
    window.$cookies.isKey('auth') ? next() : next('/')
  },
  data: () => ({
    nick: window.$cookies.get('auth'),
    messages: {},
    msg: '',
    targets: [
      'global'
    ],
    selected: 'global'
  }),
  methods: {
    send () {
      if (this.msg.length > 0) {
        const message = {
          target: this.selected,
          nick: this.nick,
          message: this.msg
        }
        socket.emit('chat', message)
        this.msg = ''
      }
    },
    addMessage (data) {
      const message = {nick: data.nick, message: data.message}
      this.messages = {
        ...this.messages,
        [data.target]: [
          ...(this.messages[data.target] || {}),
          message
        ]
      }
    },
    changeTarget (target) {
      this.selected = target
      if (!this.messages[target]) {
        this.messages = {
          ...this.messages,
          [target]: []
        }
      }
      if (!this.targets.includes(target)) {
        this.targets = [
          ...this.targets,
          target
        ]
      }
    }
  },
  computed: {
    targetMessages: vm => vm.messages[vm.selected]
  },
  created () {
    socket.emit('connected', { nick: this.nick })
    socket.on('chat', (data) => {
      this.addMessage(data)
      if (!this.targets.includes(data.target)) {
        this.targets = [
          ...this.targets,
          data.target
        ]
      }
    })
  },
  components: {
    ChatBox,
    ChatMenu
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
  width: 900px;
  margin: 0 auto;
  background: #d4f6ff;
  border-radius: 5px;
}
.container-chat-box {
  display: flex;
}
input:focus, button:focus {
  outline: 0;
}
</style>
