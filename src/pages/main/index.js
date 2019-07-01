import React, { Component } from 'react';

import {
  Keyboard,
  StatusBar,
  Modal,
} from 'react-native';

import {
  Dialog,
  SlideAnimation,
  DialogContent,
  DialogFooter,
  DialogButton,
  DialogTitle,
} from 'react-native-popup-dialog';

import AsyncStorage from '@react-native-community/async-storage';

import MapboxGL from '@mapbox/react-native-mapbox-gl';

import DateTimePicker from "react-native-modal-datetime-picker";

import Status from '../../components/Status';
import Maintenance from '../../components/Maintenance';

import api from '../../services/api';

import {
  Container,
  AnnotationContainer,
  AnnotationText,
  DialogText,
  ModalText,
  TextContainer,
  ButtonsWrapper,
  CancelButtonContainer,
  SelectButtonContainer,
  ButtonText,
  ModalContainer,
  DataButtonsWrapper,
  MarkerContainer,
  MarkerLabel,
  Form,
  Input,
  List,
} from './styles';

import { ScrollView } from 'react-native-gesture-handler';

export default class Main extends Component {
  static navigationOptions = {
    header: null,
  }

  state = {
    locations: [],
    status: [],
    maintenances: [],
    radar_name: '',
    newMaintenance: false,
    seeMaintenance: false,
    statusModalOpened: false,
    maintenancesModalOpened: false,
    maintenanceListModalOpened: false,
    isDatePickerVisible: false,
    isTimePickerVisible: false,
    savedMaintenancePopup: false,
    latitude: 0.0,
    longitude: 0.0,
    maintenanceData: {
      user_id: '',
      date: '',
      time: '',
      reason: '',
      radar_id: '',
    },
    savedMessage: '',
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

  getStatus = async (radar_id) => {
    try {
      const response = await api.get(`/radar/${radar_id}/statuses`, {});

      const data = response.data
      data.forEach((element) => {
        element['radar_name']=this.state.radar_name;
      });
      this.setState({
        status: data
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  getMaintenance = async (radar_id) => {
    try {
      const response = await api.get(`/maintenances/radar/${radar_id}`, {});
      console.log(response)
      const data = response.data
      data.forEach((element) => {
        element['radar_name']=this.state.radar_name;
      });
      this.setState({
        maintenances: data
      })
      console.log(this.state.maintenances)
    } catch (err) {
      console.error(err);
      throw err
    }
  }

  handleNewMaintenancePress = () => this.setState({ newMaintenance: !this.state.newMaintenance })

  handleMaintenanceListPress = () => this.setState({ seeMaintenance: !this.state.seeMaintenance })

  handleMaintenanceCancelPress = () => {
    this.setState({
      newMaintenance: false,
      seeMaintenance: false,
    })
  }

  handleDataModalClose = () => {
    this.setState({
      maintenancesModalOpened: !this.state.maintenancesModalOpened,
      maintenanceData: {
        date: '',
        time: '',
        reason: '',
        radar_id: '',
      },
      newMaintenance: !this.state.newMaintenance
    })
    this.forceUpdate()
  }

  handleStatusModalClose = () => {
    this.setState({
      statusModalOpened: !this.state.statusModalOpened
    })
  }

  handleMaintenanceListClose = () => {
    this.setState({
      seeMaintenance: !this.state.seeMaintenance,
      maintenanceListModalOpened: !this.state.maintenanceListModalOpened
    })
  }

  handleGetRadarPress = async (location) => {
    let { id, latitude, longitude, name } = location
    if (this.state.newMaintenance) {
      this.setState({
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        radar_name: name,
        maintenanceData: {
          ...this.state.maintenanceData,
          radar_id: id,
        }
      });
    } else if (this.state.seeMaintenance) {
      this.setState({ radar_name: name })
      await this.getMaintenance(id)
    } else {
      this.setState({ radar_name: name })
      await this.getStatus(id)
      this.setState({
        statusModalOpened: !this.state.statusModalOpened
      })
    }
  }

  handleSelectedRadarMaintenancePress = () => {
    if (this.state.newMaintenance) {
      this.setState({ maintenancesModalOpened: !this.state.maintenancesModalOpened })
    } else if (this.state.seeMaintenance) {
      this.setState({ maintenanceListModalOpened: !this.state.maintenanceListModalOpened })
    } else {
      console.error('Error at handleSelectedRadarMaintenancePress!')
    }
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

      this.setState({
        savedMessage: `A manutenção do radar ${this.state.radar_name} foi salva!`
      })
      this.setState({
        latitude: 0.0,
        longitude: 0.0,      
        maintenanceData: {
          date: '',
          time: '',
          reason: '',
          radar_id: '',
        },
        savedMaintenancePopup: false,
        newMaintenance: !this.state.newMaintenance,
        maintenancesModalOpened: false
      });

      this.setState({ savedMaintenancePopup: !this.state.savedMaintenancePopup })
    
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
    (!this.state.newMaintenance && !this.state.seeMaintenance) ? (
      <ButtonsWrapper>
        <SelectButtonContainer onPress={this.handleMaintenanceListPress}>
          <ButtonText>Ver Manutenções</ButtonText>
        </SelectButtonContainer>
        <CancelButtonContainer style={{ backgroundColor: '#fc6663' }} onPress={this.handleNewMaintenancePress}>
          <ButtonText>Nova Manutenção</ButtonText>
        </CancelButtonContainer>
      </ButtonsWrapper>
    ) : (
      <ButtonsWrapper>
        <SelectButtonContainer onPress={this.handleSelectedRadarMaintenancePress}>
          <ButtonText>Selecione o Radar</ButtonText>
        </SelectButtonContainer>
        <CancelButtonContainer onPress={this.handleMaintenanceCancelPress}>
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
        <MapboxGL.Callout title={`Selecionado: \n${location.name}`} />
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

  renderStatusModal = () => (
    <Modal
      visible={this.state.statusModalOpened}
      transparent={false}
      animationType="slide"
      onRequestClose={this.handleStatusModalClose}
    >
      <ModalContainer>
        <TextContainer>
          <ModalText>Status</ModalText>
        </TextContainer>
        <List
          keyboardShouldPersistTaps="handled"
          data={this.state.status}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => (
            <Status data={ item } />
          )}
        />
      </ModalContainer>
      <CancelButtonContainer 
      style={{ marginBottom: 10, marginHorizontal: 20 }}
      onPress={this.handleStatusModalClose}>
        <ButtonText>Fechar</ButtonText>
      </CancelButtonContainer>
    </Modal>
  )

  renderMaintenanceListModal = () => (
    <Modal
      visible={this.state.maintenanceListModalOpened}
      transparent={false}
      animationType="slide"
      onRequestClose={this.handleMaintenanceListClose}>
        <TextContainer>
          <ModalText>Manutenções</ModalText>
        </TextContainer>
        <ModalContainer>
        <List
          keyboardShouldPersistTaps="handled"
          data={this.state.maintenances}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => (
            <Maintenance data={ item } />
          )}
        />
        </ModalContainer>
        <CancelButtonContainer
        style={{ marginBottom: 10, marginHorizontal: 20 }}
        onPress={this.handleMaintenanceListClose}>
          <ButtonText>Fechar</ButtonText>
        </CancelButtonContainer>
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
        { this.renderStatusModal() }
        { this.renderMaintenanceListModal() }
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
        <Dialog
          visible={this.state.savedMaintenancePopup}
          dialogAnimation={new SlideAnimation({
            slideFrom: 'bottom',
          })}
          footer={
            <DialogFooter>
              <DialogButton
                text="OK"
                onPress={() => {this.setState({ savedMaintenancePopup: false })}}
              />
              <DialogButton
                style={{ display: 'none' }}
              />
            </DialogFooter>
          }
        >
          <DialogTitle title='Manutenção'/>
          <DialogContent>
            <DialogText> { this.state.savedMessage } </DialogText>
          </DialogContent>
        </Dialog>
      </Container>
    );
  }
}