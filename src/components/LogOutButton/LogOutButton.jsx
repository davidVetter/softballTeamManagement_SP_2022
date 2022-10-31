import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';

function LogOutButton(props) {
  const dispatch = useDispatch();
  const history = useHistory();
  return (
    <LogoutIcon color='primary' sx={{ mr: '2px' }}
      // This button shows up in multiple locations and is styled differently
      // because it's styled differently depending on where it is used, the className
      // is passed to it from it's parents through React props
      className={props.className}
      onClick={() => {
        dispatch({ type: 'LOGOUT' });
        history.push('/');
      }}
    />
  );
}

export default LogOutButton;
