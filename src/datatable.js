import DataTable from 'react-data-table-component';
import React from "react";

const columns = [
  {
    name: 'Item Name',
    selector: 'DisplayName',
    sortable: true,
    cell: (row, index) => <div>
      <span>{row.DisplayName}</span>
      {row.image !== '' && <img src={row.image} alt={index}/>}
    </div>,
  },
  {
    name: 'Qty',
    selector: 'stack',
    sortable: true,
  },
  {
    name: 'Price',
    selector: 'price',
    sortable: true,
    format: row => `${row.price}g`
  },
  {
    name: 'Sub Total',
    selector: 'subTotal',
    sortable: true,
    format: row => `${row.subTotal}g`
  },
];

export default function Datatable(props) {
  return (
    <DataTable
      title="All Items (from chest)"
      columns={columns}
      data={props.data}
      pagination={true}
      selectableRows={true}
      onSelectedRowsChange={props.onSelect}
    />
  )
};