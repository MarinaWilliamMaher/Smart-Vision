import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./StyleSheets/CustomizedOrderDetails.css";
import Accordion from "react-bootstrap/Accordion";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";
import AlertDialog from "../e-commers/Dialog";
import { useTranslation } from "react-i18next";
import { apiRequest } from "../../utils";
import toast, { Toaster } from "react-hot-toast";

// const tempImages = [
//   'https://res.cloudinary.com/dkep2voqw/image/upload/v1705848315/Smart%20Vision/vojtech-bruzek-Yrxr3bsPdS0-unsplash_ekmimc.jpg',
//   'https://res.cloudinary.com/dkep2voqw/image/upload/v1705848324/Smart%20Vision/febrian-zakaria-2QTsCoQnoag-unsplash_vjvjwj.jpg',
//   'https://res.cloudinary.com/dkep2voqw/image/upload/v1705848324/Smart%20Vision/febrian-zakaria-2QTsCoQnoag-unsplash_vjvjwj.jpg',
//   'https://res.cloudinary.com/dkep2voqw/image/upload/v1705848324/Smart%20Vision/febrian-zakaria-2QTsCoQnoag-unsplash_vjvjwj.jpg',
//   'https://res.cloudinary.com/dkep2voqw/image/upload/v1705848324/Smart%20Vision/febrian-zakaria-2QTsCoQnoag-unsplash_vjvjwj.jpg',
//   'https://res.cloudinary.com/dkep2voqw/image/upload/v1705848324/Smart%20Vision/febrian-zakaria-2QTsCoQnoag-unsplash_vjvjwj.jpg',
//   'https://res.cloudinary.com/dkep2voqw/image/upload/v1705848324/Smart%20Vision/febrian-zakaria-2QTsCoQnoag-unsplash_vjvjwj.jpg',
//   'https://res.cloudinary.com/dkep2voqw/image/upload/v1705848329/Smart%20Vision/kenny-eliason-iAftdIcgpFc-unsplash_l33xyj.jpg',
// ];
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
function CustomizedOrderDetails({ order, employeeType, socket, setSocket }) {
  console.log(order);
  const language = JSON.parse(window?.localStorage.getItem("language"));
  const { t } = useTranslation();
  let current = new Date();
  const images = order?.images;
  const customer = order?.customer;
  const engineer = order?.assignedEngineer;
  const pdf = order?.details;
  const orderDate = order?.updatedAt?.substring(0, 10); // to take date only
  const { employee } = useSelector((state) => state?.employee);
  const [mainImage, setmainImage] = useState(images ? images[0] : null);
  const [assignedEngineer, setassignedEngineer] = useState("");
  const [measuringDate, setmeasuringDate] = useState(null);
  const [measuringTime, setmeasuringTime] = useState(null);
  const [msg, setMsg] = useState("");
  const [minMeasuringTime, setminMeasuringTime] = useState("10:00");
  const [validated, setValidated] = useState(false);
  const [allEngineers, setallEngineers] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const [isAssigned, setIsAssigned] = useState(false);
  const [DialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    async function getAllEngineers() {
      const res = await apiRequest({
        url: "/employees/engineer",
        method: "GET",
        token: employee?.token,
      });
      console.log(res);
      if (res?.data?.success) {
        setallEngineers(res?.data?.engineers);
      } else {
        toast.dismiss();
        toast.error("Failed to get all engneers");
      }
    }
    if (employee?.jobTitle.toLowerCase() === "operator") {
      getAllEngineers();
    }
  }, []);

  function showAssignEngineer() {
    const service = order?.service;
    if (
      employeeType === "OPERATOR" &&
      !engineer &&
      !isAssigned &&
      (service === "Customization Service" ||
        service === "Measuring Service" ||
        service === "Desgins services")
    ) {
      return true;
    }
    return false;
  }

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
    } else {
      const res = await apiRequest({
        url: "/employees/engineer",
        method: "POST",
        data: measuringDate
          ? {
              engineerId: assignedEngineer,
              serviceId: order?._id,
              date: {
                day: measuringDate,
                time: measuringTime,
              },
            }
          : { engineerId: assignedEngineer, serviceId: order?._id },
        token: employee?.token,
      });
      if (res?.data?.success) {
        console.log(res.data);
        // console.log({ assignedEngineer });
        console.log(res?.data?.service?.assignedEngineer);
        console.log(res.data.service);
        setassignedEngineer(res?.data?.service?.assignedEngineer);
        setIsAssigned(true);
        socket?.emit("assignEngineer", {
          user: employee,
          to: res?.data?.sercice?.assignedEngineer._id,
          type: "assignEngineerToCustomizationOrder",
          serviceOrder: res.data.service,
        });
      } else {
        toast.error("Failed to assign engineer to this services");
        setMsg("engineer " + res?.message);
        setDialogOpen(true);
      }
    }
  };

  function getMinMeasuringDateToday() {
    const currentTime = current.toTimeString().substring(0, 5);
    let currentHoure = currentTime.substring(0, 2);
    let currentMineates = currentTime.substring(3);
    let minHoure = +currentHoure + 1;
    if (minHoure === 24) {
      minHoure = "00";
    }
    if (minHoure < 10) {
      minHoure = `0${minHoure}`;
    }
    return `${minHoure}:${currentMineates}`;
  }

  function CheckMinMesuringTimeToday() {
    if (measuringDate === current.toISOString().substring(0, 10)) {
      //to set with the current time
      setminMeasuringTime(getMinMeasuringDateToday());
    } else {
      setminMeasuringTime("10:00");
    }
  }

  useEffect(() => {
    CheckMinMesuringTimeToday();
  }, [measuringDate]);

  const handleCancelMessage = () => {
    setShowMessage(false);
  };

  return (
    <>
      <Toaster />
      <Accordion
        defaultActiveKey={["0", "1"]}
        alwaysOpen
        className="CustomizedOrderAccordion"
      >
        <AlertDialog
          open={DialogOpen}
          onClose={() => {
            setDialogOpen(false);
            // navigate("/bag");
          }}
          msg={msg}
        />
        <Accordion.Item eventKey="0">
          <Accordion.Header>{t("details")}</Accordion.Header>
          <Accordion.Body>
            <p className="mb-6">
              <span className="block">{t("description")}: </span>
              {language === "en" ? order?.description : order?.ARDescription}
            </p>
            <p>
              <span>{t("date")}:</span> {orderDate}
            </p>
            <p>
              <span>{t("state")}:</span> {t(order?.state.toLowerCase())}.
            </p>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>{t("attachments")}</Accordion.Header>
          <Accordion.Body>
            <div className="customizedOrderDetailsAtachments">
              {images?.length ? (
                <>
                  <Dialog
                    open={showMessage}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleCancelMessage}
                    aria-describedby="alert-dialog-slide-description"
                  >
                    <DialogContent sx={{ position: "relative", padding: "0" }}>
                      <CloseIcon
                        onClick={handleCancelMessage}
                        sx={{
                          fontSize: "30px",
                          color: "black",
                          cursor: "pointer",
                          marginLeft: "auto",
                          position: "absolute",
                          top: "0",
                          right: "0",
                          margin: ".5rem",
                        }}
                      />
                      <img width={550} className="h-96" src={mainImage} />
                    </DialogContent>
                  </Dialog>
                  <div className="customizedOrderDetailsSubImagesDiv">
                    {images.map((image, idx) => {
                      return (
                        <img
                          key={idx}
                          className="customizedOrderDetailsSubImage"
                          src={image}
                          onClick={() => {
                            setmainImage(image);
                            setTimeout(() => setShowMessage(true), 20);
                          }}
                        />
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="customizedOrderDetailsNoImages">
                  {t("noPhotoAttacked")}
                </div>
              )}
              {employeeType === "FACTORY" && pdf ? (
                <div className="customizedOrderDetailsPdfButton flex ">
                  <Link to={pdf}>{t("downLoad")} PDF</Link>
                </div>
              ) : null}
            </div>
          </Accordion.Body>
        </Accordion.Item>
        {employeeType === "FACTORY" ? (
          <Accordion.Item eventKey="2" className="TapleDiv">
            <Accordion.Header>{t("materials")}</Accordion.Header>
            <Accordion.Body className="CustomizedOrderAccordion AccordionMaterialTaple">
              <Table striped bordered responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>{t("name")}</th>
                    <th>{t("quantity")}</th>
                  </tr>
                </thead>
                <tbody>
                  {order?.requiredMaterials?.map((order, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        {language === "en"
                          ? order?.material
                          : order?.ARMaterial}
                      </td>
                      <td>{order?.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Accordion.Body>
          </Accordion.Item>
        ) : null}
        <Accordion.Item eventKey="4">
          <Accordion.Header>{t("customerData")}</Accordion.Header>
          <Accordion.Body>
            <p>
              <span>{t("name")}: </span> {customer?.username}
            </p>
            {employeeType !== "FACTORY" ? (
              <>
                <p>
                  <span>{t("email")}: </span> {customer?.email}
                </p>
                <p>
                  <span>{t("phone")}:</span> 0{customer?.phone}
                </p>
                <p>
                  <span>{t("address")}:</span> {order?.address}
                </p>
              </>
            ) : null}
            {employeeType !== "FACTORY" && order?.date ? (
              <p>
                <span>{t("measuringDate")}: </span>
                {order?.date?.day} - {order?.date?.time}
              </p>
            ) : null}
          </Accordion.Body>
        </Accordion.Item>
        {(employeeType !== "ENGINEER" && engineer) || isAssigned ? (
          <Accordion.Item eventKey="3">
            <Accordion.Header>{t("engineerData")}</Accordion.Header>
            <Accordion.Body>
              <p>
                <span>{t("name")}: </span>{" "}
                {isAssigned ? assignedEngineer?.username : engineer?.username}
              </p>
              <p>
                <span>{t("email")}: </span>{" "}
                {isAssigned ? assignedEngineer?.email : engineer?.email}
              </p>
            </Accordion.Body>
          </Accordion.Item>
        ) : null}
        {showAssignEngineer() ? (
          <Accordion.Item eventKey="5">
            <Accordion.Header>{t("assignEngineer")}</Accordion.Header>
            <Accordion.Body>
              <Form
                noValidate
                validated={validated}
                onSubmit={handleSubmit}
                className="assignEngineerForm"
              >
                <Form.Group className="InputGroup">
                  <Form.Label
                    className="FormLabel text-2xl font-bold"
                    htmlFor="assignedEngineer"
                  >
                    {t("choose")} {t("Engineer")}
                  </Form.Label>
                  <Form.Select
                    required
                    className="InputField"
                    name="assignedEngineer"
                    id="assignedEngineer"
                    onChange={(e) => setassignedEngineer(e.target.value)}
                  >
                    <option value="">
                      {t("choose")} {t("Engineer")}
                    </option>
                    {allEngineers?.map((engineer, idx) => {
                      return (
                        <option key={idx} value={engineer?._id}>
                          {engineer?.username?.toLowerCase()}
                        </option>
                      );
                    })}
                  </Form.Select>
                </Form.Group>
                {/* only show when the coustomer need measuring */}
                {order?.measuring ? (
                  <>
                    <Form.Group className="InputGroup">
                      <Form.Label
                        className="FormLabel text-2xl font-bold"
                        htmlFor="measuringDate"
                      >
                        {t("measuringDate")}
                      </Form.Label>
                      <Form.Control
                        required
                        className="InputField"
                        name="measuringDate"
                        id="measuringDate"
                        type="date"
                        //The current date is the minimum date.
                        min={current.toISOString().substring(0, 10)}
                        onChange={(e) => setmeasuringDate(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group className="InputGroup">
                      <Form.Label
                        className="FormLabel text-2xl font-bold"
                        htmlFor="measuringTime"
                      >
                        {t("time")}{" "}
                        <span className="text-base">(10:00AM - 22:00PM)</span>
                      </Form.Label>
                      <Form.Control
                        required
                        className="InputField"
                        name="measuringTime"
                        id="measuringTime"
                        type="time"
                        min={minMeasuringTime}
                        max="22:00"
                        onChange={(e) => setmeasuringTime(e.target.value)}
                      />
                      <Form.Control.Feedback type="invalid">
                        {t("ChooseAValidTime")}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </>
                ) : null}
                <div className=" assignEnginterButtonDiv">
                  <button
                    type="submit"
                    className="text-2xl bg-gray-900 hover:bg-black text-white  rounded-xl h-fit px-3 py-2 m-auto"
                  >
                    {t("assign")}
                  </button>
                </div>
              </Form>
            </Accordion.Body>
          </Accordion.Item>
        ) : null}
      </Accordion>
    </>
  );
}

export default CustomizedOrderDetails;
