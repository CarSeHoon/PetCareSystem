import React, { useState } from "react";
import Tables from 'react-bootstrap/Table';

export default function Table({ data, header, onClick }) {
  return (
    <Tables striped="columns">
      <thead>
        <tr className="tr-style">
          {header.map((item, index) => {
            return (
              <th className="th-style" key={index}>
                {item}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => {
          return (
            <tr key={index} className="tr-hover" onClick={() => onClick(item)}>
              <td>{item.care_request_number}</td>
              <td>{item.care_request_title}</td>
              <td>{item.care_request_insert_datetime}</td>
              <td>{item.care_request_insert_user_id}</td>
            </tr>
          );
        })}
      </tbody>
    </Tables>
  );
}
