import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Loading from "../shared/Loading";
import "./StyleSheets/CustomerForm.css";
import toast, { Toaster } from "react-hot-toast";

function CustomerForm() {
  const navigate = useNavigate();
  const { customerId } = useParams();
  const [userName, setUserName] = useState("");
  const [phone, setphone] = useState("");
  const [gender, setgender] = useState("");
  const [address, setaddress] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [confirmpassword, setconfirmpassword] = useState("");
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  function setCustomertData(customer) {
    setUserName(customer?.username);
    setgender(customer?.gender);
    setemail(customer?.email);
    setaddress(customer?.address);
    setphone(`0${customer?.phone}`);
    setpassword(customer?.password);
    setIsLoading(false);
  }
  async function handleDeleteCustomer() {
    // console.log('handleDeleteEmplyee');
    try {
      await axios
        .delete(`/employees/deleteCustomer/`, {
          data: { id: customerId },
        })
        .then((res) => {
          toast.dismiss();
          toast.success(res.data.message);
          navigate("/operator/customers");
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (error) {
      console.log(error);
    }
  }

  async function handleAddCustomer() {
    try {
      console.log(userName, email, password, gender, phone, address);
      await axios
        .post(`/employees/customer/`, {
          username: userName,
          email: email,
          password: password,
          gender: gender,
          phone: phone,
          address: address,
        })
        .then((res) => {
          setUserName("");
          setaddress("");
          setphone("");
          setgender("");
          setemail("");
          setpassword("");
          navigate("/operator/view-customers");
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (error) {
      console.log(error);
    }
  }
  async function handleUpdateCustomer() {
    try {
      await axios
        .put(`/employees/customer`, {
          customerId: customerId,
          username: userName,
          email: email,
          gender: gender,
          phone: phone,
          address: address,
          password: password,
        })
        .then((res) => {
          setUserName("");
          setaddress("");
          setphone("");
          setgender("");
          setemail("");
          setpassword("");
          navigate("/operator/view-customers");
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (error) {
      console.log(error);
    }
  }

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === false) {
      setValidated(true);
    } else {
      setIsLoading(false);
      customerId ? handleUpdateCustomer() : handleAddCustomer();
    }
  };

  async function getCustomer() {
    // console.log("getCustomer function");
    await axios
      .get(`employees/getCustomer/${customerId}`)
      .then((res) => {
        console.log(res?.data?.customer);
        setCustomertData(res?.data?.customer);
        // console.log(res?.data?.customer?.password);
      })
      .catch((e) => {
        console.log(e);
      });
  }
  useEffect(() => {
    //fired only when there is customerId (edit)
    customerId ? getCustomer() : setIsLoading(false);
  }, []);

  return (
    <>
      {!isLoading ? (
        <main className="customerFormMain">
          <div className="customerFormHeader">
            <h2>{customerId ? "Edit" : "Add"} Customer</h2>
            {customerId ? (
              <button onClick={handleDeleteCustomer}>
                Delete
                <DeleteForeverIcon />
              </button>
            ) : null}
          </div>
          <Form
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
            style={{
              maxWidth: "700px",
              margin: "auto",
            }}
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
            <div className="customerFormDivForTowFields">
              <Form.Group className="InputGroup">
                <Form.Label htmlFor="username" className="FormLabel">
                  UserName
                </Form.Label>
                <Form.Control
                  required
                  className="InputField"
                  name="username"
                  id="username"
                  type="text"
                  placeholder="UserName"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </Form.Group>
              {console.log(userName)}
              <Form.Group className="InputGroup">
                <Form.Label htmlFor="email" className="FormLabel">
                  Email
                </Form.Label>
                <Form.Control
                  required
                  className="InputField"
                  name="email"
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                />
              </Form.Group>
            </div>
            <div className="customerFormDivForTowFields">
              <Form.Group className=" InputGroup ">
                <Form.Label htmlFor="phone" className="FormLabel">
                  Phone
                </Form.Label>
                <Form.Control
                  required
                  className="InputField customerPhoneInput"
                  name="phone"
                  id="phone"
                  type="number"
                  placeholder="Phone"
                  value={phone}
                  onChange={(e) => setphone(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="InputGroup suEditProductCategoryAndPriceDiv ">
                <Form.Label className="FormLabel" htmlFor="gender">
                  Gender
                </Form.Label>
                <Form.Select
                  required
                  className="InputField"
                  name="gender"
                  id="gender"
                  value={gender}
                  onChange={(e) => setgender(e.target.value)}
                >
                  <option value="">Choose a option</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </Form.Select>
              </Form.Group>
            </div>
            <Form.Group className="InputGroup">
              <Form.Label htmlFor="address" className="FormLabel">
                Address
              </Form.Label>
              <Form.Control
                required
                className="InputField "
                name="address"
                id="address"
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) => setaddress(e.target.value)}
              />
              <div className="employeeFormDivForTowFields">
                <Form.Group
                  className="InputGroup"
                  style={{ marginLeft: "0px" }}
                >
                  <Form.Label htmlFor="password" className="FormLabel">
                    Password
                  </Form.Label>
                  <Form.Control
                    required
                    className="InputField"
                    name="password"
                    id="password"
                    type="password"
                    placeholder="Password"
                    minLength={"8"}
                    value={password}
                    onChange={(e) => setpassword(e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    Minimum 8 characters.
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  className="InputGroup"
                  style={{ marginRight: "0px" }}
                >
                  <Form.Label htmlFor="confirmpassword" className="FormLabel">
                    confirm Password
                  </Form.Label>
                  <Form.Control
                    className="InputField"
                    style={{ marginRight: "10px" }}
                    name="confirmpassword"
                    id="confirmpassword"
                    type="password"
                    minLength={"8"}
                    placeholder="confirm Password"
                    value={confirmpassword}
                    onChange={(e) => setconfirmpassword(e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    Password not Conform.
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
            </Form.Group>
            <div className="flex justify-around flex-row-reverse ">
              <button
                type="submit"
                style={{ marginLeft: "auto", marginRight: "10px" }}
                className="text-2xl bg-slate-700 hover:bg-slate-800 text-white font-bold py-2 px-4 rounded-xl mb-4 h-12"
              >
                Save
              </button>
              <button
                style={{ marginLeft: "10px" }}
                className="text-2xl bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded-xl mb-4 h-12"
                onClick={(e) => {
                  e.preventDefault();
                  history.back();
                }}
              >
                Cancel
              </button>
            </div>
          </Form>
        </main>
      ) : (
        <div className="h-96">
          <Loading />
        </div>
      )}
    </>
  );
}

export default CustomerForm;
