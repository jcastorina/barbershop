import styled from "styled-components";

export const colors = {
  hotRed: "#ee1045",
  rusticRed: "#dd221b",
  milGreen: "#c8c7b5",
  coolBlue: "#03a1fb",
  chairBlue: "#87b5e3",
  floor: "#af8f71",
};

const ColorsContainer = styled.div<{ show: boolean }>`
  z-index: ${(props) => (props.show ? "50" : "-1")};
  display: ${(props) => (props.show ? "block" : "none")};
  position: absolute;
  border: 1px solid gray;
  top: 200px;
  left: 2px;
  height: 30vh;
  width: 50vw;
`;

const Circle = styled.div<{ color: string }>`
  border-radius: 32px;
  background-color: ${(props) => props.color};
  height: 1em;
  width: 1em;
  display: inline-block;
`;

const RowItem = styled.div`
  // border: 1px solid green;
  width: 80%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const StyleGuideButton = styled.button`
  color: white;
  height: 3em;
  width: 3em;
  border-radius: 32px;
  background-color: ${colors.coolBlue};
  position: absolute;
  z-index: 50;
  bottom: 10%;
  right: 10%;
`;

export const GuideButton = ({ handleClick }: { handleClick: () => void }) => (
  <StyleGuideButton onClick={() => handleClick()} />
);

export const Colors = ({ showColors }: { showColors: boolean }) => (
  <ColorsContainer show={showColors}>
    <div>Colors</div>
    <RowItem>
      Hot Red:{"  "} <Circle color={"#ee1045"} />
    </RowItem>
    <RowItem>
      Rustic Red:{"  "} <Circle color={"#dd221b"} />
    </RowItem>
    <RowItem>
      Mil Green:{"  "} <Circle color={"#c8c7b5"} />
    </RowItem>
    <RowItem>
      Cool Blue:{"  "} <Circle color={"#03a1fb"} />
    </RowItem>
    <RowItem>
      Chair Blue:{"  "} <Circle color={"#87b5e3"} />
    </RowItem>
    <RowItem>
      Floor:{"  "} <Circle color={"#af8f71"} />
    </RowItem>
  </ColorsContainer>
);

export const isNumeric = (value: any) => /^[0-9]*$/.test(value);
