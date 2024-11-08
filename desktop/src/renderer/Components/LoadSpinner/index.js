import React from 'react';
import styled from 'styled-components';

export default function LoadSpinner({ percentage }) {
  const deg = (360 * percentage * 1) / 100;
  return <Spinner deg={deg}></Spinner>;
}

const Spinner = styled.div`
  height: 30px;
  width: 30px;
  background-image: conic-gradient(#888 ${({ deg }) => deg + 'deg'}, #fff 0deg);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;

  ::before {
    content: '';
    display: block;
    height: 25px;
    width: 25px;
    border-radius: 50%;
    background-color: #fff;
  }
`;
