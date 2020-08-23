import React, {useContext, useState, useEffect, useRef} from 'react';
import Realm from 'realm';
import {useAuth} from './AuthProvider';
import {Post} from './schemas';

// Create the context that will be provided to descendants of PostsProvider via
// the usePosts hook.
const PostsContext = React.createContext(null);

const PostsProvider = ({ children, projectId}) => {
  // Get the user from the AuthProvider context.
  const { user } = useAuth();
  // The Posts list will contain the Posts in the realm when opened.
  const [posts, setPosts] = useState([]);
  // This realm does not need to be a state variable, because we don't re-render
  // on changing the realm.
  const realmRef = useRef(null);
  // The effect hook replaces lifecycle methods such as componentDidMount. In
  // this effect hook, we open the realm that contains the Posts and fetch a
  // collection of Posts.
  useEffect(() => {
    // Check that the user is logged in. You must authenticate to open a synced
    // realm.
    if (user == null) {
      console.warn('PostsView must be authenticated!');
      return;
    }
    // Define the configuration for the realm to use the Post schema. Base the
    // sync configuration on the user settings and use the project ID as the
    // partition value. This will open a realm that contains all objects where
    // object._partition == projectId.
    console.log(user.identity);
    const config = {
      schema: [Post.schema],
      sync: {
        user: user,
        partitionValue: projectId,
      },
    };

    console.log(
      `Attempting to open Realm ${projectId} for user ${
        user.identity
      } with config: ${JSON.stringify(config)}...`,
    );

    // Set this flag to true if the cleanup handler runs before the realm open
    // success handler, e.g. because the component unmounted.
    let canceled = false;
    // Now open the realm asynchronously with the given configuration.
    Realm.open(config).then((openedRealm) => {
      console.log("oehwiohfoewhfiowehfoiwe")
        // If this request has been canceled, we should close the realm.
        if (canceled) {
          openedRealm.close();
          return;
        }
        // Update the realmRef so we can use this opened realm for writing.
        realmRef.current = openedRealm;

        // Read the collection of all Posts in the realm. Again, thanks to our
        // configuration above, the realm only contains Posts where
        // Post._partition == projectId.
        const syncPosts = openedRealm.objects('Post');

        // Watch for changes to the Posts collection.
        openedRealm.addListener('change', () => {
          // On change, update the Posts state variable and re-render.
          setPosts([...syncPosts]);
        });

        // Set the Posts state variable and re-render.
        setPosts([...syncPosts]);
      }).catch((error) => console.warn('Failed to open realm:', error));
    // Return the cleanup function to be called when the component is unmounted.
    return () => {
      // Update the canceled flag shared between both this callback and the
      // realm open success callback above in case this runs first.
      canceled = true;
      console.log(realm.current)
      // If there is an open realm, we must close it.
      const realm = realmRef.current;
      if (realm != null) {
        realm.removeAllListeners();
        realm.close();
        realmRef.current = null;
      }
    };
  }, [user, projectId]); // Declare dependencies list in the second parameter to useEffect().

  // Define our create, update, and delete functions that users of the
  // usePosts() hook can call.
  const createPost = (newPostName, newPostDescription) => {
    const realm = realmRef.current;
    // Open a write transaction.

    realm.write(() => {

      // Create a new Post in the same partition -- that is, in the same project.

      realm.create(

        'Post',

        new Post({name: newPostName || 'New Post', description: newPostDescription || '', partition: projectId}),

      );

    });

  };

  // Define the function for updating a Post's status.
  const setPostStatus = (Post, status) => {
    // One advantage of centralizing the realm functionality in this provider is
    // that we can check to make sure a valid status was passed in here.
    if (
      ![
        Post.STATUS_OPEN,
        Post.STATUS_IN_PROGRESS,
        Post.STATUS_COMPLETE,
      ].includes(status)
    ) {
      throw new Error(`Invalid Status ${status}`);
    }
    const realm = realmRef.current;


    realm.write(() => {
      post.status = status;
    });

  };

  // Define the function for deleting a Post.
  const deletePost = (post) => {
    const realm = realmRef.current;

    realm.write(() => {

      realm.delete(post);

    });

  };


  // Render the children within the PostContext's provider. The value contains
  // everything that should be made available to descendants that use the
  // usePosts hook.
  return (
    <PostsContext.Provider
      value={{
        createPost,
        deletePost,
        setPostStatus,
        posts,
        projectId,
      }}>
      {children}
    </PostsContext.Provider>
  );
};

// The usePosts hook can be used by any descendant of the PostsProvider. It
// provides the Posts of the PostsProvider's project and various functions to
// create, update, and delete the Posts in that project.
const usePosts = () => {
  const value = useContext(PostsContext);
  if (value == null) {
    throw new Error('usePosts() called outside of a PostsProvider?');
  }
  return value;
};

export {PostsProvider, usePosts};
