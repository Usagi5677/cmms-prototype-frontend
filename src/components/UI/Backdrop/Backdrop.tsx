import styled from "styled-components";

const BackdropContainer = styled.div<any>`
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 100;
  left: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.2);
`;

const Backdrop = (props: any) => {
  return props.show ? <BackdropContainer onClick={props.clicked}/> : null;
};

export default Backdrop;
