import React from "react";

export default function SellItem(props) {
  return (
    <div className='sell-item-container'>
      <h4>Sell Item(s)</h4>
      <table className='table'>
        <thead>
        <tr>
          <td/>
          <th>Money</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <th>Money</th>
          <td>{props.money}g</td>
        </tr>
        <tr>
          <th>Total Selling</th>
          <td>{props.totalSellItem}g</td>
        </tr>
        <tr>
          <th>Total</th>
          <td>{Number(props.money) + Number(props.totalSellItem)}g</td>
        </tr>
        </tbody>
      </table>
    </div>
  );
}