<template>
  <div id="app">
    <div class="tool-bar">
      <div>Book List</div>
      <button @click="showAddNew" v-show="!showInput">Add New</button>
      <button @click="hideAddNew" v-show="showInput">Hide</button>
    </div>
    <div v-show="showInput">
      <label>Title: </label>
      <input type="text" v-model="inputForm.title"/><br>
      <label>Author: </label>
      <input type="text" v-model="inputForm.author"/><br>
      <button v-if="!isEdit" @click="addPost">Add</button>
      <button v-if="isEdit" @click="editPost">Edit</button>
    </div>
    <div v-show="loading">Loading now...</div>
    <div v-for="post in posts" :key="post.id">
      {{ post.title}}/{{ post.author}}
      <button @click="showEdit(post.id, post.title, post.author)">Edit</button>
      <button @click="deletePost(post.id,post.title)">Delete</button>
    </div>
  </div>
</template>

<script>
import { ALL_POSTS } from "./graphql/post-query"
import { CREATE_POST, UPDATE_POST, DELETE_POST } from "./graphql/post-mutation";
import {SUBSCRIPTION_POST} from "./graphql/post-subscription";

export default {
  name: "App",
  data: () => ({
    //本棚の中身を定義
    posts: [],
    inputForm: {
      id: '',
      title: '',
      author: '',
    },
    showInput: false,
    isEdit: false,
    loading: false,
  }),
  apollo: {
    //本棚の中身
    posts: {
      //クエリを書いている部分
      query: ALL_POSTS,
      subscribeToMore: {
        document: SUBSCRIPTION_POST,
        updateQuery:(previousResult, { subscriptionData }) =>{
            // console.log(previousResult) //前の投稿
            // console.log(subscriptionData.data) //新規作成した投稿
            // 既存の投稿と同一の投稿がなかった場合、新規作成した投稿を本棚に追加
          if (previousResult.posts.find(post => post.id === subscriptionData.data.post.data.id)) {
            return previousResult
          } else {
            return {
              posts: [
                ...previousResult.posts,
                // Add the new data
                subscriptionData.data.post.data,
              ],
            }
          }
        }
      }
    }
  },
  methods: {
    addPost: function () {
      this.loading = true
      this.$apollo.mutate({
        mutation: CREATE_POST,
        variables: {
          title: this.inputForm.title,
          author: this.inputForm.author,
        }
      }).then(() => {
        this.updatePost()
        this.showInput = false
        this.loading = false
      }).catch((error) => {
        console.error(error)
      })
    },
    editPost: function () {
      this.loading = true
      this.$apollo.mutate({
        mutation: UPDATE_POST,
        variables: {
          id: this.inputForm.id,
            title: this.inputForm.title,
            author: this.inputForm.author,
        }
      }).then(() => {
        this.updatePost()
        this.showInput = false
        this.loading = false
      }).catch((error) => {
        console.error(error)
      })
    },
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
        this.updatePost()
        this.loading = false
      }).catch((error) => {
        console.error(error)
      })
    },
    updatePost: function () {
      this.$apollo.queries.posts.fetchMore({
        updateQuery: (previousResult, {fetchMoreResult}) => {
          console.log(previousResult)  //変更前
          console.log(fetchMoreResult) //変更後
          return {
            posts: fetchMoreResult.posts
          }
        }
      })
    },
    showAddNew: function () {
      this.showInput = true
      this.isEdit = false
    },
    hideAddNew: function () {
      this.showInput = false
    },
    showEdit: function (id, title, author) {
      this.inputForm.id = id
      this.inputForm.title = title
      this.inputForm.author = author
      this.showInput = true
      this.isEdit = true
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
.tool-bar {
  display: flex;
  justify-content: center;
}
</style>
