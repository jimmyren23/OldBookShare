import React, {useState, useRef} from 'react';
import {Overlay, Input, Button} from 'react-native-elements';
import {usePosts} from './PostsProvider';
import { Text, TextInput, View } from 'react-native';
import {useAuth} from "./AuthProvider"
import { useNavigation } from '@react-navigation/native';
// The AddPostView is a button for adding Posts. When the button is pressed, an
// overlay shows up to request user input for the new Post name. When the
// "Create" button on the overlay is pressed, the overlay closes and the new
// Post is created in the realm.
export function AddPostView() {
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [newPostName, setNewPostName] = useState('');
  const [newPostDescription, setNewPostDescription] = useState('');

  const {user} = useAuth();
  const navigation = useNavigation();

  return (
    <>
        <Input
          placeholder="New Post Name"
          onChangeText={(text) => setNewPostName(text)}
          autoFocus={true}
        />
        <Input
          placeholder="Description"
          onChangeText={(text) => setNewPostDescription(text)}
          autoFocus={true}
        />
        <Button
          title="Create"
          onPress={() => {
            setOverlayVisible(false);
            navigation.navigate('Feed')
          }}
        />
    </>
  );
}
