import React from 'react';
import {View, ScrollView, FlatList, StyleSheet} from 'react-native';
import {Text, Button} from 'react-native-elements';
import {useAuth} from './AuthProvider';
import {usePosts} from './PostsProvider';
import {PostItem} from './PostItem';
import {AddPostView} from './AddPostView';
import { useNavigation } from '@react-navigation/native';
// The Posts View displays the list of Posts of the parent PostsProvider.
// It has a button to log out and a button to add a new Post.
export function PostsView() {
  // Get the logOut function from the useAuth hook.
  const {logOut} = useAuth();
  // Get the list of Posts and the projectId from the usePosts hook.
  const {Posts} = usePosts();
  const navigation = useNavigation();
  const {user} = useAuth();

  return (
      <View style={{flex: 1}}>
        <View style={{flex: 1}}>
          <FlatList
            data={Posts}
            renderItem={({ item }) => (
              <PostItem key={`${item._id}`} Post={item} />
            )}
            keyExtractor={(item) => `${item._id}`}
            contentContainerStyle={{ paddingBottom: 40}}
          />
        </View>
      </View>
  );
}

const styles = StyleSheet.create(
{
    MainContainer:
    {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: ( Platform.OS === 'ios' ) ? 20 : 0
    },

    bottomView:{
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      height: 50,
      backgroundColor: '#FF9800',
      alignItems: 'center',
      position: 'absolute',
      bottom: 0
    },

    textStyle:{

      color: '#fff',
      fontSize:22
    }
});
