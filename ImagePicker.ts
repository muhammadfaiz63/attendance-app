import {URL} from 'react-native-url-polyfill';
import * as ImagePicker from 'react-native-image-picker';

export function launchCameraAsync(options: ImagePicker.CameraOptions): Promise<ImagePicker.ImagePickerResponse> {
  return new Promise((resolve, reject) => {
    ImagePicker.launchCamera(options, (response) => {
      if (response.errorCode) {
        reject(Error(response.errorCode));
      }
      resolve(response);
    });
  });
}

export function launchImageLibraryAsync(options: ImagePicker.ImageLibraryOptions): Promise<ImagePicker.ImagePickerResponse> {
  return new Promise((resolve, reject) => {
    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.errorCode) {
        reject(Error(response.errorCode));
      }
      resolve(response);
    });
  });
}

export function isURI(str: string) {
  try {
    let result = new URL(str);
    if (result.href) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}

export * from 'react-native-image-picker';
