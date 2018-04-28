<template>
  <ul id="chat-box">
    <li v-for="(item, index) in messages" :key="index" class="chat-item">
      <span class="nick" v-on:click="changeTarget(item.nick)">@{{ item.nick }}: </span>
      <span>{{ item.message }}</span>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'chat-box',
  props: ['messages', 'changeTarget'],
  updated: () => {
    const chatBox = document.getElementById('chat-box')
    chatBox.scrollTo(0, chatBox.scrollHeight)
  }
}
</script>

<style scoped>
#chat-box {
  overflow: auto;
  height: 400px;
  width: 100%;
}
.chat-item {
  padding: 15px 15px;
  text-align: left;
}
.nick {
  font-weight: bold;
  color: #005fa2;
  cursor: pointer;
}
</style>
