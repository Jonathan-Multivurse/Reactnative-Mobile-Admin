import React, { Component } from 'react'
import { View, Platform, StyleSheet, Image, ScrollView, Dimensions, TouchableOpacity, Text, ActivityIndicator} from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import Background from '../components/Background'
import { theme } from '../core/theme'
import REQUEST_DB from '../api/requestDB'
import moment from 'moment'
import auth, {firebase} from "@react-native-firebase/auth"

const DEVICE_WIDTH = Dimensions.get('window').width
const DEVICE_HEIGHT = Dimensions.get('window').height;

export default class ScheduleSupportAdmin extends Component {
  constructor(props) {
    super(props)
    this._observer = null;

    this.state = { 
      isLoading: false,
      request: this.props.route.params.request,
      status: this.props.route.params.request.status,
    }
  }

  componentDidMount() {
    this._observer = this.props.navigation.addListener('focus', () => {
      this.getRequest();
    });
  }

  componentWillUnmount() {
    this._observer();
  }

  getRequest = () => {    
    REQUEST_DB.getRequest(this.state.request.requestid, this.gotRequest)
  }

  gotRequest = (request) => {
    this.setState ({
      request: request,
      status: request.status,
    });
  }

  onAssginRequest = () => {
    this.setState({
      modalVisible: false,
    })

    this.props.navigation.navigate('AssignSupport', {
      request: this.state.request,      
      isFromHomePage: true
    }) 
  }

  render() {
    const userID = firebase.auth().currentUser.uid;

    let defaultDate1 = moment(new Date(this.state.request.scheduleTime)).format('MMMM D, YYYY')
    let defaultTime1 = moment(new Date(this.state.request.scheduleTime)).format('h:mm A')

    let receiverName = (userID === this.state.request.receiverId) ? 'You' : this.state.request.receiver.firstname + " " + this.state.request.receiver.lastname
    let senderName = this.state.request.sender.firstname + " " + this.state.request.sender.lastname

    let title = this.state.status === 'scheduled' ? 
    receiverName + " has accepted " + senderName + "'s " + this.state.request.type + " support." 
    : this.state.status === 'assigned' ? 
    senderName + "'s " + this.state.request.type + " support is assigned to " +  receiverName + "."
    : senderName + " has scheduled a " + this.state.request.type + " support."
    
    return (
      <Background>

        <View style = {styles.navigationView}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={styles.backButton}>
            <Image style={styles.backImage} source={require('../assets/images/login/arrow_back.png')} />
          </TouchableOpacity>
          <Text style={styles.titleText}>Support Details</Text>
        </View>

        <ScrollView style= {styles.contentView2} showsVerticalScrollIndicator={false}>
          <View style = {styles.logoView}>
            <View style={styles.imageView}>
              {this.state.request.sender.image == '' ? <Image source={require('../assets/images/home/iconUser.png')} style={this.state.status != 'pending' ? styles.logoImage : styles.logoImage1 } /> : <Image source={{uri: this.state.request.sender.image}} style={this.state.status != 'pending' ? styles.logoImage : styles.logoImage1} />}
              {this.state.status != 'pending' ? <Text>  ------  </Text> : null } 
              {this.state.status != 'pending' ? <Image source={{uri: this.state.request.receiver.image}} style={styles.logoImage} /> : null } 
            </View>             
            <Text style={this.state.status === 'scheduled' ? styles.melisaText1 : styles.melisaText}>{title}</Text>

          </View>

          <View style={styles.contentView}>
            <Text style={styles.meetingText}>Meeting Details</Text>

            <View style={styles.supportView}>
              <View style={styles.iconView}>
                <Image style={styles.iconImage} source={ (this.state.request.type === 'Video') ? require('../assets/images/home/video_yellow.png') : (this.state.request.type === 'Call') ? require('../assets/images/home/call_yellow.png') : require('../assets/images/home/iconChat.png')} />
              </View>                 
              <Text style={styles.cellText}>{this.state.request.type}</Text>
            </View>

            <View style={styles.timeView}>
              <View style={styles.iconView}>
                <Image style={styles.iconImage} source={require('../assets/images/home/iconSchedule.png')}/>
              </View>              
              <Text style={styles.cellText}>{defaultDate1}  /  {defaultTime1}</Text>
            </View>

            <Text style={styles.meetingText}>Description</Text>
            <Text style={styles.contentText}>{this.state.request.description}</Text> 

            <Text style={styles.meetingText}>Simulator</Text>
            <Text style={{...styles.contentText, marginBottom: 44}}>{this.state.request.simulator}</Text>

            { this.state.request.status == 'pending' ? 
              <TouchableOpacity style={styles.loginButton} onPress={() => this.onAssginRequest()}>
                <Text style={styles.loginText}>Assign rep</Text>
                <Image source={require('../assets/images/home/ChevronForward.png')} style={{...styles.forwardImage, marginLeft: 16, tintColor: 'white'}} />
              </TouchableOpacity>
              : <View/>
            }            
                   
          </View>
        </ScrollView>

        {this.state.isLoading ? 
        (<ActivityIndicator
          color={theme.colors.primary}
          size="large"
          style={styles.preloader}
          />
        ) : null}

      </Background>
    )
  }
}

