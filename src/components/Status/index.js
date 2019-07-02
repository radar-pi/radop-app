import React from 'react';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Icon from 'react-native-vector-icons/MaterialIcons';

import {
    Container,
    RadarName,
    ShowDate,
    Time,
    Stats,
    Stat,
    StatStatus
} from './styles';

export default function Status({ data }) {

    defineText = (text) => {
        if (text) {
            return 'OK!'
        } else {
            return 'ERRO!'
        }
    }

    return (
        <Container>
            <RadarName>{data.radar_id}: {data.radar_name}</RadarName>
            <ShowDate>{String(data.date).split('T')[0].split('-').reverse().join('/')}</ShowDate>
            <Time>{data.time}</Time>
            <Stats>
                <Stat>
                    <FontAwesome5 name="broadcast-tower" size={22} color="#333" />
                    <StatStatus>{this.defineText(data.radar)}</StatStatus>
                </Stat>
                <Stat>
                    <FontAwesome5 name="camera" size={22} color="#333" />
                    <StatStatus>{this.defineText(data.camera)}</StatStatus>
                </Stat>
                <Stat>
                    <FontAwesome5 name="digital-tachograph" size={22} color="#333" />
                    <StatStatus>{this.defineText(data.rasp)}</StatStatus>
                </Stat>
                <Stat>
                    <Icon name="developer-board" size={22} color="#333" />
                    <StatStatus>{this.defineText(data.usrp)}</StatStatus>
                </Stat>
            </Stats>
        </Container>
    );
}
