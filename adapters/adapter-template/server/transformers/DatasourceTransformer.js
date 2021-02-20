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
        this.data = {
            users: [],
            posts: []
        }
    }

    async getAllUsers() {
        /*
            If there is only one user, the response.data object is not iterable and must be handled more verbosely.
        */
        await Promise.all([axios.get(`${this.host}/users`
          //,{headers: {'Authorization': `basic ${this.key}`}}  // UNCOMMENT if source requires auth
        )
        ]).then(responses => {
            responses.forEach(response => {
                try {
                    response.data.forEach(user => {
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
                    });
                }
                catch (error) {
                    if (error instanceof TypeError) {
                        this.data.projects.push(
                            new User(
                              response.data.id,
                              response.data.name,
                              response.data.username,
                              response.data.email,
                              new Address (
                                response.data.address.street,
                                response.data.address.suite,
                                response.data.address.city,
                                response.data.address.zipcode,
                                new Geolocation(
                                  response.data.address.geo.lat,
                                  response.data.address.geo.lng
                                )
                              ),
                              response.data.phone,
                              response.data.website,
                              new Company(
                                response.data.company.name,
                                response.data.company.catchPhrase,
                                response.data.company.bs
                              )
                            )
                        );
                    }
                    else {
                        console.log(error);
                    }
                }
            });
        });

        return this.data;

    }

    async getAllPosts() {
        /*
            If there is only one user, the response.data object is not iterable and must be handled more verbosely.
        */
        await Promise.all([axios.get(`${this.host}/posts`
          //,{headers: {'Authorization': `basic ${this.key}`}}  // UNCOMMENT if source requires auth
        )
        ]).then(responses => {
            responses.forEach(response => {
                try {
                    response.data.forEach(post => {
                        this.data.posts.push(
                            new Post(
                              post.userId,
                              post.id,
                              post.title,
                              post.body
                            )
                        )
                    });
                }
                catch (error) {
                    if (error instanceof TypeError) {
                        this.data.posts.push(
                            new Post(
                              response.data.userId,
                              response.data.id,
                              response.data.title,
                              response.data.body
                            )
                        );
                    }
                    else {
                        console.log(error);
                    }
                }
            });
        });

        return this.data;

    }

    async getSinglePost(ident) {
        /*
            If there is only one user, the response.data object is not iterable and must be handled more verbosely.
        */
        await Promise.all([axios.get(`${this.host}/posts/${ident}`
          //,{headers: {'Authorization': `basic ${this.key}`}}  // UNCOMMENT if source requires auth
        )
        ]).then(responses => {
            responses.forEach(response => {
                try {
                    this.data.posts.push(
                        new Post(
                          response.data.userId,
                          response.data.id,
                          response.data.title,
                          response.data.body
                        )
                    )

                }
                catch (error) {
                    console.log(error);
                }
            });
        });

        return this.data;

    }

}

module.exports = DatasourceTransformer;