const styles = StyleSheet.create({

  preloader: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute',
  },

  navigationView: {
    width: '100%',
    height: Platform.OS === 'ios' ? 54 + getStatusBarHeight() : 60,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: theme.colors.inputBar,
    marginBottom: 8,    

    shadowColor: theme.colors.shadow,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
  },    

  logoView: {
    width: '100%',
    height: DEVICE_HEIGHT * 0.4,
    alignSelf: 'center',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.inputBar,
  },

  imageView: {
    width: DEVICE_WIDTH,
    height: DEVICE_WIDTH * 0.46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: theme.colors.shadow,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 11 },
    shadowOpacity: 1,
  },

  logoImage: {
    width: DEVICE_WIDTH * 0.34,
    height: DEVICE_WIDTH * 0.34,
    borderRadius: DEVICE_WIDTH * 0.17,
    borderWidth: 3,
    borderColor: '#fff',
    resizeMode: 'contain',
  },

  logoImage1: {
    width: DEVICE_WIDTH * 0.46,
    height: DEVICE_WIDTH * 0.46,
    borderRadius: DEVICE_WIDTH * 0.23,
    borderWidth: 3,
    borderColor: '#fff',
    resizeMode: 'contain',
  },

  melisaText1: {
    width: DEVICE_WIDTH - 80,
    marginTop: 8,
    textAlign: 'center',
    fontSize: 20,
    lineHeight: 30,
    fontFamily: 'Poppins-SemiBold',       
  },

  melisaText: {
    width: DEVICE_WIDTH - 80,
    marginTop: 24,
    textAlign: 'center',
    fontSize: 20,
    lineHeight: 30,
    fontFamily: 'Poppins-SemiBold',       
  },

  requestText: {
    width: 320,
    height: 45,
    marginTop: 6,
    marginBottom: 16,
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 22,
    fontFamily: 'Poppins-Regular',       
  },

  contentView: {
    width: DEVICE_WIDTH,
    flex: 1,
    alignSelf: 'center',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
  },

  meetingText: {
    marginTop: 24,
    marginLeft: 16,
    fontSize: 15,
    lineHeight: 23,
    fontFamily: 'Poppins-Regular',   
    color: theme.colors.lightGray,       
  },

  supportView: {
    height: 42,
    marginTop: 16,
    marginLeft: 16,
    alignItems: 'center',
    flexDirection: 'row',
  },

  timeView: {
    height: 42,
    marginTop: 12,
    marginLeft: 16,
    alignItems: 'center',
    flexDirection: 'row',
  },

  iconView: {
    height: 42,
    width: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: theme.colors.supportBorder,   
    alignItems: 'center',
    justifyContent: 'center', 
  },

  iconImage: {
    height: 26,
    width: 26,      
  },

  cellText: {
    marginTop: 3,
    marginLeft: 12,
    fontSize: 16,
    lineHeight: 22,
    fontFamily: 'Poppins-Regular',  
  },

  contentText: {
    width: DEVICE_WIDTH - 32,
    marginTop: 12,
    marginLeft: 16,
    textAlign: 'left',
    fontSize: 16,
    lineHeight: 22,
    fontFamily: 'Poppins-Regular',  
    // color: theme.colors.primary,
  },

  cancelButton: {
    width: DEVICE_WIDTH - 64,
    height: 57, 
    marginLeft: 32,
    marginTop: 16,
    marginBottom: 47,   
    borderRadius: 28.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.darkBlue, 
    
    shadowColor: theme.colors.shadow,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 11 },
    shadowOpacity: 1,
  }, 

  cancelText: {    
    fontSize: 18,
    lineHeight: 25,    
    fontFamily: 'Poppins-Medium',
    color: '#fff',
  },

  contentView2: {
    width: '100%',
    flex: 1,
    marginBottom: 0,    
    
  }, 

  bottomView2: {
    position: 'absolute', 
    width: DEVICE_WIDTH, 
    height: 120, 
    bottom: 0, 
    backgroundColor: 'white',
    borderTopColor: theme.colors.inputBar,
    borderTopWidth: 2,
  },

  backButton: {
    position: 'absolute',
    width: 50,
    height: 50,
    bottom: 8,
    left: 0,
    paddingBottom: 8,
    paddingLeft: 16,
    justifyContent: 'flex-end',
  },
  
  backImage: {
    width: 12,
    height: 20.5,
  },

  titleText: {
    height: 28,
    position: 'absolute',
    bottom: 8,
    fontSize: 20,
    lineHeight: 22,
    fontFamily: 'Poppins-Medium',    
    fontWeight: '500'
  },

  loginButton: { 
    width: DEVICE_WIDTH - 48,
    height: 57,
    marginLeft: 24,
    marginTop: 20,
    marginBottom: 57,
    borderRadius: 28.5,
    backgroundColor: theme.colors.darkBlue,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',

    shadowColor: theme.colors.shadow,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 11 },
    shadowOpacity: 1,
  },

  loginText: {
    fontSize: 18,
    lineHeight: 25,
    color: 'white',
    fontFamily: 'Poppins-Medium',
  },

})