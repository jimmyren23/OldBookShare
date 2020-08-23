import React, {useState}  from 'react';
import {SafeAreaView, View, StatusBar, Text, TextInput} from 'react-native';
import {Button, Input} from 'react-native-elements';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, useNavigation} from '@react-navigation/native';
import {useAuth, AuthProvider} from './AuthProvider';
import {LogInView} from './LogInView';
import {AddPostView} from './AddPostView';
import {PostsView} from './PostsView';
import {usePosts, PostsProvider} from './PostsProvider';
import {Footer} from './footerNavigation';

const Stack = createStackNavigator();

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Feed"
        screenOptions = {{ headerLeft: null, animationEnabled: false}}>
          <Stack.Screen name="Feed" component={FeedView}/>
          <Stack.Screen name="Friends" component={FriendsView} />
          <Stack.Screen name="Create Post" component={CreatePostView} />
          <Stack.Screen name="Home" component={HomeView} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
};

// The AppBody is the main view within the App. If a user is not logged in, it
// renders the login view. Otherwise, it renders the Posts view. It must be
// within an AuthProvider.
function FeedView({ navigation }) {
  const { user } = useAuth();
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{flex: 1}}>
        <View style={{flex: 1}}>
          {user == null ? (
            <LogInView />
          ) : (
            <>
              <PostsProvider projectId= {user.identity}>
                <PostsView/>
              </PostsProvider>
              <Footer/>
            </>
          )}
        </View>
      </SafeAreaView>
    </>
  );
}

//Separate page to add new post
function CreatePostView({ navigation }) {
  const {user} = useAuth();
  const [newPostName, setNewPostName] = useState('');
  const [newPostDescription, setNewPostDescription] = useState('');

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{flex: 1}}>
        <View style={{flex: 1}}>
          {user == null ? (
            <LogInView />
          ) : (
            <>
              <AddPostView/>
              <Footer/>
            </>
          )}
        </View>
      </SafeAreaView>
    </>
  );
}





//Get a list of Friends, with each profile being accessible onTouch
function FriendsView({ navigation }) {
  const {user} = useAuth();
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{flex: 1}}>
        <View style={{flex: 1}}>
          {user == null ? (
            <LogInView />
          ) : (
            <>
              <PostsView/>
              <Footer/>
            </>

          )}
        </View>
      </SafeAreaView>
    </>
  );
}

function HomeView({ navigation }) {
  const { user } = useAuth();
  const { email } = useAuth();
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{flex: 1}}>
        <View style={{flex: 1}}>
          {user == null ? (
            <LogInView />
          ) : (
            <>
              <Text> Welcome!</Text>
              <Footer/>
            </>
          )}
        </View>
      </SafeAreaView>
    </>
  );
}
export default App;
