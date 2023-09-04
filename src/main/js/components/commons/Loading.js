import { Spinner } from 'reactstrap';
import React from 'react';

export default function Loading({
    message = "Loading...",
    size = 'sm',
    color = 'primary',
    display = true
}) {
  if (!display) return '';
  return (
    <>
      <Spinner size={size} color={color}/>
      <span>&nbsp;&nbsp;{message}</span>
    </>
  );
}
