import {
  useParams
} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import React, {
  useEffect,
  useState,
  useContext
} from 'react';
import {
  Store
} from '../Store';
import {
  Helmet
} from 'react-helmet-async';

function Product(props) {
  const {
    product
  } = props;
  const {
    state,
    dispatch: ctxDispatch
  } = useContext(Store);
  const {
    cart: {
      cartItems
    },
  } = state;


  const addToCartHandler = async (item) => {
    const quantity = parseInt(input); // 从input中获取商品数量
    if (isNaN(quantity) || quantity < 1) {
      window.alert('請輸入有效的數量');
      return;
    }

    const existItem = cartItems.find((x) => x._id === item._id);
    const productInStock = data.countInStock;

    if (existItem) {
      const totalQuantity = existItem.quantity + quantity;
      if (totalQuantity > productInStock) {
        window.alert('抱歉,庫存不足');
      } else {
        ctxDispatch({
          type: 'CART_ADD_ITEM',
          payload: {
            ...item,
            quantity: totalQuantity
          },
        });
      }
    } else {
      if (quantity > productInStock) {
        window.alert('抱歉,庫存不足');
      } else {
        ctxDispatch({
          type: 'CART_ADD_ITEM',
          payload: {
            ...item,
            quantity
          },
        });
      }
    }
  };
  // const addToCartHandler = async (item) => {
  //   const quantity = parseInt(input); // 從input中獲取商品數量
  //   if (isNaN(quantity) || quantity < 1) {
  //     window.alert('請輸入有效的商品數量');
  //     return;
  //   }

  //   const existItem = cartItems.find((x) => x._id === item._id);

  //   if (existItem) {
  //     if (existItem.quantity + quantity > max) {
  //       window.alert('抱歉，庫存不足');
  //     } else {
  //       ctxDispatch({
  //         type: 'CART_ADD_ITEM',
  //         payload: { ...item, quantity: existItem.quantity + quantity },
  //       });
  //     }
  //   } else {
  //     if (quantity > max) {
  //       window.alert('抱歉，庫存不足');
  //     } else {
  //       ctxDispatch({
  //         type: 'CART_ADD_ITEM',
  //         payload: { ...item, quantity },
  //       });
  //     }
  //   }
  // };


  const {
    _id
  } = useParams();
  const [data, setData] = useState(null); // 修改为 null

  useEffect(() => {
    async function fetchProduct() {
      // 修改函数名
      try {
        let response = await axios.get(
          //這裡的5000是後端的port number
          `http://localhost:10000/api/products/${_id}`
        );
        setData(response.data); // 将数据保存到data中
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    }

    fetchProduct();
  }, [_id]);

  const [input, setInput] = useState('1');
  const min = 1;
  const max = 20;

  const minus = () => {
    if (input > min) {
      setInput(parseInt(input) - 1);
    }
  };

  const plus = () => {
    if (input < max) {
      setInput(parseInt(input) + 1);
    }
  };

  return ( <
    >
    {
      data && ( // 添加条件渲染以确保data已加载
        <
        div key = {
          data._id
        }
        className = "container" >
        <
        div className = "row text-center mt-5 fs-1 fw-bold text-secondary" >
        <
        span className = "mb-3" > {
          data.category
        } < /span> <
        div className = "border-top" > & nbsp; < /div> < /
        div > <
        div className = "row" > {
          /* 待調整 css*/
        } <
        div className = "col-sm-12 col-md-6 " >
        <
        img alt = "產品圖片"
        src = {
          data.image
        }
        className = "img-fluid object-fit-contain"
        style = {
          {
            width: '100vw',
            height: '50vh'
          }
        }
        /> {
        /* 待調整 css*/
      } <
      /div> <
      div className = "col-sm-12 col-md-6 p-5"
      style = {
        {
          borderRadius: '0% 30% 30% 0%',
          backgroundColor: 'rgba(230, 100, 101, 0.2)',
        }
      } >
      <
      Helmet >
      <
      title > {
        data.name
      } < /title> < /
      Helmet > <
      h1 > {
        data.name
      } < /h1> {
      /* 待調整 css*/
    } <
    p className = "fs-5 fw-bold text-danger" > 庫存： {
      data.countInStock
    } < /p> <
    p className = "fs-3 fw-bold " > $ {
      data.price
    } < /p> <
    p className = "mt-5 fs-5" > {
      data.description
    } < /p> <
    button onClick = {
      minus
    }
    className = "btn btn-warning fw-bolder rounded-circle fs-3"
    style = {
      {
        width: '3rem',
        height: '3rem',
        lineHeight: '1rem'
      }
    } > {
      /* 待調整 css*/
    } <
    /button> <
    input className = "fw-bolder fs-3 m-1 text-center input-number"
    value = {
      input
    }
    readOnly min = {
      min
    }
    max = {
      max
    }
    style = {
      {
        width: '4rem'
      }
    }
    /> <
    button onClick = {
      plus
    }
    className = "btn btn-warning fw-bolder rounded-circle fs-3"
    style = {
      {
        width: '3rem',
        height: '3rem',
        lineHeight: '1rem'
      }
    } >
    +
    <
    /button> <
    div className = "col-6" >
    <
    button onClick = {
      () => addToCartHandler(data)
    } // 传递data作为参数
    type = "button"
    className = "btn btn-danger fs-5 mt-5" >
    加入購物車 <
    /button> < /
    div > <
    /div> < /
    div > <
    /div>
  )
} <
/>
);
}

export default Product;