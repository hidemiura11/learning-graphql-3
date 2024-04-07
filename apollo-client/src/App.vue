<template>
  <div id="app">
    <div v-for="post in posts" :key="post.id">
      {{ post.title}}/{{ post.author}}
      <button @click="deletePost(post.id,post.title)">Delete</button>
    </div>
  </div>
</template>

<script>
import { ALL_POSTS } from "./graphql/post-query"
import { DELETE_POST } from "./graphql/post-mutation";
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
  methods: {
    deletePost: function (id, title) {
      if (!confirm(title + ' Delete?')) {
        return
      }
      this.$apollo.mutate({
        mutation: DELETE_POST,
        variables: {
          id: id
        }
      }).then(() => {
        this.$apollo.queries.posts.fetchMore({
          updateQuery: (previousResult, {fetchMoreResult}) => {
            console.log(previousResult)  //変更前
            console.log(fetchMoreResult) //変更後
            return {
              posts: fetchMoreResult.posts
            }
          }
        })
      }).catch((error) => {
        console.error(error)
      })
    }
  }
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
