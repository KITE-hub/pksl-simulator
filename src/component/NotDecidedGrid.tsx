import React from 'react';
import {iNotDecided} from '../types';
import {DataGrid, GridRowsProp, GridColDef} from '@mui/x-data-grid';
import notDecided from '../db/other/notDecided.json';

const notDecidedList: iNotDecided[] = notDecided;

const NotDecidedGrid: React.FC = () => {
  const rows: GridRowsProp = notDecidedList.map((item, index) => ({
    id: index,
    ...item
  }));
  const columns: GridColDef[] = [
    {
      field: 'pokemonName',
      headerName: 'ポケモン名',
      headerClassName: 'small-header',
      flex: 105,
      minWidth: 105
    },
    {
      field: 'np',
      headerName: '必要ねむけパワー(推定)',
      headerClassName: 'small-header',
      renderHeader: () => (
        <div>
          必要ねむけパワー <br />
          <p className="text-[11px]">(推定)</p>
        </div>
      ),
      flex: 115,
      minWidth: 115,
      renderCell: (params) => {
        return <div>{params.value.toLocaleString()}</div>;
      }
    },
    {
      field: 'rarity',
      headerName: 'レア度',
      headerClassName: 'small-header',
      flex: 70,
      minWidth: 70,
      renderCell: (params) => {
        return <div>☆{params.value}</div>;
      }
    },
    {
      field: 'sleepFaceName',
      headerName: '寝顔名',
      headerClassName: 'small-header',
      flex: 120,
      minWidth: 135
    }
  ];

  return (
    <div className="NotDecidedGrid">
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
            // eslint-disable-next-line
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

export default NotDecidedGrid;
