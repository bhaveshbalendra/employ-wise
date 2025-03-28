import {
  Alert,
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Container,
  Pagination,
  Paper,
  Skeleton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
} from "../../store/slices/userSlice";
import IUser from "../../types/user";

// Component for skeleton loading states
const UserSkeleton = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Stack spacing={2}>
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <Stack
          key={item}
          direction={isMobile ? "column" : "row"}
          alignItems={isMobile ? "flex-start" : "center"}
          spacing={2}
          sx={{ p: 2, borderRadius: 2, bgcolor: "#f9f9f9" }}
        >
          <Skeleton
            variant="circular"
            width={56}
            height={56}
            sx={isMobile ? { mb: 1 } : {}}
          />
          <Box sx={{ flexGrow: 1, width: isMobile ? "100%" : "auto" }}>
            <Skeleton
              variant="text"
              width={isMobile ? "100%" : "60%"}
              height={32}
            />
            <Skeleton
              variant="text"
              width={isMobile ? "80%" : "40%"}
              height={20}
            />
          </Box>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              mt: isMobile ? 2 : 0,
              width: isMobile ? "100%" : "auto",
              justifyContent: isMobile ? "flex-end" : "flex-start",
            }}
          >
            <Skeleton variant="rectangular" width={60} height={30} />
            <Skeleton variant="rectangular" width={60} height={30} />
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
};

const UserList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const navigate = useNavigate();
  const { page: pageParam } = useParams<{ page: string }>();
  const [page, setPage] = useState(parseInt(pageParam || "1", 10));
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  // Fetch users from API
  const { data, isLoading, isError, refetch } = useGetUsersQuery({ page });

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
    navigate(`/user/${value}`);
  };

  const handleEdit = (userId: number) => {
    navigate(`/edit-user/${userId}`);
  };

  const handleDelete = async (userId: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(userId).unwrap();
        toast.success("User deleted successfully");
      } catch {
        toast.error("Failed to delete user");
      }
    }
  };

  const handleRetry = () => {
    refetch();
    toast.info("Retrying...");
  };

  return (
    <Container maxWidth="md" sx={{ mt: 2, px: { xs: 2, sm: 3 } }}>
      <Paper
        elevation={5}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 3,
          overflowX: "hidden",
        }}
      >
        <Typography
          variant={isMobile ? "h5" : "h4"}
          align="center"
          fontWeight="bold"
          gutterBottom
        >
          User List
        </Typography>

        {/* Loading Skeleton */}
        {isLoading && <UserSkeleton />}

        {/* Error Handling */}
        {isError && (
          <Stack spacing={2} alignItems="center" sx={{ py: 4 }}>
            <Alert
              severity="error"
              variant="outlined"
              sx={{ width: "100%", justifyContent: "center" }}
            >
              Failed to load users. Please try again.
            </Alert>
            <Button
              variant="contained"
              onClick={handleRetry}
              startIcon={<span>🔄</span>}
            >
              Retry
            </Button>
          </Stack>
        )}

        {/* User List */}
        {!isLoading &&
          !isError &&
          data &&
          data.users &&
          data.users.length > 0 && (
            <Stack spacing={2}>
              {data.users.map((user: IUser) => (
                <Stack
                  key={user.id}
                  direction={isMobile ? "column" : "row"}
                  alignItems={isMobile ? "flex-start" : "center"}
                  spacing={isMobile ? 1 : 2}
                  sx={{
                    p: { xs: 1.5, sm: 2 },
                    borderRadius: 2,
                    bgcolor: "#f9f9f9",
                  }}
                >
                  <Avatar
                    src={user.avatar}
                    alt={user.first_name}
                    sx={{
                      width: { xs: 48, sm: 56 },
                      height: { xs: 48, sm: 56 },
                      mb: isMobile ? 1 : 0,
                    }}
                  />
                  <Box
                    sx={{
                      flexGrow: 1,
                      width: isMobile ? "100%" : "auto",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "black",
                      }}
                      variant={isMobile ? "subtitle1" : "h6"}
                    >{`${user.first_name} ${user.last_name}`}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {user.email}
                    </Typography>
                  </Box>
                  <ButtonGroup
                    variant="outlined"
                    size="small"
                    sx={{
                      mt: isMobile ? 1.5 : 0,
                      alignSelf: isMobile ? "flex-end" : "center",
                      flexDirection: isTablet && !isMobile ? "column" : "row",
                      "& .MuiButton-root": {
                        fontSize: { xs: "0.7rem", sm: "0.8rem" },
                      },
                    }}
                  >
                    <Button color="primary" onClick={() => handleEdit(user.id)}>
                      Edit
                    </Button>
                    <Button
                      color="error"
                      onClick={() => handleDelete(user.id)}
                      disabled={isDeleting}
                    >
                      {isDeleting ? "..." : "Delete"}
                    </Button>
                  </ButtonGroup>
                </Stack>
              ))}
            </Stack>
          )}

        {/* Empty State */}
        {!isLoading &&
          !isError &&
          (!data || !data.users || data.users.length === 0) && (
            <Box textAlign="center" py={4}>
              <Typography variant="body1" color="text.secondary">
                No users found
              </Typography>
            </Box>
          )}

        {/* Pagination */}
        {!isLoading &&
          !isError &&
          data &&
          data.totalPages &&
          data.totalPages > 1 && (
            <Stack alignItems="center" sx={{ mt: 3 }}>
              <Pagination
                count={data.totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
                size={isMobile ? "small" : "medium"}
                siblingCount={isMobile ? 0 : 1}
              />
            </Stack>
          )}
      </Paper>
    </Container>
  );
};

export default UserList;
