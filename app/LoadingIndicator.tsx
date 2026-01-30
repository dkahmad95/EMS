'use client';
import React from 'react';
import {useLoading} from './LoadingContext';
import {message, Spin} from 'antd';

const LoadingIndicator: React.FC = () => {
  message.config({
    top: 300,
    duration: 1,
  });
  const {loading} = useLoading();

  if (!loading) return null;

  return <Spin fullscreen spinning={loading} />;
};

export default LoadingIndicator;
