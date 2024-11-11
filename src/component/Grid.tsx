import React from 'react';
import '../normalize.css';
import '../dist.css';
import {GridProps} from '../types';
import {DataGrid, GridRowsProp, GridColDef} from '@mui/x-data-grid';

const Grid: React.FC<GridProps> = ({result}) => {
  const rows: GridRowsProp = result.map((item, index) => ({
    id: index,
    ...item 
  }));
  const columns: GridColDef[] = [
    {
      field: 'np',
      headerName: 'ねむけパワー',
      flex: 6,
      minWidth: 110
    },
    {
      field: 'evForGrid',
      headerName: '出現期待値 ± 95%信頼区間',
      headerClassName: 'small-header',
      flex: 10,
      minWidth: 185
    },

    {
      field: 'leastOneForGrid',
      headerName: '1体以上出現確率',
      headerClassName: 'small-header',
      flex: 7,
      minWidth: 125
    }
  ];

  return (
    <div className="Grid">
      <DataGrid
        rows={rows}
        columns={columns}
        density="compact"
        initialState={{
          pagination: {paginationModel: {pageSize: 100}}
        }}
        pageSizeOptions={[100]}
        disableColumnMenu={true}
        rowSelection={false}
        sx={{
          marginTop: 2,
          fontFamily:
            "'M PLUS 1p','Roboto','Noto Sans JP', 'Helvetica Neue', 'Helvetica', 'Hiragino Sans', 'Arial', 'Yu Gothic', 'Meiryo', sans-serif",
          color: '#333',
          '& .small-header': {
            fontSize: '0.8rem'
          }
        }}
      />
    </div>
  );
};

export default Grid;
