import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import { Typography, Grid, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { Link } from "react-router-dom";

export default function CustomerCard({ customer }) {
  return (
    <Card sx={{ maxWidth: 310, marginBottom: "2rem", bgcolor: "#f8f9fa" }}>
      <CardHeader
        avatar={
          <Avatar
            sx={{ bgcolor: "#48cae4", width: 50, height: 50 }}
            aria-label="recipe"
          >
            {/* MW */}
            {customer?.username?.charAt(0).toUpperCase() }
          </Avatar>
        }
        title={
          <div style={{ display: "flex", alignItems: "center" }}>
            <Typography
              style={{
                textAlign: "start",
                textTransform: "capitalize",
                fontSize: "19px",
              }}
            >
              {customer.username}
            </Typography>
            <Link
              to={`/operator/edit-customer/${customer._id}`}
              style={{ marginLeft: "auto" }}
            >
              <IconButton aria-label="edit">
                <EditIcon />
              </IconButton>
            </Link>
          </div>
        }
        subheader={
          <Typography
            style={{ textAlign: "start", fontSize: "14px", color: "gray" }}
          >
            {customer.email}
          </Typography>
        }
      />
      <CardContent>
        <Grid container spacing={2} textAlign={"center"}>
          <Grid xs={4} item>
            <Typography
              style={{ fontSize: "19px", textAlign: "center", color: "gray" }}
            >
              Phone
            </Typography>
          </Grid>
          <Grid xs={8} item>
            <Typography style={{ fontSize: "18px", textAlign: "center" }}>
              0{customer?.phone}
            </Typography>
          </Grid>
          <Grid xs={4} item>
            <Typography
              style={{ fontSize: "19px", textAlign: "center", color: "gray" }}
            >
              <span style={{ fontSize: "19px" }}>Address: </span>{" "}
            </Typography>
          </Grid>
          <Grid xs={8} item>
            <Typography style={{ fontSize: "18px", textAlign: "center" }}>
              {customer?.address||"Undefined"}
            </Typography>
          </Grid>
          <Grid xs={4} item>
            <Typography
              style={{ fontSize: "19px", textAlign: "center", color: "gray" }}
            >
              Points:
            </Typography>
          </Grid>
          <Grid xs={8} item>
            <Typography style={{ fontSize: "18px", textAlign: "center" }}>
              {customer.points}
            </Typography>
          </Grid>
          <Grid xs={4} item>
            <Typography
              style={{ fontSize: "19px", textAlign: "center", color: "gray" }}
            >
              Gender:
            </Typography>
          </Grid>
          <Grid xs={8} item>
            <Typography style={{ fontSize: "18px", textAlign: "center" }}>
              {customer.gender}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
