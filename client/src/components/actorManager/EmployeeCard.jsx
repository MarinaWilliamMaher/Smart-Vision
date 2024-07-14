import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import { Typography, Grid, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { Link } from "react-router-dom";
import i18n from "../../../Language/translate";
export default function EmployeeCard({ employee, t }) {
  return (
    <Card sx={{ maxWidth: 310, marginBottom: "2rem", bgcolor: "#f8f9fa" }}>
      <CardHeader
        avatar={
          <Avatar
            sx={{
              bgcolor: "#48cae4",
              width: 50,
              height: 50,
              marginLeft: i18n.language === "ar" ? "1rem" : "0rem",
            }}
            aria-label="recipe"
          >
            {employee?.firstName
              ? employee.firstName.charAt(0).toUpperCase() +
                employee.firstName.charAt(0).toUpperCase()
              : employee.username.charAt(0).toUpperCase()}
          </Avatar>
        }
        title={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              position: "relative",
            }}
          >
            {i18n.language === "ar" && (
              <Link to={`/actor/edit-employee/${employee._id}`}>
                <IconButton
                  aria-label="edit"
                  style={{
                    position: "absolute",
                    left: 0,
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                >
                  <EditIcon />
                </IconButton>
              </Link>
            )}
            <Typography
              style={{
                textAlign: "start",
                textTransform: "capitalize",
                fontSize: "19px",
                direction: "rtl",
              }}
            >
              {t(
                employee.firstName
                  ? (employee.firstName + " " + employee.lastName).toLowerCase()
                  : employee.username?.toLowerCase()
              )}
            </Typography>
            {i18n.language !== "ar" && (
              <Link
                to={`/actor/edit-employee/${employee._id}`}
                style={{ marginLeft: "auto" }}
              >
                <IconButton aria-label="edit">
                  <EditIcon />
                </IconButton>
              </Link>
            )}
          </div>
        }
        subheader={
          <Typography
            style={{ textAlign: "start", fontSize: "12px", color: "gray" }}
          >
            {employee.email}
          </Typography>
        }
      />
      <CardContent>
        <Grid
          container
          spacing={2}
          textAlign={"center"}
          style={{ justifyContent: "center" }}
        >
          <Grid xs={5} item>
            <Typography
              style={{ fontSize: "19px", textAlign: "start", color: "gray" }}
            >
              {t("UserName")}:
            </Typography>
          </Grid>
          <Grid xs={7} item>
            <Typography
              style={{
                fontSize: "18px",
                textAlign: "center",
                textTransform: "capitalize",
              }}
            >
              {/* {employee?.username} */}
              {employee?.username?.toLowerCase()}
            </Typography>
          </Grid>
          <Grid xs={5} item>
            <Typography
              style={{ fontSize: "19px", textAlign: "start", color: "gray" }}
            >
              <span style={{ fontSize: "19px" }}>{t("JobTitle")}: </span>{" "}
            </Typography>
          </Grid>
          <Grid xs={7} item>
            <Typography
              style={{
                fontSize: "18px",
                textAlign: "center",
                textTransform: "capitalize",
              }}
            >
              {t(employee?.jobTitle)}
            </Typography>
          </Grid>
          <Grid xs={4} item>
            <Typography
              style={{ fontSize: "19px", textAlign: "start", color: "gray" }}
            >
              {t("Salary")}:
            </Typography>
          </Grid>
          <Grid xs={7} item>
            <Typography style={{ fontSize: "18px", textAlign: "center" }}>
              {employee?.salary ? employee?.salary : 10000}$
            </Typography>
          </Grid>
          <Grid xs={4} item>
            <Typography
              style={{ fontSize: "19px", textAlign: "start", color: "gray" }}
            >
              {t("Phone")}:
            </Typography>
          </Grid>
          <Grid xs={7} item>
            <Typography style={{ fontSize: "18px", textAlign: "center" }}>
              {employee?.phone ? "0" + employee?.phone : t("Undefined")}
            </Typography>
          </Grid>
          <Grid
            xs={12}
            item
            style={{ display: "flex", justifyContent: "flex-start" }}
          >
            <Link to={`/actor/change-password/${employee?._id}`}>
              <Button
                sx={{
                  backgroundColor: "#f8f9fa",
                  color: "#48cae4",
                  textTransform: "capitalize",
                  fontSize: "17px",
                  padding: "5px 10px",
                  borderRadius: "10px",
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "#f8f9fa",
                    color: "blue",
                    outline: "none",
                  },
                  "&:active": { backgroundColor: "#f8f9fa" },
                }}
              >
                {t("ChangePasswo..")}
              </Button>
            </Link>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
