"use client";

import PageLayout from '@/components/PageLayout';
import ProductGrid from '@/components/ProductGrid';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import Loading from '@/components/Loading';

const fakeProducts = [
  { name: 'Mini portobello', code: 1234, retailer: 12, expiryDate: '2024/01/19'},
  // { name: 'Baby button', code: 6543, retailer: 'Dubbes', expiryDate: '2024/01/20', imageUrl: '../../../../utils/images/babyButton.jpeg' },
  // { name: 'White button', code: 9876, retailer: 'Tesco', expiryDate: '2024/01/21', imageUrl: '../../../../utils/images/button.jpeg' },
  // { name: 'Baby button', code: 6544, retailer: 'Dubbes', expiryDate: '2024/01/20', imageUrl: '../../../../utils/images/babyButton.jpeg' },

];

type ProductDetails = {
  productId: number;
  productCode: number;
  productName: string;
  productWeight: number;
  productCustomerID: number;
  productExpiryDate: string;
  productUrl: string;
};

const Page = () => {
  useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); 

    return () => clearTimeout(timer);
  }, []);

  const [loading, setLoading] = useState(true);

  const [products, setProducts] = useState<ProductDetails[]>([]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/products");
        const products = response.data;
        setProducts(products);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductDetails();
  }, []);
  

  // const [isFormVisible, setIsFormVisible] = useState(false);

  // const handleAddProduct = () => {
  //   setIsFormVisible(true);
  // };

  
  if (loading) {
    return(
      <Loading />
    );
  }
  else{
    return (
      <PageLayout >
      <div className='pl-8 pt-10 w-full'>
        <h2 className='text-2xl font-bold mb-10'>Products Managment</h2>
        <ProductGrid products={products.map((product) => ({ productId: product.productId,productName: product.productName, productCode: product.productCode,productWeight:product.productWeight, productCustomerID: product.productCustomerID, productExpiryDate: product.productExpiryDate, productUrl: product.productUrl }))} />
      </div>
      </PageLayout >
    );
  }
};

export default Page;