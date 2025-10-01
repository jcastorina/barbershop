import styled from "styled-components";

import { colors } from "../utilities";

const mediaBreak = "830px";

export const IsMaintenance = styled.div`
  position: absolute;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: white;
  z-index: 999;
`;

export const AppView = styled.div`
  overflow-y: scroll;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const StyledLogo = styled.img`
  padding: 1em;
  align-self: flex-start;
  @media (max-height: ${mediaBreak}) {
    width: 6em;
    height: 6em;
  }
  @media (min-height: ${mediaBreak}) {
    width: 10em;
    height: 10em;
  }
`;

export const Header = styled.div`
  align-self: flex-start;
`;

export const Content = styled.div`
  align-self: center;
  display: flex;
  flex-direction: column;
  width: 25em;
  align-items: center;
  background-color: white;
  border-radius: 6px;
  box-sizing: content-box;
  margin-top: -3em;
  margin-bottom: 3em;
  padding: 3em 0em;
`;

export const Footer = styled.div`
  background-color: ${colors.floor};
  color: white;
  width: 100%;
  height: 3em;
  display: grid;
  place-items: center;
  font-style: italic;
`;

export const Anchor = styled.a`
  padding: 1.5em 2.4em;
  background-color: ${colors.coolBlue};
  font-size: 1em;
  color: white;
  border: none;
  margin: 0.5em 1em;
  text-decoration: none;
  border-radius: 2px;
  display: grid;
  place-items: center;

  &:hover {
    cursor: pointer;
    background-color: ${colors.chairBlue};
  }

  &:not(.make-appointment-button) {
    background-color: #b79953;
  }

  &:not(.make-appointment-button):hover {
    background-color: ${colors.milGreen};
  }

  &.make-appointment-button {
    margin-bottom: 1.5em;
  }

  @media (max-width: 768px) {
    width: 80%;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding-top: 2em;

  a {
    width: 14em;
  }

  hr {
    border: none;
    border-bottom: 1px solid black;
    height: 1em;
    width: 80%;
    margin: 1em 0em 2em 0em;
  }
`;

const Prices = ({ handleClick, className }: { handleClick: () => void; className?: string }) => {
  return (
    <div className={className}>
      <table className={"table"}>
        <tr className={"table-row"}>
          <td className={"label"}>HAIRCUT</td>
          <td className={"price"}>$24</td>
        </tr>
        <tr className={"table-row"}>
          <td className={"label"}>KIDS</td>
          <td className={"price"}>$22</td>
        </tr>
        <tr className={"table-row"}>
          <td className={"label"}>SENIOR</td>
          <td className={"price"}>$20</td>
        </tr>
        <tr className={"table-row"}>
          <td className={"label"}>HEAD SHAVE</td>
          <td className={"price"}>$28</td>
        </tr>
        <tr className={"table-row"}>
          <td className={"label"}>FACE SHAVE</td>
          <td className={"price"}>$32</td>
        </tr>
        <tr className={"table-row"}>
          <td className={"label"}>BEARD TRIM</td>
          <td className={"price"}>$16</td>
        </tr>
        <tr className={"table-row"}>
          <td className={"label"}>HAIR & BEARD</td>
          <td className={"price"}>$31</td>
        </tr>
      </table>
      <div className={"note-items"}>
        <ul>
          <li>
            <span className={"cash-or-check"}>Cash or Check ONLY</span>
          </li>
          <li>
            <span className={"walk-ins"}>Walk ins accepted if time allows</span>
          </li>
        </ul>
      </div>
      <div className={"button-wrapper"}>
        <button onClick={() => handleClick()}>Close</button>
      </div>
    </div>
  );
};

export const StyledPrices = styled(Prices)`
  color: black;
  display: flex;
  flex-direction: column;

  button {
    background: none;
    border: none;

    font-size: 1em;
  }

  button:hover {
    cursor: pointer;
  }

  .button-wrapper {
    padding-top: 2em;
    display: grid;
    place-items: center;
  }

  .table {
  }

  .table-row {
  }

  td {
    border-bottom: 1px solid black;
    padding-top: 0.8em;
  }

  .label {
    font-weight: bold;
    font-size: 1.3em;
    padding-bottom: 0.3em;
  }

  .price {
    color: ${colors.coolBlue};
    font-weight: bold;
    font-size: 1.3em;
  }

  .note-items {
    display: flex;
    flex-direction: column;
    font-size: 0.9em;
    align-self: flex-start;

    color: rgba(44, 44, 44, 1);
  }

  .cash-or-check {
    font-style: italic;
    font-weight: bold;
  }

  .walk-ins {
    font-style: italic;
    font-weight: bold;
  }
`;
