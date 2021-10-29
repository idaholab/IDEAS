export type VaultFolder = {
  'attributes': {
    'Id': string,
    'Name': string,
    'FullName': string,
    'ParId': string,
    'CreateDate': string,
    'CreateUserId': string,
    'IsLib': boolean,
    'CreateUserName': string,
    'NumClds': string,
    'Cloaked': boolean,
    'Locked': boolean
  },
  'Cat': {
    'attributes': {
      'CatId': string,
      'CatName': string
    }
  }
}

export type ReducedFolder = {
  'id': string,
  'name': string
}
