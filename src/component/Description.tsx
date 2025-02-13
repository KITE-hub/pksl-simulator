import React, {useState, useEffect, useCallback} from 'react';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
  Divider,
  Icon,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Link,
  Button,
  Snackbar
} from '@mui/material';
import '../dist.css';
import lotteryConfig from '../db/other/lotteryConfig.json';
import CheckIcon from '@mui/icons-material/Check';
import {styled} from '@mui/material/styles';
import MoreIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import DescriptionIcon from '@mui/icons-material/Description';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import NotDecidedGrid from './NotDecidedGrid';

const updateDateBase1 = new Date(lotteryConfig.updateDate);
const updateDateBase2 = new Date(updateDateBase1.getTime() + 9 * 60 * 60 * 1000); // UTC → JST
const updateDate = updateDateBase2.toISOString().split('T')[0].replace(/-/g, '/');

const theme = createTheme({
  typography: {
    fontFamily:
      // eslint-disable-next-line
      "'M PLUS 1p','Roboto','Noto Sans JP', 'Helvetica Neue', 'Helvetica', 'Hiragino Sans', 'Arial', 'Yu Gothic', 'Meiryo', sans-serif",
    fontSize: 14
  }
});
const CustomDialogTitle = styled(DialogTitle)({
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#333'
});
const CustomButton = styled(Button)({
  color: '#333',
  fontWeight: 'bold',
  borderRadius: '9999px',
  fontSize: '16px',
  paddingTop: '6px',
  paddingBottom: '6px',
  display: 'flex',
  margin: '5px auto',
  width: '128px',
  border: '1px solid #999',
  boxShadow: '0px 2px 0px 0px rgba(0, 0, 0, .1)',
  '&:hover': {
    backgroundColor: 'inherit'
  }
});

