import Image from 'next/image';
import React, { FC } from 'react';

interface Props {
  width?: number;
  height?: number;
}

const Logo: FC<Props> = ({ width = 100, height = 50 }) => {
  return (
    <Image src={'/svgs/logo.svg'} width={width} alt="logo" height={height} />
  );
};

export default Logo;
