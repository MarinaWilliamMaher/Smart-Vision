import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { apiRequest, handleMultipleFilesUpload } from "../../utils";
import toast, { Toaster } from "react-hot-toast";
import { TextField, Button, Grid, Typography } from "@mui/material";

function EditProductForm() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [images, setImages] = useState([{}]);
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    description: "",
    category: "",
    price: "",
    points: "",
    _id: productId,
    images: [{}],
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/products/${productId}`);
        console.log("Product:", response.data.product);
        setProduct(response.data.product);
        setFormData({
          name: response.data.product.name,
          quantity: response.data.product.quantity,
          description: response.data.product.description,
          category: response.data.product.category,
          price: response.data.product.price,
          points: response.data.product.points,
          show: false,
          _id: productId,
          images: [{}],
        });
        setImages([{}]);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error.response.data.message);
      }
    };

    fetchProduct();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(images);

      const uploadedImages =
        images && (await handleMultipleFilesUpload(images));
      console.log("Uploaded Images:", uploadedImages);
      const updatedImages =
        uploadedImages.length > 0 ? uploadedImages : product.images;
      console.log(updatedImages);
      // const response = await axios.post(`/products/add-to-store/`, {
      //   ...formData,
      //   images: updatedImages,
      //   show: true,
      // });
      const response = await apiRequest({
        method: "POST",
        url: `/products/add-to-store/`,
        data: {
          ...formData,
          images: updatedImages,
          show: true,
        },
      });
      setFormData({
        name: "",
        quantity: "",
        description: "",
        category: "",
        price: "",
        points: "",
        _id: productId,
        images: [{}],
      });
      toast.dismiss();
      toast.success(response.data.message);
      console.log("Updated product:", response.data.product);
    } catch (error) {
      console.error("Error updating product:", error.response.data.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="ProductForm"
      style={{ maxWidth: "750px", margin: "auto", padding: "0px" }}
    >
      <Toaster
        toastOptions={{
          style: {
            duration: 3000,
            border: "1px solid #6A5ACD",
            backgroundColor: "#6A5ACD",
            padding: "16px",
            color: "white",
            fontWeight: "Bold",
            marginTop: "65px",
            textAlign: "center",
          },
        }}
      />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4">Add Product To Store</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="name"
            label="Product Name"
            value={formData.name}
            onChange={handleInputChange}
            fullWidth
            required
            sx={{ marginBottom: "10px" }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="quantity"
            label="Quantity"
            type="number"
            fullWidth
            value={formData.quantity}
            onChange={handleInputChange}
            required
            sx={{ marginBottom: "10px" }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="description"
            label="Description"
            multiline
            rows={4}
            value={formData.description}
            onChange={handleInputChange}
            fullWidth
            required
            sx={{ marginBottom: "10px" }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="category"
            label="Category"
            value={formData.category}
            onChange={handleInputChange}
            fullWidth
            required
            sx={{ marginBottom: "10px" }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="price"
            label="Price"
            type="number"
            value={formData.price}
            onChange={handleInputChange}
            fullWidth
            required
            sx={{ marginBottom: "10px" }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="points"
            label="Points"
            type="number"
            value={formData.points}
            onChange={handleInputChange}
            fullWidth
            required
            sx={{ marginBottom: "20px" }}
          />
        </Grid>
        {/* <Grid item xs={12}> */}
        <Grid item xs={12} container>
          <input
            type="file"
            id="images"
            name="images"
            style={{ marginRight: "20px" }}
            className="uploadBtn file:hidden text-gray-700 bg-gray-300 w-1/4"
            onChange={(e) => {
              setImages(e.target.files);
            }}
            multiple
          />
          <label
            htmlFor="image"
            className="leading-7 text-sm text-gray-600 mt-1"
          >
            {product?.show ? "Update Product Image" : "Add Product Image"}
          </label>
        </Grid>
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{
              height: 44,
              padding: "0px 15px",
              borderRadius: "5px",
            }}
          >
            {product?.show ? "Update Product" : "Add To Store"}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}

export default EditProductForm;
