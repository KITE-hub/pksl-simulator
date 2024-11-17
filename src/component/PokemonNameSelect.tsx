import React, {useState} from 'react';
import pokemonInfo from '../db/pokemonInfo.json';
import {PokemonNameSelectProps, iPokemonInfo} from '../types';
import {styled, createTheme, ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';

const toKatakana = (str: string): string => {
  return str.replace(/[\u3041-\u3096]/g, (char) => String.fromCharCode(char.charCodeAt(0) + 0x60));
};
const normalizeString = (str: string | undefined | null): string => {
  if (!str) return '';
  return toKatakana(
    str.toLocaleLowerCase().normalize('NFKC') // 小文字化＆正規化
  );
};

// グローバルフォントファミリーの設定
const theme = createTheme({
  typography: {
    fontFamily:
      "'M PLUS 1p','Roboto','Noto Sans JP', 'Helvetica Neue', 'Helvetica', 'Hiragino Sans', 'Arial', 'Yu Gothic', 'Meiryo', sans-serif"
  },
  palette: {
    text: {
      primary: '#333'
    }
  }
});

const StyledAutocomplete = styled(Autocomplete<iPokemonInfo>)(() => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'white',
    height: '36px',
    width: '180px',
    padding: '0px 0px 0px 10px',
    borderRadius: '8px',
    boxShadow: '0px 2px 0px 0px rgba(0, 0, 0, .1)',
    '& .MuiInputBase-input': {
      padding: '0px' // 内側のpaddingを調整
    },
    '& fieldset': {
      borderColor: '#25d76b'
    },
    '&:hover fieldset': {
      borderColor: '#25d76b'
    },
    '&.Mui-focused fieldset': {
      borderColor: '#25d76b',
      borderWeight: '1px'
    }
  },
  '& + .MuiAutocomplete-popper': {
    '& .MuiAutocomplete-option': {
      backgroundColor: 'white' // 通常の背景色
    },
    "& .MuiAutocomplete-option[aria-selected='true']": {
      backgroundColor: 'hsl(143, 70%, 98%)' // 選択中の背景色
    },
    '& .MuiAutocomplete-option.Mui-focused': {
      backgroundColor: 'hsl(143, 70%, 95%)' // フォーカス時の背景色
    },
    "& .MuiAutocomplete-option[aria-selected='true'].Mui-focused": {
      backgroundColor: 'hsl(143, 70%, 95%)' // フォーカス時の背景色
    }
  }
}));

const StyledTextField = styled(TextField)({
  '& .MuiInputBase-input': {
    fontSize: '16px',
    fontWeight: 'bold' // フォントウェイト
  },
  '& .MuiInputLabel-root': {
    fontSize: '16px',
    fontWeight: 'normal' // フォントウェイト
  }
});

const StyledPaper = styled(Paper)(({theme}) => ({
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: 'none',
  border: '1px solid #25d76b'
}));

const StyledListbox = styled('ul')(({theme}) => ({
  padding: 0
}));

const PokemonNameSelect: React.FC<PokemonNameSelectProps> = ({pokemonName, handlePokemonName1, handlePokemonName2}) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <StyledAutocomplete
        disablePortal
        options={pokemonInfo}
        getOptionLabel={(option: iPokemonInfo) => option.pokemonName}
        filterOptions={(options, state) => {
          const inputValue = normalizeString(state.inputValue); // 入力値を正規化
          return options.filter(
            (option) => normalizeString(option.pokemonName).includes(inputValue) // 名前で一致を判定
          );
        }}
        PaperComponent={(props) => <StyledPaper {...props} />}
        ListboxComponent={StyledListbox}
        renderInput={(params) => <StyledTextField {...params} variant="outlined" onChange={handlePokemonName1} />}
        inputValue={pokemonName}
        onInputChange={handlePokemonName2}
      />
    </ThemeProvider>
  );
};

export default PokemonNameSelect;
