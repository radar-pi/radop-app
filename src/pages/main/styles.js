import styled from 'styled-components';

import { Dimensions } from 'react-native';

const Container = styled.View`
  flex: 1;
`;

const ModalText = styled.Text`
  fontWeight: bold;
  alignItems: center;
  justifyContent: center;
  fontSize: 28px;
`;

const TextContainer = styled.View`
  paddingTop: 10px;
  alignItems: center;
  justifyContent: center;
`;

const AnnotationContainer = styled.View`
  alignItems: center;
  justifyContent: center;
  backgroundColor: #fc6663;
  borderRadius: 5;
  padding: 5px;
`;

const AnnotationText = styled.Text`
  fontSize: 14px;
  color: #fff;
`;

const DialogText = styled.Text`
  fontSize: 14px;
  alignItems: center;
  justifyContent: center;
  marginTop: 14px;
`;

const NewButtonContainer = styled.TouchableHighlight`
  position: absolute;
  bottom: 54;
  left: 20;
  right: 20;
  alignSelf: center;
  borderRadius: 5px;
  paddingVertical: 20px;
  backgroundColor: #fc6663;
`;

const ButtonsWrapper = styled.View`
  position: absolute;
  bottom: 54;
  left: 20;
  right: 20;
`;

const CancelButtonContainer = styled.TouchableHighlight`
  alignSelf: stretch;
  borderRadius: 5px;
  paddingVertical: 20px;
  backgroundColor: #555;
  marginTop: 20px;
`;

const SelectButtonContainer = styled.TouchableHighlight`
  alignSelf: stretch;
  borderRadius: 5px;
  paddingVertical: 20px;
  backgroundColor: #fc6663;
`;

const ButtonText = styled.Text`
  color: #fff;
  fontSize: 16px;
  textAlign: center;
  fontWeight: bold;
`;

const Marker = styled.Image`
  width: 60px;
  height: 60px;
  position: absolute;
  alignSelf: center;
  top: ${(Dimensions.get('window').height / 2) - 60};
`;

const ModalContainer = styled.View`
  flex: 1;
  backgroundColor: #FFF;
`;

const ModalImagesListContainer = styled.View``;

const ModalImagesList = styled.ScrollView`
  paddingHorizontal: 20px;
  paddingTop: 20px;
`;

const ModalImageItem = styled.Image`
  height: 100px;
  width: 100px;
  marginRight: 10px;
`;

const ModalButtons = styled.View`
  paddingHorizontal: 10px;
  paddingVertical: 5px;
  flexDirection: row;
  justifyContent: space-between;
`;

const CameraButtonContainer = styled.TouchableHighlight`
  paddingVertical: 20px;
  paddingHorizontal: 40px;
`;

const CancelButtonText = styled.Text`
  color: #333;
  fontSize: 18px;
  fontWeight: bold;
`;

const ContinueButtonText = styled.Text`
  color: #fc6663;
  fontSize: 18px;
  fontWeight: bold;
`;

const DataButtonsWrapper = styled.View`
  flex: 1;
  alignItems: flex-end;
  justifyContent: flex-end;
  paddingHorizontal: 20px;
`;

const MarkerContainer = styled.View`
  width: 30px;
  height: 30px;
  alignItems: center;
  justifyContent: center;
  backgroundColor: #FFF;
  borderRadius: 15px;
`;

const MarkerLabel = styled.View`
  width: 24px;
  height: 24px;
  borderRadius: 12px;
  backgroundColor: #7159C1;
`;

const Form = styled.View`
  flex: 1;
  marginTop: 20px;
`;

const Input = styled.TextInput`
  paddingHorizontal: 20px;
  paddingVertical: 10px;
  borderRadius: 5px;
  backgroundColor: #FFF;
  alignSelf: stretch;
  marginBottom: 10px;
  marginHorizontal: 20px;
  fontSize: 14px;
  borderWidth: 1px;
  borderColor: #CCC;
`;

const List = styled.FlatList.attrs({
  contentContainerStyle: { paddingHorizontal: 20},
  showsVerticalScrollIndicator: false,
})`
  margin-top: 20px
`;

export {
  Container,
  ModalText,
  TextContainer,
  AnnotationContainer,
  AnnotationText,
  DialogText,
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
  DataButtonsWrapper,
  MarkerContainer,
  MarkerLabel,
  Form,
  Input,
  List
};