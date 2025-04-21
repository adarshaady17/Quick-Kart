import React from 'react'


//input field component
const inputField=(()=>(
    <input type="text"/>
))
const AddAddress = () => {
  return (
    <div>
        <p className='text-2xl md:text-3xl text-gray-500'>Add Shipping <span className='font-semibold text-indigo-500'>Address</span></p>
    </div>
  )
}

export default AddAddress