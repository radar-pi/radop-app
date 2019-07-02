import React from 'react';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

import {
    Container,
    RadarName,
    DateTime,
    ShowDate,
    Time,
    Reason,
} from './styles';

export default function Status({ data }) {
    return (
        <Container>
            <RadarName>{data.radar_id}: {data.radar_name}</RadarName>
            <DateTime>
                <ShowDate>{String(data.date).split('T')[0].split('-').reverse().join('/')}</ShowDate>
                <Time>{data.time}</Time>
            </DateTime>
            <Reason>{data.reason}</Reason>
        </Container>
    );
}
