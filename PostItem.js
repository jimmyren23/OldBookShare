import React, {useState, FlatList} from 'react';
import {Text, ListItem, Overlay} from 'react-native-elements';
import {Post} from './schemas';
import {usePosts} from './PostsProvider';

// Action sheet contains a list of actions. Each action should have a `title`
// string and `action` function property. A "Cancel" action is automatically
// added to the end of your list of actions. You must also provide the
// closeOverlay function that this component will call to request that the
// action sheet be closed.
function ActionSheet({actions, visible, closeOverlay}) {
  const cancelAction = {
    title: 'Cancel',
    action: closeOverlay,
  };
  return (
    <Overlay
      overlayStyle={{width: '90%'}}
      isVisible={visible}
      onBackdropPress={closeOverlay}>
      <>
        {[...actions, cancelAction].map(({title, action}) => (
          <ListItem
            key={title}
            title={title}
            onPress={() => {
              closeOverlay();
              action();
            }}
          />
        ))}
      </>
    </Overlay>
  );
}

// The PostItem represents a Post in a list. When you click an item in the list,
// an action sheet appears. The action sheet contains a list of actions the user
// can perform on the Post, namely deleting and changing its status.
export function PostItem({post}) {
  // Pull the Post actions from the PostsProvider.
  const {deletePost, setPostStatus} = usePosts();


  // The action sheet appears when the user presses an item in the list.
  const [actionSheetVisible, setActionSheetVisible] = useState(false);

  // Specify the list of available actions in the action list when the user
  // presses an item in the list.
  const actions = [
    {
      title: 'Delete',
      action: () => {
        deletePost(post);
      },
    },
  ];

  // For each possible status other than the current status, make an action to
  // move the Post into that status. Rather than creating a generic method to
  // avoid repetition, we split each status to separate each case in the code
  // below for demonstration purposes.
  if (post.status !== Post.STATUS_OPEN) {
    actions.push({

      title: 'Mark Open',

      action: () => {
        setPostStatus(post, Post.STATUS_OPEN);
      },
    });
  }
  if (post.status !== Post.STATUS_IN_PROGRESS) {
    actions.push({

      title: 'Mark In Progress',

      action: () => {
        setPostStatus(post, Post.STATUS_IN_PROGRESS);
      },
    });
  }
  if (post.status !== Post.STATUS_COMPLETE) {
    actions.push({

      title: 'Mark Complete',

      action: () => {
        setPostStatus(post, Post.STATUS_COMPLETE);
      },
    });
  }

  return (
    <>
      <ActionSheet
        visible={actionSheetVisible}
        closeOverlay={() => setActionSheetVisible(false)}
        actions={actions}
      />
      <ListItem
        key={post.id}
        onPress={() => {
          setActionSheetVisible(true);
        }}
        title={post.name}
        subtitle={post.description}
        bottomDivider
        checkmark={
          post.status === Post.STATUS_COMPLETE ? (
            <Text>&#10004; {/* checkmark */}</Text>
          ) : post.status === Post.STATUS_IN_PROGRESS ? (
            <Text>In Progress</Text>
          ) : null
        }
      />
    </>
  );
}
