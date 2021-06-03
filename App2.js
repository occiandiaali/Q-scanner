import React, {useState} from 'react';

import {
  SafeAreaView,
  View,
  Text,
  Linking,
  TouchableHighlight,
  PermissionsAndroid,
  Platform,
  StyleSheet,
} from 'react-native';

import {CameraScreen} from 'react-native-camera-kit';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    alignItems: 'center',
  },
  titleText: {
    color: 'purple',
    fontSize: 16,
    textAlign: 'center',
    padding: 10,
    marginTop: 16,
  },
  textStyle: {
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
    padding: 10,
    marginTop: 16,
  },
  buttonStyle: {
    fontSize: 16,
    color: 'white',
    backgroundColor: 'green',
    padding: 5,
    minWidth: 250,
  },
  buttonTextStyle: {
    padding: 5,
    color: 'white',
    textAlign: 'center',
  },
  textLinkStyle: {
    color: 'blue',
    paddingVertical: 20,
  },
});

const App2 = () => {
  const [qValue, setQValue] = useState('');
  const [openScanner, setOpenScanner] = useState(false);

  const onOpenLink = () => Linking.openURL(qValue);

  const onBarcodeScan = qValue => {
    // call after successful qrCode/barcode scan
    setQValue(qValue);
    setOpenScanner(false);
  };

  const onOpenScanner = () => {
    // start scanning
    if (Platform.OS === 'android') {
      async function requestCameraPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: 'Camera Permission',
              message: 'App needs camera access...',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            setQValue('');
            setOpenScanner(true);
          } else {
            alert('Permission was not granted!');
          }
        } catch (error) {
          alert('Error: ', error);
          console.warn(error);
        }
      }
      // missing this would cause no action on open qr scanner click
      requestCameraPermission();
    } else {
      setQValue('');
      setOpenScanner(true);
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      {openScanner ? (
        <View style={{flex: 1}}>
          <CameraScreen
            showFrame={false}
            scanBarcode={true}
            laserColor={'orange'}
            frameColor={'purple'}
            colorForScannerFrame={'black'}
            onReadCode={event =>
              onBarcodeScan(event.nativeEvent.codeStringValue)
            }
          />
        </View>
      ) : (
        <View style={styles.container}>
          <Text style={styles.titleText}>Scan with Camera</Text>
          <Text style={styles.textStyle}>
            {qValue ? `Scanned Result: ${qValue}` : ''}
          </Text>
          {qValue.includes('https://') ||
          qValue.includes('http://') ||
          qValue.includes('geo:') ? (
            <TouchableHighlight onPress={onOpenLink}>
              <Text style={styles.textLinkStyle}>
                {qValue.includes('geo:') ? 'Open in Map' : 'Open Link'}
              </Text>
            </TouchableHighlight>
          ) : null}
          <TouchableHighlight
            onPress={onOpenScanner}
            style={styles.buttonStyle}>
            <Text style={styles.buttonTextStyle}>Open QR Scanner</Text>
          </TouchableHighlight>
        </View>
      )}
    </SafeAreaView>
  );
};

export default App2;
