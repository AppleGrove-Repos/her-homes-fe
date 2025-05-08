'use client';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { FC } from 'react';

interface Props {
  link?: string;
}

const BackButton: FC<Props> = ({ link }) => {
  const { back, push } = useRouter();

  return (
    <span
      onClick={() => (link ? push(link) : back())}
      className="cursor-pointer"
    >
      <ArrowLeft />
    </span>
  );
};

export default BackButton;
