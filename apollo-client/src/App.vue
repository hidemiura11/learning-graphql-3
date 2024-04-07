<template>
  <div id="app">
    <div v-for="post in posts" :key="post.id">
      {{ post.title}}/{{ post.author}}
    </div>
  </div>
</template>

<script>
import { ALL_POSTS } from "./graphql/post-query"
// import { CREATE_POST, UPDATE_POST, DELETE_POST } from "./graphql/post-mutation";

export default {
  name: "App",
  data: () => ({
    //本棚の中身を定義
    posts: [],
  }),
  apollo: {
    //本棚の中身
    posts: {
      //クエリを書いている部分
      query: ALL_POSTS,
    }
  },
  methods: {}
}
</script>

<style>

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
