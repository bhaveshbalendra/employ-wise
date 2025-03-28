import {
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { z } from "zod";
import { useLoginUserMutation } from "../../store/slices/userSlice";

// Validation schema using Zod
const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string(),
});

const Login = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const navigate = useNavigate();
  const [loginUser, { isLoading }] = useLoginUserMutation();

  // Handle input change
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    // Validate form data using Zod
    const validation = LoginSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0] || "",
        password: fieldErrors.password?.[0] || "",
      });
      toast.error("Please enter correct email or password before submitting.");
      return;
    }

    setErrors({}); // Clear errors if validation passes

    try {
      const response = await loginUser(formData).unwrap();
      localStorage.setItem("token", response.token);
      toast.success("Login Successful! Redirecting...");

      setTimeout(() => navigate("/user/1"), 1500);
    } catch (error) {
      const err = error as FetchBaseQueryError;

      const errorMessage =
        "data" in err && err.data && typeof err.data === "object"
          ? (err.data as { message?: string }).message ||
            "Login failed. Please try again."
          : "An unexpected error occurred.";

      toast.error(errorMessage);
    }
  };

  return (
    <>
      <Container
        maxWidth="xl"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%)",
          px: { xs: 2, sm: 3 },
        }}
      >
        <Paper
          elevation={12}
          sx={{
            padding: { xs: 3, sm: 4 },
            borderRadius: 3,
            width: "100%",
            maxWidth: { xs: 350, sm: 400 },
            textAlign: "center",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(10px)",
          }}
        >
          <form onSubmit={handleSubmit}>
            <Stack spacing={isMobile ? 2 : 3} alignItems="center">
              <Typography
                variant={isMobile ? "h6" : "h5"}
                fontWeight="bold"
                color="primary"
              >
                Welcome Back 👋
              </Typography>
              <TextField
                fullWidth
                name="email"
                value={formData.email}
                onChange={handleChange}
                label="Email"
                error={!!errors.email}
                helperText={errors.email}
                size={isMobile ? "small" : "medium"}
              />
              <TextField
                fullWidth
                name="password"
                value={formData.password}
                onChange={handleChange}
                label="Password"
                type="password"
                error={!!errors.password}
                helperText={errors.password}
                size={isMobile ? "small" : "medium"}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size={isMobile ? "medium" : "large"}
                sx={{
                  borderRadius: "8px",
                  textTransform: "none",
                  fontWeight: "bold",
                  mt: 1,
                  py: isMobile ? 1 : 1.5,
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <CircularProgress size={isMobile ? 20 : 24} color="inherit" />
                ) : (
                  "Login"
                )}
              </Button>
            </Stack>
          </form>
        </Paper>
      </Container>
    </>
  );
};

export default Login;
