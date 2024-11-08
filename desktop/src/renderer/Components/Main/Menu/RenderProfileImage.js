import React from 'react';
import useProfileImageLoad from '../../../Functions/hooks/useProfileImageLoad';
import profileImage from '../../../Assets/imgs/profilegrey.png';
import groupImage from '../../../Assets/imgs/group.jpg';

export default function RenderProfileImage({ number, height, width }) {
  const { data, isLoading, error, progress } = useProfileImageLoad(number);

  if (number === null)
    return (
      <img
        alt="profile"
        src={groupImage}
        style={{ borderRadius: '50%' }}
        height={height ? height : 50}
        width={width ? width : 50}
      />
    );

  if (!data)
    return (
      <img
        alt="profile"
        src={profileImage}
        style={{ borderRadius: '50%' }}
        height={height ? height : 50}
        width={width ? width : 50}
      />
    );

  const url = URL.createObjectURL(data);

  return (
    <img
      alt="profile"
      src={url}
      style={{ borderRadius: '50%' }}
      height={height ? height : 50}
      width={width ? width : 50}
    />
  );
}
