export type VaultFile = {
  'attributes': {
    'Id': string,
    'Name': string,
    'VerName': string,
    'MasterId': string,
    'VerNum': string,
    'MaxCkInVerNum': string,
    'CkInDate': string,
    'Comm': string,
    'CreateDate': string,
    'CreateUserId': string,
    'Cksum': string,
    'FileSize': string,
    'ModDate': string,
    'CreateUserName': string,
    'CheckedOut': 'false',
    'FolderId': string,
    'CkOutSpec': string,
    'CkOutMach': string,
    'CkOutUserId': string,
    'FileClass': string,
    'Locked': boolean,
    'Hidden': boolean,
    'Cloaked': boolean,
    'FileStatus': string,
    'IsOnSite': boolean,
    'DesignVisAttmtStatus': string,
    'ControlledByChangeOrder': boolean
  },
  'FileRev': {
    'attributes': {
      'RevId': string,
      'Label': string,
      'MaxConsumeFileId': string,
      'MaxFileId': string,
      'RevDefId': string,
      'MaxRevId': string,
      'Order': string
    }
  },
  'FileLfCyc': {
    'attributes': {
      'LfCycStateId': string,
      'LfCycDefId': string,
      'LfCycStateName': string,
      'Consume': boolean,
      'Obsolete': boolean
    }
  },
  'Cat': {
    'attributes': {
      'CatId': string,
      'CatName': string
    }
  }
}

export type ReducedFile = {
  'id': string,
  'master_id': string,
  'name': string,
  'description': string
}
