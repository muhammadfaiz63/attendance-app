/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React,{useCallback} from 'react';
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
import {AskPermissionCamera} from './PermissionRequest';
import * as ImagePicker from './ImagePicker';

import ImageResizer from 'react-native-image-resizer';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

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
        // await uploader({uri: resizeImage.uri, name: resizeImage.name, type: 'image/jpeg'});

      }
    } catch (error) {
    } finally {
    }
  }, []);



  return (
    <SafeAreaView>
      <StatusBar/>
        <View style={{flex:1,flexWrap:'nowrap',justifyContent:'center',alignItems:'center'}}> 
          <TouchableOpacity onPress={handleOpenCamera} style={{backgroundColor:"#00b0eb",width:150,marginTop:100,alignItems:'center',textAlign:'center',padding:10,borderRadius:10,height:50}}>
            <Text style={{color:"#e0e0e0",fontSize:20}}>Absen</Text>
          </TouchableOpacity>
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
