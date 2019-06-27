import styled from 'styled-components/native';

const Container = styled.View`
    padding: 20px;
    border-radius: 4px;
    background: #FFF;
    margin-bottom: 15px;
`;

const RadarName = styled.Text`
font-size: 20px;
font-weight: bold;
color: #333;
`;

const ShowDate = styled.Text`
    font-size: 20px;
    color: #333;
`;

const Time = styled.Text`
    font-size: 20px;
    color: #333;
`;

const Stats = styled.View`
    flex-direction: row;
    margin-top: 15px;
`;

const Stat =  styled.View`
    flex-direction: row;
    align-items: center;
    margin-right: 15px;
`;

const StatStatus = styled.Text`
    margin-left: 6px;
`;

export {
    Container,
    RadarName,
    ShowDate,
    Time,
    Stats,
    Stat,
    StatStatus,
};