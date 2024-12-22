import React from 'react';
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
      headerClassName: 'small-header',
      flex: 130,
      minWidth: 130
    },
    {
      field: 'evForGrid',
      headerName: '出現期待値 ± 95%信頼区間',
      renderHeader: () => (
        <div>
          出現期待値 <br />
          <p className="text-[11px]">± 95%信頼区間</p>
        </div>
      ),
      headerClassName: 'small-header',
      flex: 150,
      minWidth: 150,
      sortingOrder: ['desc', null]
    },
    {
      field: 'leastOne',
      headerName: '1体以上出現確率',
      renderHeader: () => (
        <div>
          1体以上 <br />
          出現確率
        </div>
      ),
      headerClassName: 'small-header',
      flex: 110,
      minWidth: 110,
      sortingOrder: ['desc', null]
    },
    {
      field: 'expCandy',
      headerName: 'アメの個数',
      headerClassName: 'small-header',
      flex: 115,
      minWidth: 115,
      sortingOrder: ['desc', null]
    },
    {
      field: 'dreamShard',
      headerName: 'ゆめのかけら',
      headerClassName: 'small-header',
      flex: 130,
      minWidth: 130,
      sortingOrder: ['desc', null]
    },
    {
      field: 'researchExp',
      headerName: 'リサーチEXP',
      headerClassName: 'small-header',
      flex: 130,
      minWidth: 130,
      sortingOrder: ['desc', null]
    }
  ];

  return (
    <div className="Grid">
      <DataGrid
        rows={rows}
        columns={columns}
        density="compact"
        rowHeight={42}
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
