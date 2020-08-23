import {ObjectId} from 'bson';

class Post {
  constructor({
    name,
    partition,
    status = Post.STATUS_OPEN,
    id = new ObjectId(),
    description,
    date_published = Date()
  }) {
    this._partition = partition;
    this._id = id;
    this.name = name;
    this.status = status;
    this.description = description;
    this.date_published = date_published
  }

  static STATUS_OPEN = 'Open';
  static STATUS_IN_PROGRESS = 'InProgress';
  static STATUS_COMPLETE = 'Complete';

  static schema = {
    name: 'Post',
    properties: {
      _id: 'objectId',
      _partition: 'string?',
      date_published: 'date',
      description: 'string',
      name: 'string',
      status: 'string',
    },
    primaryKey: '_id',
  };
}
export {Post};
