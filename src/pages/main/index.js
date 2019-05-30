import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { StatusBar } from 'react-native';

import MapboxGL from '@mapbox/react-native-mapbox-gl';

import api from '../../services/api';

import {
  Container,
  AnnotationContainer,
  AnnotationText,
  ButtonText,
  SelectButtonContainer,
  CancelButtonContainer,
  ButtonsWrapper,
  NewButtonContainer 
} from './styles';

export default class Main extends Component {
  static navigationOptions = {
    header: null,
  }

  state = {
    locations: [],
  }

  componentDidMount() {
    this.getLocation();  
  }

  getLocation = async () => {
    try {
      const response = await api.get('/maintenances', {
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

  renderLocations = () => (
    this.state.locations.map((location, index) => (
      <MapboxGL.PointAnnotation
        id={location.id.toString()}
        coordinate={[parseFloat(location.longitude), parseFloat(location.latitude)]}
        key={location.id.toString()}
      >
        <AnnotationContainer>
          <AnnotationText>{location.radar}</AnnotationText>
        </AnnotationContainer>
      </MapboxGL.PointAnnotation>
    ))
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
      </Container>
    );
  }
}