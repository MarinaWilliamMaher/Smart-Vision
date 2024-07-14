import React, { useEffect, useState } from 'react';
import ProductForm from '../../components/Presenter/ProductForm';
import Loading from '../../components/shared/Loading';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function AddProduct() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getProduct(productId) {
      await axios
        .get(`/products/${productId}`)
        .then((res) => {
          setProduct(res?.data?.product);
          setIsLoading(false);
        })
        .catch((e) => {
          console.log(e);
        });
    }

    getProduct(productId);
  }, []);

  return (
    <>
      {!isLoading ? (
        <ProductForm product={product} method={'ADD'} />
      ) : (
        <div className="h-96">
          <Loading />
        </div>
      )}
    </>
  );
}

export default AddProduct;
