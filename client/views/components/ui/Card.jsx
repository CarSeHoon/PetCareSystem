import React from 'react'
import { Link } from 'react-router-dom'

export default function Card({ data, onClick }) {
  return (
    <div className="product_container">
        {data.map((item, index) => {
          console.log(item.img_url);
          var img_src = "../"+item.img_url;
        return (
            <div className="product" >
              <p className="product_des">{item.care_request_title}</p>
                <div className="product_img_div" key={index} onClick={() => onClick(item)}><img src={img_src} className="product_img"/></div>
                <div className="product_mon">{item.care_request_insert_user_id}</div>
                <div id="gd">매칭완료</div>
            </div>);
            })}
      </div>
  )
}
  