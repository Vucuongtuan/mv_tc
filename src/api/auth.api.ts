export const Login = async (email: string, password: string) => {
  const res = await fetch(`https://be-tc-phim.onrender.com/auth/sign-in`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });
  const data = await res.json();
  return data;
};
export const LoginFacebook = async (email: string, name: string) => {
  const res = await fetch(`https://be-tc-phim.onrender.com/auth/facebook`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: email, name: name }),
  });
  const data = await res.json();
  return data;
};
export const AddMovieToList = async (
  email: string,
  movie: {
    name: string;
    slug: string;
    tap: string;
    thumb_url: string;
    poster_url: string;
  }
) => {
  const data = {
    email: email,
    movie,
  };
  const res = await fetch(`https://be-tc-phim.onrender.com/list/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return await res.json();
};
export const sendOtp = async (email: string) => {
  const res = await fetch(`https://be-tc-phim.onrender.com/auth/send-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: email }),
  });
  const data = await res.json();
  return data;
};
export const getListMovie = async (email: string) => {
  const res = await fetch(`http://localhost:4000/list`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: email }),
  });
  const data = await res.json();
  return data;
};
export const getUserByEmail = async (email: string) => {
  const res = await fetch(`https://be-tc-phim.onrender.com/auth/email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(email),
  });
  const data = await res.json();
  return data;
};
export const createAccount = async (data: any) => {
  const dataResult = {
    email: data.email,
    name: data.name,
    password: data.password,
    otp: data.otp,
  };
  const res = await fetch(`https://be-tc-phim.onrender.com/auth/sign-up`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dataResult),
  });
  const dataa = await res.json();
  return dataa;
};
