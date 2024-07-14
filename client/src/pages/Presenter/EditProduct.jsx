import React, { useEffect, useState } from 'react';
import ProductForm from '../../components/Presenter/ProductForm';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Loading from '../../components/shared/Loading';

function EditProduct() {
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
        <ProductForm product={product} method={'EDIT'} />
      ) : (
        <div className="h-96">
          <Loading />
        </div>
      )}
    </>
  );
}

export default EditProduct;
