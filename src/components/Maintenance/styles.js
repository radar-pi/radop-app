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

const DateTime = styled.View`
    flex-direction: row;
    margin-top: 10px;
`;

const ShowDate = styled.Text`
    font-size: 20px;
    color: #333;
    margin-left: 6px;
`;

const Time = styled.Text`
    font-size: 20px;
    color: #333;
    margin-left: 6px;
`;

const Reason = styled.Text.attrs({
    numberOfLines: 3,
})`
    color: #666;
    margin-top: 5px;
    line-height: 20px;
`;

export {
    Container,
    RadarName,
    DateTime,
    ShowDate,
    Time,
    Reason,
};