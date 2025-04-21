import React from 'react'
import MainBanner from '../components/MainBanner'
import Categories from '../components/Categories'
//import ProductCart from '../components/ProductCart.jsx'
import { useAppContext } from '../context/AppContext'
import NewsLetter from '../components/NewsLetter.jsx'
const Home = () => {
  //const {products}=useAppContext();
  return (
    <div>
    <MainBanner/>
    <Categories/>
    {/* <ProductCart product={products[0]}/> */}
    <NewsLetter/>
    </div>
  )
}

export default Home