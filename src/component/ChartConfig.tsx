import React, {useState} from 'react';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {IconButton, ListItemIcon, Menu, MenuItem} from '@mui/material';
import '../dist.css';
import MoreIcon from '@mui/icons-material/MoreVert';
import {ChartConfigProps} from '../types';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const theme = createTheme({
  typography: {
    fontFamily:
      // eslint-disable-next-line
      "'M PLUS 1p','Roboto','Noto Sans JP', 'Helvetica Neue', 'Helvetica', 'Hiragino Sans', 'Arial', 'Yu Gothic', 'Meiryo', sans-serif",
    fontSize: 14
  }
});

const ChartConfig: React.FC<ChartConfigProps> = ({isDisplayed95, setIsDisplayed95}) => {
  const [moreMenuAnchor, setMoreMenuAnchor] = useState<HTMLElement | null>(null);
  const displayClick = () => {
    setMoreMenuAnchor(null);
    setIsDisplayed95(!isDisplayed95);
  };
  const moreButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setMoreMenuAnchor(event.currentTarget);
  };
  const onMoreMenuClose = () => {
    setMoreMenuAnchor(null);
  };
  const isMoreMenuOpen = Boolean(moreMenuAnchor);

  return (
    <div className="ChartConfig">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <IconButton aria-label="actions" sx={{color: 'white', width: '22px', height: '22px'}} onClick={moreButtonClick}>
          <MoreIcon sx={{width: '15px', height: '15px'}} />
        </IconButton>
        <Menu
          anchorEl={moreMenuAnchor}
          open={isMoreMenuOpen}
          onClose={onMoreMenuClose}
          anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
        >
          {isDisplayed95 ? (
            <MenuItem onClick={displayClick}>
              <ListItemIcon>
                <VisibilityOffIcon />
              </ListItemIcon>
              <span className="text-sm">出現期待値95%信頼区間を非表示にする</span>
            </MenuItem>
          ) : (
            <MenuItem onClick={displayClick}>
              <ListItemIcon>
                <VisibilityIcon />
              </ListItemIcon>
              <span className="text-sm">出現期待値95%信頼区間を表示する</span>
            </MenuItem>
          )}
        </Menu>
      </ThemeProvider>
    </div>
  );
};

export default ChartConfig;
