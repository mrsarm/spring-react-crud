import React from 'react';
import Loading from './Loading';

export default function LoadingPagination(props) {
  return (
    <li className="page-item">
      <div style={{padding: '.5rem .75rem'}}>
        <Loading color="secondary" {...props}/>
      </div>
    </li>
  );
}
