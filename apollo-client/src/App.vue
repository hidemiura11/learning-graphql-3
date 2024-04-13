<template>
  <div id="app">
    <div class="tool-bar">
      <div>Book List</div>
      <button @click="showDialogNew" v-show="!dialog">Add New</button>
      <button @click="hideDialogNew" v-show="dialog">Hide</button>
    </div>
    <div v-show="dialog">
      <form>
        <label>Title: </label>
        <input type="text" /><br>
        <label>Author: </label>
        <input type="text" /><br>
        <button>Add</button>
      </form>
    </div>
    <div v-show="loading">Loading now...</div>
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
    dialog: false,
    loading: false,
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
      this.loading = true
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
        setTimeout(() => {
          console.log("Delayed for 10 second.");
        }, "10000");
        this.loading = false
      }).catch((error) => {
        console.error(error)
      })
    },
    showDialogNew: function () {
      this.dialog = true
    },
    hideDialogNew: function () {
      this.dialog = false
    },
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
.tool-bar {
  display: flex;
  justify-content: center;
}
</style>
