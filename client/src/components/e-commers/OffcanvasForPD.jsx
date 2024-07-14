import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import Offcanvas from "react-bootstrap/Offcanvas";
import "bootstrap/dist/css/bootstrap.min.css";
import "./StyleSheets/OffcanvasForPD.css";
import Form from "react-bootstrap/Form";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { SetCustomer } from "../../redux/CustomerSlice";
import { apiRequest } from "../../utils";
import { useTranslation } from "react-i18next";
import i18n from "i18next";

function OffcanvasForPD({ ...props }) {
  const dispatch = useDispatch();
  const { customer } = useSelector((state) => state.customer);
  const [show, setShow] = useState(false);
  const [username, setUserName] = useState(customer?.username);
  const [gender, setGender] = useState(customer?.gender);
  const [address, setAddress] = useState(
    customer?.address ? customer?.address : ""
  );
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [validated, setValidated] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
    } else {
      await apiRequest({
        url: "/customers/",
        method: "PUT",
        data: {
          customerId: customer?._id,
          username,
          gender,
          address,
        },
        token: customer?.token,
      })
        .then((res) => {
          const newData = {
            token: localStorage.getItem("token"),
            ...res.data?.customer,
          };
          dispatch(SetCustomer(newData));
          handleClose();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <>
      <Button
        className="flex justify-around"
        variant="outline-secondary"
        onClick={handleShow}
      >
        <p className="inline text-2xl">{t("Edit")}</p>
        <EditIcon className="ml-2" />
      </Button>
      <Offcanvas show={show} onHide={handleClose} {...props}>
        <Offcanvas.Header>
          <Offcanvas.Title className="text-2xl">
            {t("Edit profile")}
          </Offcanvas.Title>
          <button className="me-2" onClick={handleClose}>
            <CloseIcon sx={{ fontSize: 30 }} />
          </button>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="InputGroup">
              <Form.Label className="FormLabel">{t("User Name")}</Form.Label>
              <Form.Control
                className="InputField"
                required
                type="text"
                value={username}
                placeholder="User Name"
                onChange={(e) => setUserName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="InputGroup">
              <Form.Label className="FormLabel" htmlFor="disabledSelect">
                {t("Gender")}
              </Form.Label>
              <Form.Select
                className="InputField"
                id="disabledSelect"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="" disabled>
                  {t("Choose an option")}
                </option>
                <option value="Male">{t("Male")}</option>
                <option value="Female">{t("Female")}</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="InputGroup">
              <Form.Label className="FormLabel">{t("Address")}</Form.Label>
              <Form.Control
                className="InputField"
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </Form.Group>
            <div className="flex justify-center">
              <button
                type="submit"
                className="text-2xl bg-slate-700 hover:bg-slate-800 text-white font-bold py-2 px-4 rounded-3xl w-full m-4 h-16"
              >
                {t("Save")}
              </button>
            </div>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default OffcanvasForPD;
