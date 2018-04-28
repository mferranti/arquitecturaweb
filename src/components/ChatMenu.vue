<template>
  <ul id="chat-menu">
    <li
      v-for="(target, index) in targets"
      :key="index"
      :class="{ 'chat-item': true, 'target-selected': (target === selected) }"
      v-on:click="changeTarget(target)"
    >
      <span class="chat-id">{{ target }}</span>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'chat-menu',
  props: ['targets', 'changeTarget', 'selected']
}
</script>

<style scoped>
#chat-menu {
  background: #d4f6ff;
  border-right: 5px solid #ffcfff;
  width: 300px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.chat-item {
  padding: 15px 15px;
  text-align: left;
  color: #005fa2;
  cursor: pointer;
}
.chat-item:hover {
  background: #48a6c5;
  color: #e04d27;
}
.chat-id {
  font-weight: bold;
}
.target-selected {
  color: #e04d27;
  background: #99eaff;
}
</style>
