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
          'objects': []
        }
    }

    async getAllUsers() {
        await axios.get(`${this.host}/users`
          //,{headers: {'Authorization': `basic ${this.key}`}}  // UNCOMMENT if source requires auth
        ).then(response => {
            response.data.forEach(user => {
                try {
                    this.data.objects.push(
                        {'id': user.id, 'name': user.name}
                    );
                }
                catch (error) {
                    console.log(error);
                    this.data.error = error;
                }
            });
        });
        return this.data;
    }

    async getSingleUser(ident) {
        await axios.get(`${this.host}/users/${ident}`
          //,{headers: {'Authorization': `basic ${this.key}`}}  // UNCOMMENT if source requires auth
        ).then(response => {
            try {
                this.data.objects.push(
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
                )
            }
            catch (error) {
                console.log(error);
                this.data.error = error;
            }
        });
        return this.data;
    }

    async getAllPosts() {
        await axios.get(`${this.host}/posts`
          //,{headers: {'Authorization': `basic ${this.key}`}}  // UNCOMMENT if source requires auth
        ).then(response => {
            response.data.forEach(post => {
                try {
                    this.data.objects.push(
                        {'id': post.id, 'name': post.title}
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
            try {
                this.data.objects.push(
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
