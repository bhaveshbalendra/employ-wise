import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";

const Layout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ px: { xs: 1, sm: 2 } }}>
          <Typography
            variant={isMobile ? "h6" : "h5"}
            component="div"
            sx={{
              flexGrow: 1,
              fontSize: { xs: "1.1rem", sm: "1.25rem", md: "1.5rem" },
            }}
          >
            User Management
          </Typography>
          <Button
            color="inherit"
            onClick={handleLogout}
            size={isMobile ? "small" : "medium"}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          width: "100%",
          minHeight: "calc(100vh - 64px)",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Container
          maxWidth="md"
          sx={{
            py: { xs: 2, sm: 3, md: 4 },
            px: { xs: 1, sm: 2 },
          }}
        >
          <Outlet />
        </Container>
      </Box>
    </>
  );
};

export default Layout;
