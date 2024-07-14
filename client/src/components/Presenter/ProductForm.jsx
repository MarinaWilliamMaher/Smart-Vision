import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import InputColor from "../../components/Presenter/InputColor";
import { Alert, Snackbar } from "@mui/material";
import {
  apiRequest,
  handleMultipleFilesUpload,
  setOptionsForTranslate,
} from "../../utils";
import Loading from "../../components/shared/Loading";
import "./StyleSheets/ProductForm.css";
import { t } from "i18next";
import axios from "axios";

function ProductForm({ product, method }) {
  const language = JSON.parse(window?.localStorage.getItem("language"));
  const navigate = useNavigate();
  const { employee } = useSelector((state) => state?.employee);
  const [description, setDescription] = useState(
    language === "en" ? product?.description : product?.ARDescription || ""
  );
  const [images, setImages] = useState(product?.images || "");
  const [newImages, setNewImages] = useState([]);
  const [productName, setProductName] = useState(
    language === "en" ? product?.name : product?.ARName || ""
  );
  const [category, setCategory] = useState(product?.category || "");
  const [colors, setColors] = useState(product?.colors);
  const [price, setPrice] = useState(product?.price || "");
  const [points, setPoints] = useState(product?.points || "");
  const [show, setShow] = useState(product?.show);
  const [numberOfImages, setNumberOfImages] = useState(product?.images?.length);
  const [validated, setValidated] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [width, setwidth] = useState(product?.dimensions?.width || "");
  const [weight, setweight] = useState(product?.dimensions?.weight || "");
  const [height, setheight] = useState(product?.dimensions?.height || "");
  async function translateText() {
    try {
      const response = await axios.request(
        setOptionsForTranslate([productName, description])
      );
      // console.log(response.data);
      return response?.data;
    } catch (error) {
      console.error(error);
    }
  }

  const handleOpenSnackbar = () => {
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  async function addProduct(imagesUrl) {
    try {
      const translationRes = await translateText();
      const ARname = translationRes[0].translations[0].text;
      const ENname = translationRes[0].translations[1].text;
      const ARdescription = translationRes[1].translations[0].text;
      const ENdescription = translationRes[1].translations[1].text;
      const res = await apiRequest({
        method: "POST",
        url: `/employees/presenter/add-to-store/`,
        data: {
          _id: product._id,
          name: ENname,
          ARName: ARname,
          description: ENdescription,
          ARDescription: ARdescription,
          images: [...images, ...imagesUrl],
          category,
          price,
          points,
          colors,
          show,
          dimensions: {
            width,
            weight,
            height,
          },
        },
        token: employee?.token,
      });
      //console.log(res);
      if (res?.data?.success === true) {
        // console.log(res);
        navigate("/presenter/home");
      } else {
        console.log(res.message);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function editProduct(imagesUrl) {
    try {
      const translationRes = await translateText();
      //console.log(translationRes);
      const ARname = translationRes[0].translations[0].text;
      const ENname = translationRes[0].translations[1].text;
      const ARdescription = translationRes[1].translations[0].text;
      const ENdescription = translationRes[1].translations[1].text;
      console.log(ARname, ENname, ARdescription, ENdescription);
      const res = await apiRequest({
        url: `/products/${product?._id}`,
        method: "PUT",
        data: {
          name: ENname,
          ARName: ARname,
          description: ENdescription,
          ARDescription: ARdescription,
          images: [...images, ...imagesUrl],
          category,
          price,
          points,
          colors,
          show,
          dimensions: {
            width,
            weight,
            height,
          },
        },
        token: employee?.token,
      });
      if (res?.data?.success) {
        // console.log(res.data);
        navigate("/presenter/home");
      } else {
        //console.log(res?.message);
        isLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function getNewImagesFiles() {
    let files = [];
    newImages.map((item) => {
      files.push(item.file[0]);
    });
    return files;
  }

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (numberOfImages === 0 || colors?.length === 0) {
      handleOpenSnackbar();
    } else if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
    } else {
      //setIsLoading(true);
      const files = getNewImagesFiles();
      const imagesUrl = newImages?.length
        ? await handleMultipleFilesUpload(files)
        : [];
      method === "EDIT" ? editProduct(imagesUrl) : addProduct(imagesUrl);
    }
  };

  function handleDeleteImage(removeImage) {
    setImages((prevImages) => {
      return prevImages.filter((image) => image !== removeImage);
    });
    setNumberOfImages(numberOfImages - 1);
  }

  function handleDeleteNewImage(removeImage) {
    setNewImages((prevImages) => {
      return prevImages.filter((image) => image.imgUrl !== removeImage.imgUrl);
    });
    setNumberOfImages(numberOfImages - 1);
  }

  async function conver2base64(e) {
    const files = e.target.files;
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewImages((prev) => {
        return [
          ...prev,
          { imgUrl: reader.result.toString(), file: [...files] },
        ];
      });
    };
    reader.readAsDataURL(files[0]);
    setNumberOfImages(numberOfImages + 1);
  }

  return (
    <>
      {!isLoading ? (
        <main className="editProductMain">
          <h1>{method === "EDIT" ? t("edit") : t("add")}</h1>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <div className="editProductFormMainDiv">
              {/* for images */}
              <Form.Group className="InputGroup editProductFormImages">
                <Form.Label className="FormLabel">{t("images")}</Form.Label>
                <div
                  className={
                    images?.length || newImages?.length
                      ? "editProductFromImagesDiv"
                      : "editProductFromImagesDiv h-60"
                  }
                >
                  {images?.map((image, idx) => {
                    return (
                      <div
                        key={idx}
                        className="editProductFormImageDiv"
                        onClick={() => handleDeleteImage(image)}
                      >
                        <div className="editProductFormDeleteImage">
                          <DeleteForeverIcon
                            sx={{
                              fontSize: "45px",
                            }}
                          />
                        </div>
                        <img className="editProductFromImage" src={image} />
                      </div>
                    );
                  })}
                  {newImages?.map((image, idx) => {
                    return (
                      <div
                        key={idx}
                        className="editProductFormImageDiv"
                        onClick={() => handleDeleteNewImage(image)}
                      >
                        <div className="editProductFormDeleteImage">
                          <DeleteForeverIcon
                            sx={{
                              fontSize: "45px",
                            }}
                          />
                        </div>
                        <img
                          className="editProductFromImage"
                          src={image.imgUrl}
                        />
                      </div>
                    );
                  })}
                </div>
              </Form.Group>
              <div className="editProductFormAllData">
                {/* for product Name */}
                <Form.Group className="InputGroup">
                  <Form.Label htmlFor="productName" className="FormLabel">
                    {t("productName")}
                  </Form.Label>
                  <Form.Control
                    required
                    className="InputField"
                    name="productName"
                    id="productName"
                    type="text"
                    placeholder="Product Name"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                  />
                </Form.Group>
                {/* for Description */}
                <Form.Group className="InputGroup">
                  <Form.Label
                    htmlFor="productDescription"
                    className="FormLabel"
                  >
                    {t("description")}
                  </Form.Label>
                  <Form.Control
                    required
                    className="InputField h-auto"
                    name="productDescription"
                    id="productDescription"
                    type="text"
                    as="textarea"
                    rows={5}
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Form.Group>
                <div className="editProductCategoryAndPriceDiv">
                  <Form.Group className="InputGroup suEditProductCategoryAndPriceDiv ">
                    <Form.Label className="FormLabel" htmlFor="height">
                      {t("height")}
                    </Form.Label>
                    <Form.Control
                      required
                      className="InputField"
                      name="height"
                      id="height"
                      type="number"
                      placeholder={t("height")}
                      min={0}
                      value={height}
                      onChange={(e) => setheight(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="InputGroup suEditProductCategoryAndPriceDiv">
                    <Form.Label htmlFor="width" className="FormLabel">
                      {t("width")}
                    </Form.Label>
                    <Form.Control
                      required
                      className="InputField"
                      name="width"
                      id="width"
                      type="number"
                      placeholder={t("width")}
                      min={0}
                      value={width}
                      onChange={(e) => setwidth(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="InputGroup suEditProductCategoryAndPriceDiv ">
                    <Form.Label className="FormLabel" htmlFor="weight">
                      {t("weight")}
                    </Form.Label>
                    <Form.Control
                      required
                      className="InputField"
                      name="weight"
                      id="weight"
                      type="number"
                      placeholder={t("weight")}
                      min={0}
                      value={weight}
                      onChange={(e) => setweight(e.target.value)}
                    />
                  </Form.Group>
                </div>
                <div className="editProductCategoryAndPriceDiv">
                  {/*for category */}
                  <Form.Group className="InputGroup suEditProductCategoryAndPriceDiv ">
                    <Form.Label className="FormLabel" htmlFor="productCategory">
                      {t("Category")}
                    </Form.Label>
                    <Form.Select
                      required
                      className="InputField"
                      name="productCategory"
                      id="productCategory"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="">{t("ChooseOption")}</option>
                      <option value="sofa">{t("sofa")}</option>
                      <option value="bed">{t("bed")}</option>
                      <option value="chair">{t("chair")}</option>
                      <option value="table">{t("table")}</option>
                    </Form.Select>
                  </Form.Group>
                  {/* for Price */}
                  <Form.Group className="InputGroup suEditProductCategoryAndPriceDiv">
                    <Form.Label htmlFor="productPrice" className="FormLabel">
                      {t("Price")}
                    </Form.Label>
                    <Form.Control
                      required
                      className="InputField"
                      name="productPrice"
                      id="productPrice"
                      type="number"
                      placeholder="Price"
                      min={0}
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </Form.Group>
                </div>
                {/* for colors */}
                <Form.Group className="InputGroup ">
                  <Form.Label className="FormLabel">{t("Color")}</Form.Label>
                  <InputColor colors={colors} setColors={setColors} />
                </Form.Group>
                {/* for points */}
                <Form.Group className="InputGroup ">
                  <Form.Label htmlFor="productPoints" className="FormLabel">
                    {t("points")}
                  </Form.Label>
                  <Form.Control
                    required
                    className="InputField"
                    name="productPoints"
                    id="productPoints"
                    type="number"
                    placeholder="Points"
                    min={0}
                    value={points}
                    onChange={(e) => setPoints(e.target.value)}
                  />
                </Form.Group>
                {/* for upload picture */}
                {numberOfImages < 4 ? (
                  <Form.Group className="InputGroup flex flex-wrap justify-items-center gap-2 items-center">
                    <input
                      type="file"
                      id="uploadFile"
                      name="uploadFile"
                      className="uploadBtn hidden text-gray-700 bg-gray-300 w-1/4"
                      onChange={(e) => conver2base64(e)}
                    />
                    <label
                      htmlFor="uploadFile"
                      className="uploadBtn text-gray-700 bg-gray-300 cursor-pointer"
                    >
                      {t("uploadPicture")}
                    </label>
                    <p>{t("maximum4Pictures")}</p>
                  </Form.Group>
                ) : (
                  <></>
                )}
                {/* for show */}
                <Form.Group className="InputGroup flex items-center">
                  <Form.Label htmlFor="productShow" className="FormLabel mx-4">
                    {t("show")}
                  </Form.Label>
                  <input
                    type="checkbox"
                    className="w-6 h-6"
                    name="productShow"
                    id="productShow"
                    value={show}
                    checked={show}
                    onChange={() => {
                      setShow(!show);
                    }}
                  />
                </Form.Group>
              </div>
            </div>
            <div className="flex justify-between flex-row-reverse">
              <button
                type="submit"
                className="text-2xl bg-slate-700 hover:bg-slate-800 text-white font-bold py-2 px-4 rounded-xl mb-4 h-16"
              >
                {t("save")}
              </button>
              <button
                className="text-2xl bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded-xl mb-4 h-16"
                onClick={(e) => {
                  e.preventDefault();
                  history.back();
                }}
              >
                {t("cancel")}
              </button>
            </div>
          </Form>
        </main>
      ) : (
        <div className="h-96">
          <Loading />
        </div>
      )}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {t("includeAtLeastOneColorAndImage")}
        </Alert>
      </Snackbar>
    </>
  );
}

export default ProductForm;
