import React, { useEffect, useState } from 'react';
import ReviewsSection from '../../components/e-commers/ReviewsSection';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Loading from '../../components/shared/Loading';
function AllReviews() {
  const { productId } = useParams('');
  const [totalRating, setTotalRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [isLoding, setisLoding] = useState(true);
  useEffect(() => {
    async function getProduct() {
      try {
        await axios.get(`/products/${productId}`).then((res) => {
          // console.log(res?.data?.product?.reviews);
          setReviews(res?.data?.product?.reviews);
          setTotalRating(res?.data?.product?.totalRating);
          setisLoding(false);
        });
      } catch (error) {
        console.log(error);
      }
    }
    getProduct();
  }, []);
  return (
    <>
      {isLoding ? (
        <div className="h-96">
          <Loading />
        </div>
      ) : (
        <main className="px-4">
          <ReviewsSection
            reviews={reviews}
            TotalProductRating={totalRating}
            setTotalRating={setTotalRating}
            setReviews={setReviews}
          />
        </main>
      )}
    </>
  );
}

export default AllReviews;
