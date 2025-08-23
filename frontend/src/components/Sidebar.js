import React from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import BarChartIcon from '@mui/icons-material/BarChart';
import Divider from '@mui/material/Divider';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Sidebar = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: <HomeIcon />, label: t('dashboard') },
    { path: '/add-transaction', icon: <AddCircleOutlineIcon />, label: t('add_transaction') },
    { path: '/analytics', icon: <BarChartIcon />, label: t('analytics') },
  ];

  return (
    <Drawer
      anchor="left"
      open={isOpen}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
    >
      <List sx={{ width: 250, pt: 2 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.path}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
            onClick={onClose}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
        <Divider sx={{ my: 2 }} />
      </List>
    </Drawer>
  );
};

export default Sidebar;
