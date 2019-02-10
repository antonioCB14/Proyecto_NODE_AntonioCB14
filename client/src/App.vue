<template>
  <div id="app">
    <div id="nav">
      <notifications group="foo"/>
      <router-link to="/">Notas</router-link>|
      <router-link to="/tiempo">El Tiempo</router-link>
    </div>
    <keep-alive>
      <router-view/>
    </keep-alive>
  </div>
</template>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin-top: 60px;
}
</style>
