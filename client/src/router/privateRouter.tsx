import React, { useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Role } from '../common/enum';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrent } from '../redux/action/asyncAction';
import { Spin } from 'antd';
import { LoadingOutlined } from "@ant-design/icons";
interface IPrivateRouterProps {
  adminOnly?: boolean;
}

const PrivateRouter: React.FC<IPrivateRouterProps> = ({ adminOnly }) => {
  const { isLogin, current, accessToken, isLoading } = useSelector(state => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      if (isLogin) {
        await dispatch(getCurrent());
      }
    };

    fetchData();
  }, [dispatch]);

  const auth = { token: accessToken, role: current?.RoleId }
  if (isLogin) {
    if (!current && isLoading) {
      return (
        <div style={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        </div>
      )
    } else {
      if (current.RoleId) {
        if (adminOnly) {
          return auth.token && auth.role === Role.ADMIN ? (
            <Outlet />
          ) : (
            <Navigate to='/loginAdmin' />
          );
        } else {
          return auth.token && auth.role === Role.USER ? (
            <Outlet />
          ) : (
            <Navigate to='/login' />
          );
        }
      }

    }

  } else {
    return <Navigate to='/login' />
  }

};

export default PrivateRouter;
