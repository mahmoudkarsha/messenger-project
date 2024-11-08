import styled from 'styled-components';
import { MAIN_COLOR, SECONDERY_COLOR, THIRD_COLOR } from './colors';
import { divFlexCenter } from './shared';

export const LoginWrapper = styled(divFlexCenter)`
  background: transparent;
  height: 100vh;
  width: 100%;
`;

export const FormWrapper = styled.div`
  padding: 40px 13px;
  width: 100%;
  max-width: 600px;
  background-color: #0099ff;
  border-radius: 5px;
  z-index: 19;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
`;

export const FormGroup = styled.div`
  padding: 10px 0;
`;

export const TextInput = styled.input`
  width: 100%;
  height: calc(40px + 1vw);
  border-radius: 9px;
  /* border: 1px solid ${THIRD_COLOR}; */
  border: none;
  padding: 2px 10px;
`;
export const SelectInput = styled.select`
  width: 100%;
  height: 55px;
  border-radius: 7px;
  /* border: 1px solid ${THIRD_COLOR}; */
  border: none;
  padding: 2px 10px;
`;
export const SelectOption = styled.option``;
export const Submit = styled.button`
  height: calc(40px + 1vw);
  width: 200px;
  color: ${SECONDERY_COLOR};
  border-radius: 25px;
  background-color: ${MAIN_COLOR};
  border: 1px solid ${SECONDERY_COLOR};
  transition: 0.2s ease-in-out;
  font-size: 1em;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  :hover {
    cursor: pointer;
    transform: translateY(-2px);
  }
`;

export const Label = styled.label`
  font-size: 14px;
`;
