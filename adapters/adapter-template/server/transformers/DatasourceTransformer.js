// Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

const User = require('./models/User');
const Address = require('./models/Address');
const Geolocation = require('./models/Geolocation');
const Company = require('./models/Company');
const Post = require('./models/Post')
const axios = require('axios');

class DatasourceTransformer {

    constructor(host, key) {
        this.host = host,
        this.key = key
        this.data = {}
    }

    async getAllUsers() {
        await axios.get(`${this.host}/users`
          //,{headers: {'Authorization': `basic ${this.key}`}}  // UNCOMMENT if source requires auth
        ).then(response => {
            this.data.users = [];
            response.data.forEach(user => {
                try {
                    this.data.users.push(
                        new User(
                            user.id,
                            user.name,
                            user.username,
                            user.email,
                            new Address (
                                user.address.street,
                                user.address.suite,
                                user.address.city,
                                user.address.zipcode,
                                new Geolocation(
                                    user.address.geo.lat,
                                    user.address.geo.lng
                                )
                            ),
                            user.phone,
                            user.website,
                            new Company(
                                user.company.name,
                                user.company.catchPhrase,
                                user.company.bs
                            )
                        )
                    )
                }
                catch (error) {
                    console.log(error);
                    this.data.error = error;
                }
            });
        });
        return this.data;
    }

    async getAllPosts() {
        await axios.get(`${this.host}/posts`
          //,{headers: {'Authorization': `basic ${this.key}`}}  // UNCOMMENT if source requires auth
        ).then(response => {
            this.data.posts = [];
            response.data.forEach(post => {
                try {
                    this.data.posts.push(
                        new Post(
                            post.userId,
                            post.id,
                            post.title,
                            post.body
                        )
                    )
                }
                catch (error) {
                    console.log(error);
                    this.data.error = error;
                }
            });
        });
        return this.data;
    }

    async getSinglePost(ident) {
        await axios.get(`${this.host}/posts/${ident}`
          //,{headers: {'Authorization': `basic ${this.key}`}}  // UNCOMMENT if source requires auth
        ).then(response => {
            this.data.posts = [];
            try {
                this.data.posts.push(
                    new Post(
                      response.data.userId,
                      response.data.id,
                      response.data.title,
                      response.data.body
                    )
                );
            }
            catch (error) {
                console.log(error);
                this.data.error = error;
            }
        });
        return this.data;
    }

}

module.exports = DatasourceTransformer;
