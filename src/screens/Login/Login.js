import React from 'react';
import {ActivityIndicator,StyleSheet, Text, View, Linking } from 'react-native';
import * as firebase from 'firebase';
import Input from '../../components/Input/Input';
import Button from '../../components/Buttons/Button';

export default class Login extends React.Component {
  state = {
    email: '',
    password: '',
    authenticating: false,
    user: null,
    error: '',
  }

  static navigationOptions = {
    title: "Login",
    headerStyle: {
      backgroundColor: "#03A9F4"
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "bold"
    }
  };

  componentWillMount(){
    const firebaseConfig = {
      apiKey: 'AIzaSyCDdzV2mcgvArvcm33-XkBWHO6a4XxIyDE',
      authDomain: 'mobiapp-2853d.firebaseapp.com',
    }
    firebase.initializeApp(firebaseConfig);
  }

  onPressSignIn() {
    this.setState({
      authenticating: true,
    });

    //Add this code to where the login is success
    this.props.navigation.navigate('UserDashboard')

    const { email, password } = this.state;

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(user => this.setState({
        authenticating: false,
        user,
        error: '',
      }))
      .catch(() => {
        // Login was not successful
        firebase.auth().createUserWithEmailAndPassword(email, password)
          .then(user => this.setState({
            authenticating: false,
            user,
            error: '',
          }))
          .catch(() => this.setState({
            authenticating: false,
            user: null,
            error: 'Authentication Failure',
          }))
      })
  }

  onPressLogOut() {
    firebase.auth().signOut()
      .then(() => {
        this.setState({
          email: '',
          password: '',
          authenticating: false,
          user: null,
        })
      }, error => {
        console.error('Sign Out Error', error);
      });
  }

  renderCurrentState() {
    if (this.state.authenticating) {
      return (
        <View style={styles.form}>
          <ActivityIndicator size='large' />
        </View>
      )
    }

    if (this.state.user !== null) {
      return (
        <View style={styles.form}>
          <Text>Logged In</Text>
          <Button onPress={() => this.onPressLogOut()}>Log Out</Button>
        </View>
      )
    }

    return (
      <View style={styles.form}>
        <Input
          placeholder='Enter your email...'
          label='Email'
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />
        <Input
          placeholder='Enter your password...'
          label='Password'
          secureTextEntry
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />
        <Button onPress={() => this.onPressSignIn()}>Log In</Button>
        <Text style={{marginTop: 20}}>Haven't registered <Text onPress={()=>this.props.navigation.navigate('SignUp')}>Sign Up</Text></Text>
        <Text>{this.state.error}</Text>
      </View>
    )

  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderCurrentState()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  form: {
    flex: 1
  }
});


