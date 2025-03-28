import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../../store/slices/userSlice";
import IUser from "../../types/user";

const EditUserSkeleton = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Stack spacing={isMobile ? 2 : 3}>
      <Skeleton
        variant="text"
        width={isMobile ? "70%" : "50%"}
        height={isMobile ? 30 : 40}
        sx={{ mx: "auto" }}
      />
      <Box textAlign="center">
        <Skeleton
          variant="circular"
          width={isMobile ? 60 : 80}
          height={isMobile ? 60 : 80}
          sx={{ mx: "auto" }}
        />
      </Box>
      <Stack spacing={isMobile ? 2 : 3}>
        <Skeleton variant="rectangular" height={isMobile ? 48 : 56} />
        <Skeleton variant="rectangular" height={isMobile ? 48 : 56} />
        <Skeleton variant="rectangular" height={isMobile ? 48 : 56} />
        <Stack direction="row" spacing={2} justifyContent="end">
          <Skeleton
            variant="rectangular"
            width={isMobile ? 70 : 80}
            height={isMobile ? 32 : 36}
          />
          <Skeleton
            variant="rectangular"
            width={isMobile ? 100 : 120}
            height={isMobile ? 32 : 36}
          />
        </Stack>
      </Stack>
    </Stack>
  );
};

const EditUser = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const { data, isLoading, isError, refetch } = useGetUsersQuery({ page: 1 }); // We'll filter for the user
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (data && id) {
      const user = data.users.find((u: IUser) => u.id === Number(id));
      if (user) {
        setFormData({
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
        });
      } else {
        toast.error("User not found");
        navigate("/user/1");
      }
    }
  }, [data, id, navigate]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormError(null); // Clear form error when user makes a change
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.first_name.trim() ||
      !formData.last_name.trim() ||
      !formData.email.trim()
    ) {
      setFormError("All fields are required");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormError("Please enter a valid email address");
      return;
    }

    try {
      await updateUser({ id: Number(id), ...formData }).unwrap();
      toast.success("User updated successfully");
      navigate("/user/1");
    } catch {
      toast.error("Failed to update user");
    }
  };

  const handleCancel = () => {
    navigate("/user/1");
  };

  const handleRetry = () => {
    refetch();
    toast.info("Retrying...");
  };

  if (isLoading) {
    return (
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, sm: 3 },
          maxWidth: 600,
          mt: { xs: 2, sm: 3 },
          mx: { xs: 2, sm: "auto" },
        }}
      >
        <EditUserSkeleton />
      </Paper>
    );
  }

  if (isError) {
    return (
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, sm: 3 },
          maxWidth: 600,
          mx: { xs: 2, sm: "auto" },
          mt: { xs: 2, sm: 3 },
        }}
      >
        <Stack spacing={2} alignItems="center" sx={{ py: { xs: 2, sm: 3 } }}>
          <Alert severity="error" variant="outlined" sx={{ width: "100%" }}>
            Failed to load user data. Please try again.
          </Alert>
          <Stack
            direction={isMobile ? "column" : "row"}
            spacing={2}
            width={isMobile ? "100%" : "auto"}
          >
            <Button
              variant="contained"
              onClick={handleRetry}
              startIcon={<span>🔄</span>}
              fullWidth={isMobile}
            >
              Retry
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate("/user/1")}
              fullWidth={isMobile}
            >
              Back to User List
            </Button>
          </Stack>
        </Stack>
      </Paper>
    );
  }

  const user = data?.users.find((u: IUser) => u.id === Number(id));

  if (!user) {
    return (
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, sm: 3 },
          maxWidth: 600,
          mx: { xs: 2, sm: "auto" },
          mt: { xs: 2, sm: 3 },
        }}
      >
        <Stack spacing={2} alignItems="center" sx={{ py: { xs: 2, sm: 3 } }}>
          <Alert severity="warning" variant="outlined">
            User not found
          </Alert>
          <Button variant="contained" onClick={() => navigate("/user/1")}>
            Back to User List
          </Button>
        </Stack>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: 2, sm: 3 },
        maxWidth: 600,
        mx: { xs: 2, sm: "auto" },
        mt: { xs: 2, sm: 3 },
      }}
    >
      <Stack spacing={isMobile ? 2 : 3}>
        <Typography
          variant={isMobile ? "h6" : "h5"}
          fontWeight="bold"
          textAlign="center"
        >
          Edit User Profile
        </Typography>

        <Box textAlign="center">
          <Avatar
            src={user.avatar}
            alt={user.first_name}
            sx={{
              width: isMobile ? 60 : 80,
              height: isMobile ? 60 : 80,
              mx: "auto",
              mb: isMobile ? 1 : 2,
            }}
          />
        </Box>

        {formError && (
          <Alert severity="error" onClose={() => setFormError(null)}>
            {formError}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Stack spacing={isMobile ? 2 : 3}>
            <TextField
              fullWidth
              label="First Name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
              size={isMobile ? "small" : "medium"}
            />
            <TextField
              fullWidth
              label="Last Name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
              size={isMobile ? "small" : "medium"}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              required
              size={isMobile ? "small" : "medium"}
            />
            <Stack
              direction={isMobile ? "column-reverse" : "row"}
              spacing={2}
              justifyContent={isMobile ? "stretch" : "end"}
              sx={{ mt: isMobile ? 1 : 0 }}
            >
              <Button
                variant="outlined"
                onClick={handleCancel}
                fullWidth={isMobile}
                size={isMobile ? "small" : "medium"}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isUpdating}
                fullWidth={isMobile}
                size={isMobile ? "small" : "medium"}
              >
                {isUpdating ? (
                  <CircularProgress size={isMobile ? 20 : 24} />
                ) : (
                  "Save Changes"
                )}
              </Button>
            </Stack>
          </Stack>
        </form>
      </Stack>
    </Paper>
  );
};

export default EditUser;
