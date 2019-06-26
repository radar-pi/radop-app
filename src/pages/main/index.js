import React, { Component } from 'react';

import {
  Keyboard,
  StatusBar,
  Modal,
  ActivityIndicator
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

import MapboxGL from '@mapbox/react-native-mapbox-gl';

import DateTimePicker from "react-native-modal-datetime-picker";

import api from '../../services/api';

import {
  Container,
  AnnotationContainer,
  AnnotationText,
  NewButtonContainer,
  ButtonsWrapper,
  CancelButtonContainer,
  SelectButtonContainer,
  ButtonText,
  Marker,
  ModalContainer,
  ModalButtons,
  CameraButtonContainer,
  CancelButtonText,
  ContinueButtonText,
  TakePictureButtonContainer,
  TakePictureButtonLabel,
  DataButtonsWrapper,
  MarkerContainer,
  MarkerLabel,
  Form,
  Input,
} from './styles';
import { ScrollView } from 'react-native-gesture-handler';

export default class Main extends Component {
  static navigationOptions = {
    header: null,
  }

  state = {
    locations: [],
    statusModalOpened: false,
    newMaintenance: false,
    maintenancesModalOpened: false,
    isDatePickerVisible: false,
    isTimePickerVisible: false,
    latitude: 0.0,
    longitude: 0.0,
    maintenanceData: {
      user_id: '',
      date: '',
      time: '',
      reason: '',
      radar_id: '',
    }
  };
  
  componentDidMount() {
    this.getLocation();
    this.getUser();
  }

  getLocation = async () => {
    try {
      const response = await api.get('/radars', {
        params: {
          latitude: -15.9889863,
          longitude: -48.0445082,
        },
      });

      this.setState({ locations: response.data });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  getUser = async () => {
    try {
      const user_email = await AsyncStorage.getItem('@RaDopApp:user_email')
      const response = await api.get('/user/find', {
        params: {
          email: user_email
        },
      });

      const data = response.data
      const id_user = data[0].id
      this.setState({maintenanceData: {
        user_id: id_user
      }});
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  handleNewMaintenancePress = () => this.setState({ newMaintenance: !this.state.newMaintenance })

  handleDataModalClose = () => this.setState({
    maintenancesModalOpened: !this.state.maintenancesModalOpened
  })

  handleGetRadarPress = (location) => {
    let { id, latitude, longitude } = location
    if (this.state.newMaintenance) {
      this.setState({
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        maintenanceData: {
          ...this.state.maintenanceData,
          radar_id: id,
        }
      });
    } else {
      console.log('I was here!')
    }
  }

  handleSelectedRadarMaintenecePress = () => {
    this.setState({ maintenancesModalOpened: !this.state.maintenancesModalOpened })
  }

  handleMaintenanceDateChange = date => {
    const { maintenanceData } = this.state;
    this.setState({
      maintenanceData: {
        ...maintenanceData,
        date
      }
    });
  }

  handleMaintenanceTimeChange = time => {
    const { maintenanceData } = this.state;
    this.setState({
      maintenanceData: {
        ...maintenanceData,
        time
      }
    });
  }

  handleMaintenanceReasonChange = reason => {
    const { maintenanceData } = this.state;
    this.setState({
      maintenanceData: {
        ...maintenanceData,
        reason
      }
    });
  }

  saveMaintenance = async () => {
    try {
      const {user_id, radar_id, time, reason} = this.state.maintenanceData
      let { date } = this.state.maintenanceData

      const response = await api.post('/maintenances', {
        user_id: user_id,
        date: date.split('/').reverse().join('/'),
        time: time,
        reason: reason,
        radar_id: radar_id,
      });

      console.log(response.data)
      
      this.setState({
        latitude: 0.0,
        longitude: 0.0,      
        maintenanceData: {
          date: '',
          time: '',
          reason: '',
          radar_id: '',
        },
        newMaintenance: !this.state.newMaintenance,
        maintenancesModalOpened: false
      });
    
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  showDatePicker = () => {
    Keyboard.dismiss()
    this.setState({ isDatePickerVisible: true })
  }

  hideDatePicker = () => {
    this.setState({ isDatePickerVisible: false })
  }

  handleDatePicked = date => {
    const { maintenanceData } = this.state;
    const day = date.getDate()
    const month = ('0' + (date.getMonth() + 1)).slice(-2)
    const year = date.getFullYear()
    this.setState({
      maintenanceData: {
        ...maintenanceData,
        date: day + '/' + month + '/' + year,
      }
    });
    this.hideDatePicker()
  }

  showTimePicker = () => {
    Keyboard.dismiss()
    this.setState({ isTimePickerVisible: true })
  }

  hideTimePicker = () => {
    this.setState({ isTimePickerVisible: false })
  }

  handleTimePicked = time => {
    const { maintenanceData } = this.state;
    const hour = ('0' + time.getHours()).slice(-2)
    const minutes = ('0' + time.getMinutes()).slice(-2)
    this.setState({
      maintenanceData: {
        ...maintenanceData,
        time: hour + ':' + minutes,
      }
    });
    this.hideTimePicker()
  }

  renderConditionalsButtons = () => (
    !this.state.newMaintenance ? (
      <NewButtonContainer onPress={this.handleNewMaintenancePress}>
        <ButtonText>Nova Manutenção</ButtonText>
      </NewButtonContainer>
    ) : (
      <ButtonsWrapper>
        <SelectButtonContainer onPress={this.handleSelectedRadarMaintenecePress}>
          <ButtonText>Selecione o radar</ButtonText>
        </SelectButtonContainer>
        <CancelButtonContainer onPress={this.handleNewMaintenancePress}>
          <ButtonText>Cancelar</ButtonText>
        </CancelButtonContainer>
      </ButtonsWrapper>
    )
  )

  renderLocations = (locations) => (
    locations.map((location) => (
      <MapboxGL.PointAnnotation
        id={location.id.toString()}
        coordinate={[parseFloat(location.longitude), parseFloat(location.latitude)]}
        key={location.id}
        onSelected={() => this.handleGetRadarPress(location)}
      >
        <AnnotationContainer>
          <AnnotationText>{location.id}: {location.name}</AnnotationText>
        </AnnotationContainer>
        <MapboxGL.Callout title={location.name} />
      </MapboxGL.PointAnnotation>
    ))
  )

  renderMaintenanceModal = () => (
    <Modal
      visible={this.state.maintenancesModalOpened}
      transparent={false}
      animationType="slide"
      onRequestClose={this.handleDataModalClose}
    >
      <ModalContainer>
        <ModalContainer>
          <MapboxGL.MapView
            centerCoordinate={[
              this.state.longitude,
              this.state.latitude
            ]}
            style={{ flex: 1 }}
            styleURL={MapboxGL.StyleURL.Dark}
          >
            <MapboxGL.PointAnnotation
              id="center"
              coordinate={[
                this.state.longitude,
                this.state.latitude
              ]}
            >
              <MarkerContainer>
                <MarkerLabel />
              </MarkerContainer>
            </MapboxGL.PointAnnotation>
          </MapboxGL.MapView>
        </ModalContainer>
        <ScrollView>
          <Form>
            <Input
              placeholder="Data da Manutenção"
              value={this.state.maintenanceData.date}
              onFocus={this.showDatePicker}
              onChangeText={this.handleMaintenanceDateChange}
              autoCapitalize="none"
              autoCorrect={false}
              onPress={Keyboard.dismiss}
            />
            <Input
              placeholder="Horário da Manutenção"
              value={this.state.maintenanceData.time}
              onFocus={this.showTimePicker}
              onChangeText={this.handleMaintenanceTimeChange}
              autoCapitalize="none"
              autoCorrect={false}
              onPress={Keyboard.dismiss}
            />
            <Input
              multiline={true}
              placeholder="Razão"
              value={this.state.maintenanceData.reason}
              onChangeText={this.handleMaintenanceReasonChange}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </Form>
          {/* <ActivityIndicator
            size="large"
            color="#0000ff"
          /> */}
          <DataButtonsWrapper>
            <SelectButtonContainer onPress={this.saveMaintenance}>
              <ButtonText>Salvar Manutenção</ButtonText>
            </SelectButtonContainer>
            <CancelButtonContainer style={{ 
              marginBottom: 15
              }} onPress={this.handleDataModalClose}>
              <ButtonText>Cancelar</ButtonText>
            </CancelButtonContainer>
          </DataButtonsWrapper>
        </ScrollView>
      </ModalContainer>
    </Modal>
  )

  render() {
    return (
      <Container>
        <StatusBar barStyle="dark-content" />
        <MapboxGL.MapView
          centerCoordinate={[-48.045151, -15.989312]}
          style={{ flex: 1 }}
          styleURL={MapboxGL.StyleURL.Dark}
        >
          { this.renderLocations(this.state.locations) }
        </MapboxGL.MapView>
        { this.renderConditionalsButtons() }
        { this.renderMaintenanceModal() }
        <DateTimePicker
          isVisible={ this.state.isDatePickerVisible }
          onConfirm={ this.handleDatePicked }
          onCancel={ this.hideDatePicker }
          mode={'date'}
        />
        <DateTimePicker
          isVisible={ this.state.isTimePickerVisible }
          onConfirm={ this.handleTimePicked }
          onCancel={ this.hideTimePicker }
          mode={'time'}
        />
      </Container>
    );
  }
}