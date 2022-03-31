import styled from "styled-components";

const StatusCardWrapper = styled.div`
  width: 260px;
  min-height: 100px;
  background-color: white;
  border-radius: 20px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  padding: 10px 40px;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const StatusCardIcon = styled.div<any>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${(props) =>
    props.iconBackgroundColor ? props.iconBackgroundColor : "rgba(0, 183, 255, 0.2)"};
  color: ${(props) => (props.iconColor ? props.iconColor : "rgb(0, 183, 255)")};
  font-size: 1.5rem;
`;
const StatusCardInfoWrapper = styled.div`
  font-size: 1rem;
  text-align: right;
`;
const StatusCardAmount = styled.div`
  font-weight: 800;
`;
const StatusCardStatusName = styled.div`
  font-size: 1rem;
  text-align: right;
`;
const StatusCard = (props: any) => {
  return (
    <StatusCardWrapper>
      <StatusCardIcon
        iconBackgroundColor={props.iconBackgroundColor}
        iconColor={props.iconColor}
      >
        {props.icon}
      </StatusCardIcon>
      <StatusCardInfoWrapper>
        <StatusCardStatusName>{props.title}</StatusCardStatusName>
        <StatusCardAmount>{props.amount}</StatusCardAmount>
      </StatusCardInfoWrapper>
    </StatusCardWrapper>
  );
};

export default StatusCard;
