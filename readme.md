### Feature
- https://qiita.com/shotashimura/items/7c2a4a656ea1239ec190
- Vuetify
  - Can not solve the dependancy issues, Vue 2 - apollo-server - vuetify

### Commands

graphql-server
```
npm init
npm install apollo-server graphql PubSub --save
node index.js
```

apollo-client
```
vue create apollo-client // Vue 2
cd apollo-client
vue add apollo // All No
npm install --save-dev @babel/plugin-transform-runtime
npm run serve
```

### Query
```
query {
  posts {
    id
    title
    author
  }
}
```
