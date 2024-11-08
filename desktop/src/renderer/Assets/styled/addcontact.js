import styled from 'styled-components';
import { MAIN_COLOR } from './colors';
export const Form = styled.form`
  /* border-radius: 20px; */

  padding: 30px 20px 20px 20px;
  background-color: #fff;
  height: 100%;
`;
export const Input = styled.input`
  display: block;
  width: 100%;
  height: 50px;
  border-radius: 10px;
  margin-top: 10px;
  outline: none;
  border: 1px solid ${MAIN_COLOR};
  padding: 5px 10px;
  font-size: 14px;
`;
export const Submit = styled.button.attrs((props) => ({
  type: 'submit',
}))`
  display: block;
  margin-top: 30px;
  width: 200px;
  height: 50px;
  border-radius: 10px;
  outline: none;
  border: 2px solid ${MAIN_COLOR};
  background-color: ${MAIN_COLOR};
  color: #fff;
  transition: color, background-color 0.3s ease-in-out;
  :hover {
    cursor: pointer;
    background-color: #fff;
    color: ${MAIN_COLOR};
    border: 2px solid ${MAIN_COLOR};
  }
`;
