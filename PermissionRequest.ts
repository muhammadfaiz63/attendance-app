import {PermissionsAndroid, Platform} from 'react-native';
import RNLocation from 'react-native-location';
import DeviceInfo from 'react-native-device-info';
import {getTrackingStatus, requestTrackingPermission} from 'react-native-tracking-transparency';
// import {Storage} from 'Services/Storage';

export const requestReceivePermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const isGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECEIVE_SMS);
      if (!isGranted) {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECEIVE_SMS, {
          title: 'AllCare Butuh Akses ke SMS',
          message: 'Izinkan AllCare untuk membaca SMS Anda ' + 'agar dapat menerima SMS OTP',
          buttonNeutral: 'Tanyakan Nanti',
          buttonNegative: 'Batal',
          buttonPositive: 'Setuju',
        });
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        } else {
        }
      } else {
      }
    } catch (err) {
      console.warn(err);
    }
  }
};

export const checkLocationPermission = () => {
  return RNLocation.checkPermission({
    ios: 'whenInUse', // or 'always'
    android: {
      detail: 'fine', // or 'fine'
    },
  });
};

export const locationConfig = async () => {
  try {
    await RNLocation.configure({
      distanceFilter: 5.0,
    });
  } catch (error) {}
};

export const locationPermission = async () => {
  try {
    let granted = await checkLocationPermission();
    if (!granted) {
      granted = await RNLocation.requestPermission({
        ios: 'whenInUse',
        android: {
          detail: 'fine',
          rationale: {
            title: 'Butuh Akses Lokasi Anda',
            message: 'Mohon aktifkan lokasi Anda untuk dapat menggunakan fitur',
            buttonNegative: 'Batal',
            buttonPositive: 'Setuju',
          },
        },
      });
    }
    if (granted) {
      await locationConfig();
      let location = await RNLocation.getLatestLocation();
    //   if (location) {
    //     Storage.setMap('currentDirection', location);
    //   }
    }

    return granted;
  } catch (error) {
    return false;
  }
};

export const loadDeviceInfo = () => {
  let deviceName = DeviceInfo.getDeviceNameSync();
  let systemName = DeviceInfo.getSystemName();
  let systemVersion = DeviceInfo.getSystemVersion();
  let deviceId = DeviceInfo.getDeviceId();
  let carrier = DeviceInfo.getCarrierSync();
  let deviceInfo = {
    deviceName,
    systemName,
    systemVersion,
    deviceId,
    carrier,
  };
//   Storage.setMap('deviceInfo', deviceInfo);
};

export const AskPermissionCamera = async () => {
  if (Platform.OS === 'android') {
    const isGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
    if (!isGranted) {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
        title: 'Butuh Akses ke Kamera',
        message: 'Izinkan untuk akses kamera Anda ' + 'agar bisa mengambil gambar',
        buttonNeutral: 'Tanyakan Nanti',
        buttonNegative: 'Batal',
        buttonPositive: 'Setuju',
      });
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        return;
      }
    }
  }
};

export const iOSGetTrackingPermission = async (): Promise<[boolean, string]> => {
  if (Platform.OS === 'ios') {
    const trackingStatus = await getTrackingStatus();
    if (trackingStatus === 'authorized' || trackingStatus === 'unavailable') {
      // enable tracking features
      return [true, trackingStatus];
    }

    return [false, trackingStatus];
  }

  return [true, 'unavailable'];
};

export const iOSAskTrackingPermission = async () => {
  if (Platform.OS === 'ios') {
    const trackingStatus = await requestTrackingPermission();
    if (trackingStatus === 'authorized' || trackingStatus === 'unavailable') {
      // enable tracking features
      return true;
    }

    return false;
  }

  return true;
};
