const Query = {
  posts(parent, args, { db }, info) {
    if (!args.query) {
      //クエリを書いた時に引数が「ない」時
      //模擬データベースの内容を全て表示
      return db.posts
    } else {
      //クエリを書いた時に引数が「ある」時
      //引数とtitle or authorが一致したものだけを表示
      return db.posts.filter((post) => {
        const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase())
        const isAuthorMatch = post.author.toLowerCase().includes(args.query.toLowerCase())
        return isTitleMatch || isAuthorMatch
      })
    }
  }
}

module.exports = Query
