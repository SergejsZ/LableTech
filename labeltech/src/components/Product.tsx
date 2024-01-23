"use client";

import React from 'react'
import { useState } from 'react'
import axios from 'axios';

const Product = ({ productName, productCode, productWeight,  productCustomerID, productExpiryDate, ProductImage }: { productName: string, productCode: number,productWeight:number, productCustomerID: number, productExpiryDate: string, ProductImage:string }) => {

  return (
    <div>
      <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white">
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">{productName}</div>
          <p className="text-gray-700 text-base">
            Product code: <span className='font-bold'>{productCode}</span>
          </p>
        </div>
        <div>
            <div className="px-6">
              <p className="text-gray-700 text-base">
                Product weight: <span className='font-bold'>{productWeight} </span>grams 
              </p>
            </div>

        </div>
        {/* <div className="flex justify-center">
          <img src={ProductImage} alt={ProductImage} className="w-64 h-64" />
        </div> */}
        <div className="px-6 pt-4 pb-2">
          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">Customer: {productCustomerID}</span>
          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mb-2">Expiry: {productExpiryDate}</span>
        </div>
      </div> 
    </div>
  )
}

export default Product
