// Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

class Post {
    constructor(userId, id, title, body) {
      this.userId = String(userId),
      this.id = String(id),
      this.title = title,
      this.body = body
    }
}

module.exports = Post;
