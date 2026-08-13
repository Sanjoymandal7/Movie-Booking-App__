import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Box, Grid } from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Movies } from "../Movie";
import { add } from "../redux/bookSlice";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const bookTicket = (movie) => {
    dispatch(add(movie));
    navigate("/book-ticket");
  };

  return (
    <Box sx={{ flexGrow: 1 }} className="container">
      <Grid
        container
        spacing={3}
        direction={{ xs: "column", md: "row" }}
        mt={2}
        alignItems="center"
        justifyContent="space-around"
      >
        {Movies.map((movie) => (
          <Grid item key={movie.id} lg={3} md={4} sm={6} xs={12}>
            <Card
              sx={{
                width: 300,
                boxShadow: "5px 5px 8px #fff",
                transition: "0.3s",
                "&:hover": {
                  boxShadow: "10px 10px 20px #ccc",
                },
              }}
            >
              <CardMedia
                sx={{ height: 350 }}
                image={movie.image}
                title={movie.name}
              />

              <CardContent>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  color="darkblue"
                >
                  {movie.name}
                </Typography>

                <Typography variant="body2" color="black">
                  {movie.starring}
                </Typography>
              </CardContent>

              <CardActions>
                <Button
                  fullWidth
                  onClick={() => bookTicket(movie)}
                  sx={{
                    color: "white",
                    backgroundImage:
                      "linear-gradient(to right top, #ec146c, #ef035d, #f1004d, #f1003d, #ef0d2b)",
                    "&:hover": {
                      backgroundColor: "#d1003a",
                      color: "white",
                    },
                  }}
                >
                  BOOK TICKET
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Home;