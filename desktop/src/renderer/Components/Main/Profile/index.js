import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { BsFillCameraFill } from 'react-icons/bs';
import { SERVER_URL } from '../../../Functions/methods/Server/server';
import useProfileImageLoad from '../../../Functions/hooks/useProfileImageLoad';

export default function Profile({ user, wsserver, locale, setLocale }) {
  const fileSelectorRef = useRef();
  const imageRef = useRef();
  const { data } = useProfileImageLoad(user.number);
  let url;
  if (data) url = URL.createObjectURL(data);
  function onImageChange(e) {
    try {
      const image = e.target.files[0];
      wsserver.emit(
        'update-profile-image',
        {
          sender_number: user.number,
          buffer: image,
        },
        () => {
          const url = URL.createObjectURL(image);
          imageRef.current.src = url;
        }
      );
    } catch (err) {}
  }
  return (
    <div style={{ marginTop: 60 }}>
      <input
        type="file"
        ref={fileSelectorRef}
        onChange={onImageChange}
        style={{ display: 'none' }}
      />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          flexDirection: 'column',
        }}
      >
        <div style={{ position: 'relative' }}>
          <ProfileImage ref={imageRef} src={url}></ProfileImage>

          <CameraIcon
            onClick={() => {
              fileSelectorRef.current?.click();
            }}
          >
            <BsFillCameraFill size={23} />
          </CameraIcon>
        </div>
        <div style={{ margin: 10, width: '95%' }}>
          <p>اخنر لغة العرض</p>
          <Select
            onChange={(e) => {
              setLocale(e.target.value);
              window.localStorage.setItem('locale', e.target.value);
            }}
            value={locale}
          >
            <option value={'kr'}>kurdi</option>
            <option value={'ar'}>العربية</option>
            <option value={'tr'}>Turkey</option>
          </Select>
        </div>
      </div>
    </div>
  );
}

const Select = styled.select`
  width: 100%;
  height: 44px;
  outline: none;
  border: 1px solid #ccc;
  border-radius: 10px;
`;

const ProfileImage = styled.img`
  height: 150px;
  width: 150px;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid #aaa;
`;

const CameraIcon = styled.div`
  position: absolute;
  bottom: 20px;
  right: 0;
  height: 40px;
  width: 40px;
  border-radius: 50%;
  background-color: red;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;

  :hover {
    background-color: #333;
    cursor: pointer;
  }
`;
