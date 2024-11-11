import React, {useState} from 'react';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Link,
  Button
} from '@mui/material';
import '../normalize.css';
import '../dist.css';
import {styled} from '@mui/material/styles';
import MoreIcon from '@mui/icons-material/MoreVert';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import DescriptionIcon from '@mui/icons-material/Description';
import MenuBookIcon from '@mui/icons-material/MenuBook';

const theme = createTheme({
  typography: {
    fontFamily:
      "'M PLUS 1p','Roboto','Noto Sans JP', 'Helvetica Neue', 'Helvetica', 'Hiragino Sans', 'Arial', 'Yu Gothic', 'Meiryo', sans-serif",
    fontSize: 14
  }
});
const CustomDialogTitle = styled(DialogTitle)({
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#333'
});
const CustomDialogContentText = styled(DialogContentText)({
  color: '#333',
  '& h3': {
    fontWeight: 'bold',
    fontSize: '16px'
  },
  '& hr': {
    margin: '3px'
  }
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
    backgroundColor: 'inherit',
  }
});
const Description: React.FC = () => {
  const [moreMenuAnchor, setMoreMenuAnchor] = useState<HTMLElement | null>(null);
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
            参考元、謝辞
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
            <CustomDialogContentText>
              <p>
                ポケモン名、フィールド名、エナジーなどの条件を入力すると、1回のリサーチで目的のポケモンが何体出現するか、また1体以上出現する確率がどの程度かを計算し、計算結果を図表で表示します。
                <br />
                計算量が増えると処理時間が長くなり、負荷も高くなるため、設定条件は各自で調整してください。
              </p>
            </CustomDialogContentText>
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
            <CustomDialogContentText>
              <h3>必要ねむけパワー</h3>
              <hr />
              <p>
                　各ポケモンの寝顔には、その寝顔が出現するために必要なねむけパワーが定められている (例:
                ピチュー☆1の必要ねむけパワー=76000)。
                <br />
                　仕様変更に伴い、現在の新規の寝顔の必要ねむけパワーの特定は困難であり、実際のリサーチ結果から範囲を地道に絞り込む必要があるため、一部の寝顔の必要ねむけパワーは未確定となっている。
              </p>
              <br />
              <h3>寝顔抽選の流れ</h3>
              <hr />
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
              <h3>その他の条件</h3>
              <hr />
              <ul>
                <li>・出現しうるすべての寝顔は、等しい確率で抽選されるものとする。</li>
                <li>
                  ・ピッピ族・ライコウ・エンテイ・ニャオハ族・ホゲータ族・クワッス族・ウパー族は、80%の確率で最終枠抽選の対象から外れるものとする。
                </li>
                <li>
                  ・エンテイ、ライコウ、スイクンのような伝説のポケモンは1リサーチに1体までしか出現しないものとする。
                </li>
                <li>・一部ポケモンについて確定帯のズレが見られるが、この現象は考慮しないものとする。</li>
              </ul>
              <br />
              <p>
                　なお、一部ポケモンについての確定帯のズレなど、原理が未解明である仕様も存在するため、計算結果についてはあくまで参考程度にお願いいたします。
              </p>
            </CustomDialogContentText>
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
          <CustomDialogTitle>参考元、謝辞</CustomDialogTitle>
          <DialogContent dividers>
            <CustomDialogContentText>
              <p>
                　寝顔抽選の仕組みや必要ねむけパワーについて調査を行ってくださった先人の皆様に、心より感謝申し上げます。
              </p>
              <br />
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
                <li>
                  <Link
                    href="https://wikiwiki.jp/poke_sleep/%E7%9D%A1%E7%9C%A0%E3%83%AA%E3%82%B5%E3%83%BC%E3%83%81/%E3%81%AD%E3%82%80%E3%81%91%E3%83%91%E3%83%AF%E3%83%BC/%E5%AF%9D%E9%A1%94%E5%87%BA%E7%8F%BE%E3%81%AE%E6%B3%95%E5%89%87"
                    underline="hover"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ポケモンスリープwiki
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://note.com/cashunoe/all"
                    underline="hover"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    くますーん氏のnote記事
                  </Link>
                </li>
              </ul>
            </CustomDialogContentText>
          </DialogContent>
          <DialogActions>
            <CustomButton onClick={onReferenceDialogClose}>閉じる</CustomButton>
          </DialogActions>
        </Dialog>
      </ThemeProvider>
    </div>
  );
};

export default Description;
