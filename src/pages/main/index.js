import React, { Component } from 'react';

import { StatusBar, Modal, AsyncStorage } from 'react-native';

import MapboxGL from '@mapbox/react-native-mapbox-gl';

import Geolocation from 'react-native-geolocation-service';

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
  ModalImagesListContainer,
  ModalImagesList,
  ModalImageItem,
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

export default class Main extends Component {
  static navigationOptions = {
    header: null,
  }

  state = {
    locations: [],
    mapRegion: null,
    lastLat: null,
    lastLong: null,
    statusModalOpened: false,
    newMaintenance: false,
    maintenancesModalOpened: false,
    maintenanceData: {
      user_id: '',
      date: '',
      time: '',
      reason: '',
      radar_id: ''
    }
  };
  
  componentDidMount() {
    this.getLocation();
    Geolocation.getCurrentPosition( (position) => {
      this.state.lastLat = position.coords.latitude
      this.state.lastLong = position.coords.longitude
    }, (error) => {
      console.log(error.code, error.message)
    },
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 10000
    });
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
      console.log(err);
      throw err;
    }
  }

  handleNewMaintenancePress = () => this.setState({ newMaintenance: !this.state.newMaintenance })

  handleDataModalClose = () => this.setState({
    maintenancesModalOpened: !this.state.maintenancesModalOpened
  })

  getRadarData = (location) => this.setState({
    maintenanceData: {
      user_id: '',
      radar_id: location.id
    }
  })

  renderConditionalsButtons = () => (
    !this.state.newMaintenance ? (
      <NewButtonContainer onPress={this.handleNewMaintenancePress}>
        <ButtonText>Nova Manutenção</ButtonText>
      </NewButtonContainer>
    ) : (
      <ButtonsWrapper>
        <SelectButtonContainer onPress={this.handleGetPositionPress}>
          <ButtonText>Selecione o radar</ButtonText>
        </SelectButtonContainer>
        <CancelButtonContainer onPress={this.handleNewMaintenancePress}>
          <ButtonText>Cancelar</ButtonText>
        </CancelButtonContainer>
      </ButtonsWrapper>
    )
  )

  renderLocations = () => (
    this.state.locations.map((location) => (
      <MapboxGL.PointAnnotation
        id={location.id.toString()}
        coordinate={[parseFloat(location.longitude), parseFloat(location.latitude)]}
        key={location.id}
      >
        <AnnotationContainer>
          <AnnotationText>{location.id}: {location.name}</AnnotationText>
        </AnnotationContainer>
        <MapboxGL.Callout title={location.name} />
      </MapboxGL.PointAnnotation>
    ))
  )

  renderDataModal = () => (
    <Modal
      visible={this.state.maintenancesModalOpened}
      transparent={false}
      animationType="slide"
      onRequestClose={this.handleDataModalClose}
    >
      <ModalContainer>
        <ModalContainer>
          {/* <MapboxGL.MapView
            centerCoordinate={[
              this.state.maintenanceData.location.longitude,
              this.state.maintenanceData.location.latitude
            ]}
            style={{ flex: 1 }}
            styleURL={MapboxGL.StyleURL.Dark}
          >
            <MapboxGL.PointAnnotation
              id="center"
              coordinate={[
                this.state.realtyData.location.longitude,
                this.state.realtyData.location.latitude
              ]}
            >
              <MarkerContainer>
                <MarkerLabel />
              </MarkerContainer>
            </MapboxGL.PointAnnotation>
          </MapboxGL.MapView> */}
        </ModalContainer>
        <Form>
          <Input
            placeholder="Nome do Imóvel"
            value={this.state.name}
            onChangeText={this.handleNameChange}
            autoCapitalize="none"
            autoCorrect={false}
          />
          
        </Form>
        <DataButtonsWrapper>
          <SelectButtonContainer>
            <ButtonText>Salvar Manutenção</ButtonText>
          </SelectButtonContainer>
          <CancelButtonContainer onPress={this.handleDataModalClose}>
            <ButtonText>Cancelar</ButtonText>
          </CancelButtonContainer>
        </DataButtonsWrapper>
      </ModalContainer>
    </Modal>
  )

  render() {
    return (
      <Container>
        <StatusBar barStyle="dark-content" />
        <MapboxGL.MapView
          centerCoordinate={[-48.0445082, -15.9889863]}
          style={{ flex: 1 }}
          styleURL={MapboxGL.StyleURL.Dark}
        >
          { this.renderLocations() }
        </MapboxGL.MapView>
        { this.renderConditionalsButtons() }
      </Container>
    );
  }
}