const Description: React.FC = () => {
  const [moreMenuAnchor, setMoreMenuAnchor] = useState<HTMLElement | null>(null);
  const simulatorClick = () => {
    setMoreMenuAnchor(null);
  };
  const ingMgmtClick = () => {
    setMoreMenuAnchor(null);
    window.location.href = 'https://kite-hub.github.io/pksl-ing-mgmt-static/';
  };
  const slpCtrlClick = () => {
    setMoreMenuAnchor(null);
    window.location.href = 'https://kite-hub.github.io/pksl-slp-ctrl/';
  };
  const moreButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setMoreMenuAnchor(event.currentTarget);
  };
  const onMoreMenuClose = () => {
    setMoreMenuAnchor(null);
  };
  const isMoreMenuOpen = Boolean(moreMenuAnchor);

  const [isHowToDialogOpen, setIsHowToDialogOpen] = useState<boolean>(false);
  const howToMenuClick = () => {
    setIsHowToDialogOpen(true);
    setMoreMenuAnchor(null);
  };
  const onHowToDialogClose = () => {
    setIsHowToDialogOpen(false);
  };

  const [isDescriptionDialogOpen, setIsDescriptionDialogOpen] = useState(false);
  const descriptionMenuClick = () => {
    setIsDescriptionDialogOpen(true);
    setMoreMenuAnchor(null);
  };
  const onDescriptionDialogClose = () => {
    setIsDescriptionDialogOpen(false);
  };

  const [isReferenceDialogOpen, setIsReferenceDialogOpen] = useState(false);
  const referenceMenuClick = () => {
    setIsReferenceDialogOpen(true);
    setMoreMenuAnchor(null);
  };
  const onReferenceDialogClose = () => {
    setIsReferenceDialogOpen(false);
  };

  const [isDevRequestDialogOpen, setIsDevRequestDialogOpen] = useState(false);
  const devRequestMenuClick = () => {
    setIsDevRequestDialogOpen(true);
    setMoreMenuAnchor(null);
  };
  const onDevRequestDialogClose = () => {
    setIsDevRequestDialogOpen(false);
  };

  const [clearStorageMessageVisible, setClearStorageMessageVisible] = useState<boolean>(false);
  const onClearStorageMessageClose = useCallback(() => {
    setClearStorageMessageVisible(false);
  }, [setClearStorageMessageVisible]);
  const handleClearStorage = () => {
    localStorage.clear();
    sessionStorage.setItem('showClearMessage', 'true');
    window.location.reload();
  };
  useEffect(() => {
    const flag = sessionStorage.getItem('showClearMessage');
    if (flag === 'true') {
      setClearStorageMessageVisible(true);
      sessionStorage.removeItem('showClearMessage');
    }
  }, []);

  return (
    <div className="Description">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <IconButton size="small" aria-label="actions" sx={{color: 'white'}} onClick={moreButtonClick}>
          <MoreIcon />
        </IconButton>
        <Menu
          anchorEl={moreMenuAnchor}
          open={isMoreMenuOpen}
          onClose={onMoreMenuClose}
          anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
        >
          <MenuItem onClick={simulatorClick}>
            <ListItemIcon>
              <CheckIcon />
            </ListItemIcon>
            寝顔リサーチシミュレーター
          </MenuItem>
          <MenuItem onClick={ingMgmtClick}>
            <ListItemIcon>
              <Icon />
            </ListItemIcon>
            食材管理ツール
          </MenuItem>
          <MenuItem onClick={slpCtrlClick}>
            <ListItemIcon>
              <Icon />
            </ListItemIcon>
            睡眠管理ツール
          </MenuItem>
          <Divider />
          <MenuItem onClick={howToMenuClick}>
            <ListItemIcon>
              <HelpOutlineIcon />
            </ListItemIcon>
            使い方
          </MenuItem>
          <MenuItem onClick={descriptionMenuClick}>
            <ListItemIcon>
              <DescriptionIcon />
            </ListItemIcon>
            抽選モデルの説明
          </MenuItem>
          <MenuItem onClick={referenceMenuClick}>
            <ListItemIcon>
              <MenuBookIcon />
            </ListItemIcon>
            出典、参考元、謝辞
          </MenuItem>
          <MenuItem onClick={devRequestMenuClick}>
            <ListItemIcon>
              <InfoOutlinedIcon />
            </ListItemIcon>
            開発者・要望について
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleClearStorage}>
            <ListItemIcon>
              <DeleteIcon />
            </ListItemIcon>
            ローカルストレージの全削除
          </MenuItem>
        </Menu>
        <Dialog
          open={isHowToDialogOpen}
          onClose={onHowToDialogClose}
          scroll="paper"
          aria-describedby="scroll-dialog-description"
        >
          <CustomDialogTitle>使い方</CustomDialogTitle>
          <DialogContent dividers>
            <p>
              {'　'}
              ポケモン名、フィールド名、エナジーなどの条件を入力すると、1回のリサーチで目的のポケモンが何体出現するか、また1体以上出現する確率がどの程度かなどを計算し、計算結果を図表で表示します。
              <br />
              {'　'}計算量が増えると処理時間が長くなり、負荷も高くなるため、設定条件は各自で調整してください。
              <br />
              {'　'}また、計算結果についての厳密性は保証しません。あくまで参考程度にお願いいたします。
            </p>
            <br />
          </DialogContent>
          <DialogActions>
            <CustomButton onClick={onHowToDialogClose}>閉じる</CustomButton>
          </DialogActions>
        </Dialog>
        <Dialog
          open={isDescriptionDialogOpen}
          onClose={onHowToDialogClose}
          scroll="paper"
          aria-describedby="scroll-dialog-description"
        >
          <CustomDialogTitle>抽選モデルの説明</CustomDialogTitle>
          <DialogContent dividers>
            <div className="flex items-center">
              <div className="w-1.5 h-6 bg-[#25d76b] mr-2"></div>
              <h3 className="font-bold text-base">必要ねむけパワー</h3>
            </div>
            <hr className="mt-1 mb-2" />
            <p>
              {'　'}各ポケモンの寝顔には、その寝顔が出現するために必要なねむけパワーが定められている (例:
              コラッタ☆1の必要ねむけパワー=76000)。
              <br />
              {'　'}
              仕様変更に伴い、現在の新規の寝顔の必要ねむけパワーの特定は困難であり、実際のリサーチ結果から範囲を地道に絞り込む必要があるため、一部の寝顔の必要ねむけパワーは未確定となっている。
            </p>
            <br />
            <div className="flex items-center">
              <div className="w-1.5 h-6 bg-[#25d76b] mr-2"></div>
              <h3 className="font-bold text-base">寝顔抽選の流れ</h3>
            </div>
            <hr className="mt-1 mb-2" />
            <ol>
              <li>
                1.
                総ねむけパワー以下の必要ねむけパワーを持つ寝顔の中からランダムで選択され、選択された寝顔の必要ねむけパワーを消費する。
              </li>
              <li>
                2.
                消費後の残ったねむけパワー以下の必要ねむけパワーを持つ寝顔の中からランダムで選択され、選択された寝顔の必要ねむけパワーを消費する。
              </li>
              <li>3. 2を繰り返す。</li>
              <li>
                4.
                最終枠の寝顔については、残ったねむけパワー以下かつ出現しうる寝顔のうち必要ねむけパワーが最も大きい寝顔が選択される。
              </li>
            </ol>
            <br />
            <div className="flex items-center">
              <div className="w-1.5 h-6 bg-[#25d76b] mr-2"></div>
              <h3 className="font-bold text-base">その他の条件 ({updateDate}時点)</h3>
            </div>
            <hr className="mt-1 mb-2" />
            <ul>
              <li>・出現しうるすべての寝顔は、等しい確率で抽選されるものとする。</li>
              <li>・おなかのうえ寝の寝顔は1リサーチに1つまでしか出現しないものとする。</li>
              <li>
                ・エンテイ、ライコウ、スイクンのような伝説のポケモンは1リサーチに1体までしか出現しないものとする。
              </li>
              <li>
                ・ピッピ族、伝説のポケモン、リリース日から2ヶ月以内のポケモンの寝顔は、80%の確率で最終枠抽選の対象から外れるものとする。
              </li>
              <li>・一部ポケモンについて確定帯のズレが見られるが、この現象は考慮しないものとする。</li>
            </ul>
            <br />
            <div className="flex items-center">
              <div className="w-1.5 h-6 bg-[#25d76b] mr-2"></div>
              <h3 className="font-bold text-base">
                必要ねむけパワーが未確定である寝顔と必要ねむけパワー(推定)の一覧 ({updateDate}時点)
              </h3>
            </div>
            <hr className="mt-1 mb-2" />
            <NotDecidedGrid></NotDecidedGrid>
            <br />
          </DialogContent>
          <DialogActions>
            <CustomButton onClick={onDescriptionDialogClose}>閉じる</CustomButton>
          </DialogActions>
        </Dialog>
        <Dialog
          open={isReferenceDialogOpen}
          onClose={onReferenceDialogClose}
          scroll="paper"
          aria-describedby="scroll-dialog-description"
        >
          <CustomDialogTitle>出典、参考元、謝辞</CustomDialogTitle>
          <DialogContent dividers>
            <div className="flex items-center">
              <div className="w-1.5 h-6 bg-[#25d76b] mr-2"></div>
              <h3 className="font-bold text-base">出典</h3>
            </div>
            <hr className="mt-1 mb-2" />
            <ul>
              <li>
                <Link
                  href="https://pks.raenonx.cc/ja/docs/view/help/sleep-styles#%E3%82%B9%E3%83%9A%E3%82%B7%E3%83%A3%E3%83%AB%E3%82%B5%E3%83%B3%E3%82%AF%E3%82%B9"
                  underline="hover"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  raenonX
                </Link>
              </li>
            </ul>
            <br />
            <div className="flex items-center">
              <div className="w-1.5 h-6 bg-[#25d76b] mr-2"></div>
              <h3 className="font-bold text-base">参考元</h3>
            </div>
            <hr className="mt-1 mb-2" />
            <ul>
              <li>
                <Link
                  href="https://wikiwiki.jp/poke_sleep/%E7%9D%A1%E7%9C%A0%E3%83%AA%E3%82%B5%E3%83%BC%E3%83%81/%E3%81%AD%E3%82%80%E3%81%91%E3%83%91%E3%83%AF%E3%83%BC/%E5%AF%9D%E9%A1%94%E5%87%BA%E7%8F%BE%E3%81%AE%E6%B3%95%E5%89%87"
                  underline="hover"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ポケモンスリープ攻略・検証wiki
                </Link>
              </li>
              <li>
                <Link href="https://note.com/cashunoe/all" underline="hover" target="_blank" rel="noopener noreferrer">
                  note by くますーん
                </Link>
              </li>
              <li>
                <Link
                  href="https://nitoyon.github.io/pokesleep-tool/iv/index.ja.html"
                  underline="hover"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  個体値計算機 by nitoyon
                </Link>
              </li>
            </ul>
            <br />
            <div className="flex items-center">
              <div className="w-1.5 h-6 bg-[#25d76b] mr-2"></div>
              <h3 className="font-bold text-base">謝辞</h3>
            </div>
            <hr className="mt-1 mb-2" />
            <p>
              {'　'}
              寝顔抽選の仕組みや必要ねむけパワーについて調査を行ってくださった先人の皆様に、心より感謝申し上げます。
            </p>
            <br />
          </DialogContent>
          <DialogActions>
            <CustomButton onClick={onReferenceDialogClose}>閉じる</CustomButton>
          </DialogActions>
        </Dialog>
        <Dialog
          open={isDevRequestDialogOpen}
          onClose={onDevRequestDialogClose}
          scroll="paper"
          aria-describedby="scroll-dialog-description"
        >
          <CustomDialogTitle>開発者・要望について</CustomDialogTitle>
          <DialogContent dividers>
            <div className="text-[#333]">
              <div>
                {'　'}
                このツールは、{' '}
                <Link href="https://x.com/mdk_pksldev2" underline="hover" target="_blank" rel="noopener noreferrer">
                  擬き(もどき)
                </Link>{' '}
                が個人で開発した非公式のツールです。
                <br />
                {'　'}
                不具合報告や要望等は、X (旧Twitter) の{' '}
                <Link href="https://x.com/mdk_pksldev2" underline="hover" target="_blank" rel="noopener noreferrer">
                  @mdk_pksldev
                </Link>{' '}
                のDMや、
                <Link
                  href="https://docs.google.com/forms/d/e/1FAIpQLScoxizZQkinwJKA2h5BjU3CNGjWx_FirvxlWaNDRGhH5Qop4g/viewform?usp=header"
                  underline="hover"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  問い合わせフォーム
                </Link>{' '}
                までお願いします。
              </div>
              <br />
            </div>
          </DialogContent>
          <DialogActions>
            <CustomButton onClick={onDevRequestDialogClose}>閉じる</CustomButton>
          </DialogActions>
        </Dialog>
        <Snackbar
          open={clearStorageMessageVisible}
          autoHideDuration={2000}
          onClose={onClearStorageMessageClose}
          message="ローカルストレージを全て削除しました。"
        />
      </ThemeProvider>
    </div>
  );
};

export default Description;
