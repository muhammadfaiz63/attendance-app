/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React,{useCallback,useEffect,useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  TouchableOpacity,
  View,
} from 'react-native';
import RNLocation from 'react-native-location';
import {AskPermissionCamera,locationPermission} from './PermissionRequest';
import * as ImagePicker from './ImagePicker';
import axios from "axios";
import ImageResizer from 'react-native-image-resizer';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [data,setData] = useState([])

  

  const api = axios.create({
    baseURL: 'https://apidummy.kerjoo.com/api',
    timeout: 10000,
    headers: {
      'Content-Type': 'multipart/form-data',
      Accept: 'application/json',
    },
    // json: true
  });

  async function getUser() {
    try {
      const response = await api.get('/attendances/ce775101-7e41-4f06-bfa9-ecf3919d724e');
      setData(response.data)
    } catch (error) {
      console.error(error);
    }
  }

  const uploader = async (source) => {
    try {
      
      let location = await RNLocation.getLatestLocation();
      let form = new FormData();
      form.append('selfie', {
        uri: source.uri,
        type: source.type,
        name: source.name
      });
      form.append('lat', location.latitude);
      form.append('long', location.longitude);
      
      let res = await fetch(
        'https://apidummy.kerjoo.com/api/attendances/ce775101-7e41-4f06-bfa9-ecf3919d724e',
        {
          method: 'post',
          body: form,
          headers: {
            'Content-Type': 'multipart/form-data; ',
          },
        }
      );
      let responseJson = await res.json();
      getUser()
      // return data;
    } catch (error) {
      throw new Error('Something broke from uploader');
    }
  };

  const handleOpenCamera = useCallback(async () => {
    try {
      await AskPermissionCamera();
      // launch the camera with the following settings
      const image = await ImagePicker.launchCameraAsync({
        mediaType: 'photo',
        quality: 0.1,
        // includeBase64: true,
      });

      if (!image.didCancel) {
        const source = image.assets[0];
        const resizeImage = await ImageResizer.createResizedImage(source.uri, 150, 150, 'JPEG', 50);
        await uploader({uri: resizeImage.uri, name: source.fileName, type: 'image/jpeg'});
      }
    } catch (error) {
    } finally {
    }
  }, []);

  useEffect(()=>{
    
    getUser()
  },[])

  locationPermission()

  return (
    <SafeAreaView>
      <StatusBar/>
        <View style={{flex:1,flexWrap:'nowrap',justifyContent:'center',alignItems:'center'}}> 
          <TouchableOpacity onPress={handleOpenCamera} style={{backgroundColor:"#00b0eb",width:150,marginTop:100,alignItems:'center',textAlign:'center',padding:10,borderRadius:10,height:50}}>
            <Text style={{color:"#e0e0e0",fontSize:20}}>Absen</Text>
          </TouchableOpacity>
        </View>
        <View style={{marginTop:130,marginLeft:10}}>
        {
          data.map((item,index)=>(
          <View key={index}>
            <Text>{index+1}. absen waktu : {item.created_at}</Text>
          </View>
          ))
        }
        </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
