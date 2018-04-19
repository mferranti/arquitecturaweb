<template>
  <div>
    <h1>{{ msg }}</h1>
    <h2>Choose your nickname and login to chat</h2>
    <div class="login">
      <input type="text" name="nick" class="nick" placeholder="Nickname">
      <button>Go!</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'welcome',
  data () {
    return {
      msg: 'Welcome to Dino chat'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
  font-size: 2em;
  margin: 25px
}
a {
  color: #42b983;
}
input {
  border-radius: 26px;
  width: 319px;
  height: 40px;
  padding-left: 20px;
  padding-right: 20px;
  font-size: 1.8em;
  border: 0px solid;
  background: #F4F4F4;
}
input::placeholder {
  color: #80808073;
}
button {
  display: block;
  margin: 0 auto;
  margin-top: 20px;
  padding: 35px 31px;
  border: 0px;
  background: #02C0F4;
  font-size: 30px;
  border-radius: 50%;
  transition-duration: 0.4s;
  box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);
  cursor: pointer;
}
button:hover {
  background-color: #E04D27;
  box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);
}
.login {
  position: relative;
  text-align: center;
}
</style>
