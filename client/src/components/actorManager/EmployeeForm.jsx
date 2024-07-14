import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Loading from "../../components/shared/Loading";
import "./StyleSheets/EmployeeForm.css";
import { apiRequest, handleFileUpload } from "../../utils";
import { useSelector } from "react-redux";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  Tooltip,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import i18n from "../../../Language/translate";
import toast, { Toaster } from "react-hot-toast";
let current = new Date();

function getmaxEmployeeDateOfBirth() {
  let currentYear = current.toISOString().substring(0, 4);
  let currentDayAndMonth = current.toISOString().substring(4, 10);
  let maxYear = +currentYear - 18;
  return `${maxYear}${currentDayAndMonth}`;
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function EmployeeForm() {
  const { employee } = useSelector((state) => state?.employee);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const employeeAllTypes = [
    "Engineer",
    "Inventory Manager",
    "Factory",
    "Presenter",
    "Actor Manager",
    "Operator",
  ];
  const qualificationAllTypes = [
    "Bachelor's Degree",
    "Master's Degree",
    "Doctor of Philosophy",
    "Professional Certification (e.g., CPA, CFA)",
    "Diploma",
    "Associate Degree",
    "High School Diploma/GED",
    "Technical Certification",
  ];
  const { employeeId } = useParams();
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [email, setemail] = useState("");
  const [phone, setphone] = useState("");
  const [gender, setgender] = useState("");
  const [dateOfBirth, setdateOfBirth] = useState("");
  const [address, setaddress] = useState("");
  const [qualification, setqualification] = useState("");
  const [employeeType, setemployeeType] = useState("");
  const [salary, setsalary] = useState("");
  const [password, setpassword] = useState("");
  const [confirmpassword, setconfirmpassword] = useState("");
  const [PasswordConformed, setPasswordConformed] = useState(false);
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteMessage, setshowDeleteMessage] = useState(false);
  const maxEmployeeDateOfBirth = getmaxEmployeeDateOfBirth();

  function setEmployeetData(employee) {
    setfirstName(employee?.firstName);
    setlastName(employee?.lastName);
    setemail(employee?.email);
    setgender(employee?.gender);
    setdateOfBirth(employee?.birthday?.substring(0, 10));
    setsalary(employee?.salary);
    setaddress(employee?.address);
    setqualification(employee?.qualification);
    setphone(employee?.phone);
    setemployeeType(employee?.jobTitle);
    setpassword(employee?.password);
    setconfirmpassword(employee?.password);
    setIsLoading(false);
  }

  async function handleDeleteEmployee() {
    try {
      const res = await apiRequest({
        url: `/employees/actor/`,
        method: "DELETE",
        data: { id: employeeId },
        token: employee?.token,
      });
      if (res?.data?.success) {
        navigate("/actor/employees");
      } else {
        console.log(res?.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleAddEmployee() {
    try {
      const res = await apiRequest({
        url: `/employees/actor/`,
        method: "POST",
        data: {
          firstName,
          lastName,
          username: `${firstName} ${lastName}`,
          email,
          password,
          gender,
          jobTitle: employeeType,
          qualification,
          birthday: dateOfBirth,
          salary,
          phone,
          address,
        },
        token: employee?.token,
      });
      if (res?.data?.success) {
        navigate("/actor/employees");
      } else {
        console.log(res?.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleUpdateEmployee() {
    try {
      const res = await apiRequest({
        url: `/employees/actor/`,
        method: "PUT",
        data: {
          employeeId,
          firstName,
          lastName,
          username: `${firstName} ${lastName}`,
          email,
          password,
          gender,
          jobTitle: employeeType,
          qualification,
          birthday: dateOfBirth,
          salary,
          phone,
          address,
        },
        token: employee?.token,
      });
      if (res?.data?.success) {
        navigate("/actor/employees");
      } else {
        console.log(res?.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === false || !PasswordConformed) {
      setValidated(true);
    } else {
      setIsLoading(true);
      employeeId ? handleUpdateEmployee() : handleAddEmployee();
    }
  };

  async function getEmployee() {
    const res = await apiRequest({
      url: `/employees/actor/${employeeId}`,
      method: "GET",
      token: employee?.token,
    });
    if (res?.data?.success) {
      setEmployeetData(res?.data?.employee);
    } else {
      toast.dismiss();
      toast.error("Error");
      setIsLoading(false);
    }
  }

  const handleAgreeDeleteProductMessage = () => {
    handleDeleteEmployee();
  };

  const handleDisagreeDeleteProductMessage = () => {
    setshowDeleteMessage(false);
  };

  useEffect(() => {
    //fired only when there is employeeId (edit)
    employeeId ? getEmployee() : setIsLoading(false);
  }, []);

  useEffect(() => {
    setPasswordConformed(password === confirmpassword);
  }, [confirmpassword, password]);

  return (
    <>
      <Toaster />
      {!isLoading ? (
        <main className="employeeFormMain">
          <div className="employeeFormHeader" style={{ position: "relative" }}>
            <h2>{employeeId ? t("EditEmployee") : t("AddNewEmployee")}</h2>
            {employeeId ? (
              <button
                onClick={() => setshowDeleteMessage(true)}
                style={
                  i18n.language === "ar"
                    ? {
                        position: "absolute",
                        left: 0,
                        top: "50%",
                        transform: "translateY(-50%)",
                      }
                    : {}
                }
              >
                {t("delete")}
                <DeleteForeverIcon />
              </button>
            ) : null}
          </div>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <div className="employeeFormDivForTowFields">
              <Form.Group className="InputGroup">
                <Form.Label htmlFor="firstName" className="FormLabel">
                  {t("firstName")}
                </Form.Label>
                <Form.Control
                  required
                  className="InputField"
                  name="firstName"
                  id="firstName"
                  type="text"
                  placeholder={t("firstName")}
                  value={firstName}
                  onChange={(e) => setfirstName(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="InputGroup">
                <Form.Label htmlFor="lastName" className="FormLabel">
                  {t("lastName")}
                </Form.Label>
                <Form.Control
                  required
                  className="InputField"
                  name="lastName"
                  id="lastName"
                  type="text"
                  placeholder={t("lastName")}
                  value={lastName}
                  onChange={(e) => setlastName(e.target.value)}
                />
              </Form.Group>
            </div>
            <div className="employeeFormDivForTowFields">
              <Form.Group className="InputGroup">
                <Form.Label htmlFor="email" className="FormLabel">
                  {t("email")}
                </Form.Label>
                <Form.Control
                  required
                  className="InputField"
                  name="email"
                  id="email"
                  type="email"
                  placeholder={t("email")}
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                />
              </Form.Group>
              <Form.Group className=" InputGroup ">
                <Form.Label htmlFor="phone" className="FormLabel">
                  {t("phone")}
                </Form.Label>
                <Form.Control
                  required
                  className="InputField employeePhoneInput"
                  name="phone"
                  id="phone"
                  type="number"
                  placeholder={t("phone")}
                  value={phone}
                  onChange={(e) => setphone(e.target.value)}
                />
              </Form.Group>
            </div>
            <div className="employeeFormDivForTowFields">
              <Form.Group className="InputGroup suEditProductCategoryAndPriceDiv ">
                <Form.Label className="FormLabel" htmlFor="gender">
                  {t("gender")}
                </Form.Label>
                <Form.Select
                  required
                  className="InputField"
                  name="gender"
                  id="gender"
                  value={gender}
                  onChange={(e) => setgender(e.target.value)}
                >
                  <option value="">{t("ChooseOption")}</option>
                  <option value="Male">{t("Male")}</option>
                  <option value="Female">{t("Female")}</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="InputGroup">
                <Form.Label htmlFor="dateOfBirth" className="FormLabel">
                  {t("dateOfBirth")}
                </Form.Label>
                <Form.Control
                  required
                  className="InputField "
                  name="dateOfBirth"
                  id="dateOfBirth"
                  type="date"
                  max={maxEmployeeDateOfBirth}
                  value={dateOfBirth}
                  onChange={(e) => setdateOfBirth(e.target.value)}
                />
              </Form.Group>
            </div>
            <Form.Group className="InputGroup">
              <Form.Label htmlFor="address" className="FormLabel">
                {t("address")}
              </Form.Label>
              <Form.Control
                required
                className="InputField "
                name="address"
                id="address"
                type="text"
                placeholder={t("address")}
                value={address}
                onChange={(e) => setaddress(e.target.value)}
              />
            </Form.Group>

            <div className="employeeFormDivForTowFields">
              <Form.Group className="InputGroup suEditProductCategoryAndPriceDiv ">
                <Form.Label className="FormLabel" htmlFor="qualification">
                  {t("qualification")}
                </Form.Label>
                <Form.Select
                  required
                  className="InputField"
                  name="qualification"
                  id="qualification"
                  value={qualification}
                  onChange={(e) => setqualification(e.target.value)}
                >
                  <option value="">{t("ChooseOption")}</option>
                  {qualificationAllTypes.map((type, idx) => {
                    return (
                      <option key={idx} value={type}>
                        {t(type)}
                      </option>
                    );
                  })}
                </Form.Select>
              </Form.Group>
              <Form.Group className="InputGroup suEditProductCategoryAndPriceDiv ">
                <Form.Label className="FormLabel" htmlFor="employeeType">
                  {t("employeeType")}
                </Form.Label>
                <Form.Select
                  required
                  className="InputField"
                  name="employeeType"
                  id="employeeType"
                  value={employeeType}
                  onChange={(e) => setemployeeType(e.target.value)}
                >
                  <option value="">{t("ChooseOption")}</option>
                  {employeeAllTypes.map((type, idx) => {
                    return (
                      <option key={idx} value={type.toLowerCase()}>
                        {t(type)}
                      </option>
                    );
                  })}
                </Form.Select>
              </Form.Group>
            </div>
            <div className="employeeFormDivForTowFields">
              <Form.Group className="InputGroup">
                <Form.Label className="FormLabel" htmlFor="salary">
                  {t("Salary")}
                </Form.Label>
                <Form.Control
                  required
                  className="InputField "
                  name="salary"
                  id="salary"
                  type="number"
                  placeholder={t("Salary")}
                  value={salary}
                  min={0}
                  onChange={(e) => setsalary(e.target.value)}
                />
              </Form.Group>
            </div>
            {!employeeId ? (
              <div className="employeeFormDivForTowFields">
                <Form.Group className="InputGroup">
                  <Form.Label htmlFor="password" className="FormLabel">
                    {t("password")}
                  </Form.Label>
                  <Form.Control
                    required
                    className="InputField"
                    name="password"
                    id="password"
                    type="password"
                    placeholder={t("password")}
                    minLength={"8"}
                    value={password}
                    onChange={(e) => setpassword(e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    {t("Minimum 8 characters")}.
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="InputGroup">
                  <Form.Label htmlFor="confirmpassword" className="FormLabel">
                    {t("confirmPassword")}
                  </Form.Label>
                  <Form.Control
                    isInvalid={!PasswordConformed}
                    className="InputField"
                    name="confirmpassword"
                    id="confirmpassword"
                    type="password"
                    minLength={"8"}
                    placeholder={t("confirmPassword")}
                    value={confirmpassword}
                    onChange={(e) => setconfirmpassword(e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    {t("notConfirmedoassword")}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
            ) : null}
            <div className="flex justify-around flex-row-reverse ">
              <button
                type="submit"
                style={{ order: i18n.language === "ar" ? "2" : "1" }}
                className="text-2xl bg-slate-700 hover:bg-slate-800 text-white font-bold py-2 px-4 rounded-xl mb-4 h-16"
              >
                {t("save")}
              </button>
              <button
                style={{ order: i18n.language === "ar" ? "1" : "2" }}
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
      <Dialog
        open={showDeleteMessage}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleDisagreeDeleteProductMessage}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle sx={{ fontSize: "25px", fontWeight: "bold" }}>
          {t("delete")} {t("employee")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {/* Are you sure you want to proceed with the deletion of this employee?
            <br />
            <br />
            This action cannot be undone and will permanently remove the
            employee from the database. */}
            {t("deleteConfirmationMessage")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDisagreeDeleteProductMessage}
            sx={{ marginRight: "auto" }}
          >
            {t("disagree")}
          </Button>
          <Button onClick={handleAgreeDeleteProductMessage}>
            {t("agree")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default EmployeeForm;
