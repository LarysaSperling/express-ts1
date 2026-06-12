import express, { Request, Response } from "express";
import {
  User,
  CreateUserDto,
  UpdateUserDto,
  PartialUpdateUserDto,
  ChangeEmailDto,
  RegisterDto,
  LoginDto,
  ApiResponse,
} from "./types/user.types";

const app = express();
app.use(express.json());

const users: User[] = [
  { id: 1, name: "Alice", email: "alice@gd.com", password: "123456" },
  { id: 2, name: "Dima", email: "dima@gd.com", password: "123456" },
];

const isValidEmail = (email: string): boolean => {
  return email.includes("@") && email.includes(".");
};

const generateToken = (userId: number): string => {
  return `token-${userId}-${Date.now()}`;
};

// GET /api/users
app.get(
  "/api/users",
  (
    req: Request<{}, ApiResponse<User[]>, {}, {}>,
    res: Response<ApiResponse<User[]>>
  ) => {
    res.json({
      success: true,
      data: users,
    });
  }
);

// POST /api/users
app.post(
  "/api/users",
  (
    req: Request<{}, ApiResponse<User>, CreateUserDto>,
    res: Response<ApiResponse<User>>
  ) => {
    const { name, email } = req.body;

    if (!name || !email) {
      res.status(400).json({
        success: false,
        error: "Name and email are required",
      });
      return;
    }

    if (!isValidEmail(email)) {
      res.status(400).json({
        success: false,
        error: "Invalid email",
      });
      return;
    }

    if (users.some((user) => user.email === email)) {
      res.status(400).json({
        success: false,
        error: "Email already exists",
      });
      return;
    }

    const newUser: User = {
      id: users.length + 1,
      name,
      email,
      password: "123456",
    };

    users.push(newUser);

    res.status(201).json({
      success: true,
      data: newUser,
      message: "User created successfully",
    });
  }
);

// PUT /api/users/:id
app.put(
  "/api/users/:id",
  (
    req: Request<{ id: string }, ApiResponse<User>, UpdateUserDto>,
    res: Response<ApiResponse<User>>
  ) => {
    const id = Number(req.params.id);
    const { name, email } = req.body;

    const user = users.find((user) => user.id === id);

    if (!user) {
      res.status(404).json({
        success: false,
        error: "User not found",
      });
      return;
    }

    if (!name || !email) {
      res.status(400).json({
        success: false,
        error: "Name and email are required",
      });
      return;
    }

    if (!isValidEmail(email)) {
      res.status(400).json({
        success: false,
        error: "Invalid email",
      });
      return;
    }

    const emailExists = users.some(
      (user) => user.email === email && user.id !== id
    );

    if (emailExists) {
      res.status(400).json({
        success: false,
        error: "Email already exists",
      });
      return;
    }

    user.name = name;
    user.email = email;

    res.json({
      success: true,
      data: user,
      message: "User updated successfully",
    });
  }
);

// PATCH /api/users/:id
app.patch(
  "/api/users/:id",
  (
    req: Request<{ id: string }, ApiResponse<User>, PartialUpdateUserDto>,
    res: Response<ApiResponse<User>>
  ) => {
    const id = Number(req.params.id);
    const { name, email } = req.body;

    const user = users.find((user) => user.id === id);
    
if (!user) {
  res.status(404).json({
    success: false,
    error: "User not found",
  });
  return;
}

if (name === undefined && email === undefined) {
  res.status(400).json({
    success: false,
    error: "At least one field is required",
  });
  return;
}

if (name !== undefined) {
  user.name = name;
}

if (email !== undefined) {
  if (!isValidEmail(email)) {
    res.status(400).json({
      success: false,
      error: "Invalid email",
    });
    return;
  }

      const emailExists = users.some(
        (user) => user.email === email && user.id !== id
      );

      if (emailExists) {
        res.status(400).json({
          success: false,
          error: "Email already exists",
        });
        return;
      }

      user.email = email;
    }

    res.json({
      success: true,
      data: user,
      message: "User partially updated successfully",
    });
  }
);

// DELETE /api/users/:id
app.delete(
  "/api/users/:id",
  (
    req: Request<{ id: string }, ApiResponse<{ deletedId: number }>>,
    res: Response<ApiResponse<{ deletedId: number }>>
  ) => {
    const id = Number(req.params.id);
    const userIndex = users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      res.status(404).json({
        success: false,
        error: "User not found",
      });
      return;
    }

    users.splice(userIndex, 1);

    res.json({
      success: true,
      data: { deletedId: id },
      message: "User deleted successfully",
    });
  }
);

// POST /api/users/:id/change-email
app.post(
  "/api/users/:id/change-email",
  (
    req: Request<{ id: string }, ApiResponse<User>, ChangeEmailDto>,
    res: Response<ApiResponse<User>>
  ) => {
    const id = Number(req.params.id);
    const { newEmail, confirmEmail } = req.body;

    const user = users.find((user) => user.id === id);

    if (!user) {
      res.status(404).json({
        success: false,
        error: "User not found",
      });
      return;
    }

    if (!newEmail || !confirmEmail) {
      res.status(400).json({
        success: false,
        error: "New email and confirm email are required",
      });
      return;
    }

    if (newEmail !== confirmEmail) {
      res.status(400).json({
        success: false,
        error: "Emails do not match",
      });
      return;
    }

    if (!isValidEmail(newEmail)) {
      res.status(400).json({
        success: false,
        error: "Invalid email",
      });
      return;
    }

    const emailExists = users.some((user) => user.email === newEmail);

    if (emailExists) {
      res.status(400).json({
        success: false,
        error: "Email already exists",
      });
      return;
    }

    user.email = newEmail;

    res.json({
      success: true,
      data: user,
      message: "Email changed successfully",
    });
  }
);

// POST /api/auth/register
app.post(
  "/api/auth/register",
  (
    req: Request<
      {},
      ApiResponse<{ user: User; token: string }>,
      RegisterDto
    >,
    res: Response<ApiResponse<{ user: User; token: string }>>
  ) => {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      res.status(400).json({
        success: false,
        error: "All fields are required",
      });
      return;
    }

    if (!isValidEmail(email)) {
      res.status(400).json({
        success: false,
        error: "Invalid email",
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        error: "Password must be at least 6 characters",
      });
      return;
    }

    if (password !== confirmPassword) {
      res.status(400).json({
        success: false,
        error: "Passwords do not match",
      });
      return;
    }

    if (users.some((user) => user.email === email)) {
      res.status(400).json({
        success: false,
        error: "Email already exists",
      });
      return;
    }

    const newUser: User = {
      id: users.length + 1,
      name,
      email,
      password,
    };

    users.push(newUser);

    const token = generateToken(newUser.id);

    res.status(201).json({
      success: true,
      data: {
        user: newUser,
        token,
      },
      message: "User registered successfully",
    });
  }
);

// POST /api/auth/login
app.post(
  "/api/auth/login",
  (
    req: Request<{}, ApiResponse<{ user: User; token: string }>, LoginDto>,
    res: Response<ApiResponse<{ user: User; token: string }>>
  ) => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: "Email and password are required",
      });
      return;
    }

    const user = users.find(
      (user) => user.email === email && user.password === password
    );

    if (!user) {
      res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
      return;
    }

    const token = generateToken(user.id);

    res.json({
      success: true,
      data: {
        user,
        token,
      },
      message: "Login successful",
    });
  }
);

app.listen(3333, () => {
  console.log("TS Server is running at http://127.0.0.1:3333");
});
