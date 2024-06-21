import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { calculatePagesCount } from "../helper";

function Header() {
  const [mode, setMode] = useState("light");
  const [count, setCount] = useState<number>(0);
  console.log("🚀CHECK  count =", count);

  useEffect(() => {
    const body = document.querySelector("body");
    if (body) body.setAttribute("data-bs-theme", mode);
  }, [mode]);

  // fetchUsers
  const {
    isPending,
    error,
    data: users,
  } = useQuery({
    queryKey: ["fetchUsers", 1],
    queryFn: () =>
      fetch(`http://localhost:8000/users?_page=${1}&_limit=${2}`).then((res) => {
        const total_items = +(res.headers.get("X-Total-Count") ?? 0);
        setCount(calculatePagesCount(2, total_items));
        return res.json();
      }),
    placeholderData: keepPreviousData,
  });

  if (isPending) return "Loading...";
  if (error) return "An error has occurred: " + error.message;

  return (
    <Navbar className="bg-body-tertiary" data-bs-theme={mode}>
      <Container>
        <Navbar.Brand href="#home">React Query {count}</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Form.Check
            defaultChecked={mode === "light" ? false : true}
            onChange={(e) => {
              setMode(e.target.checked === true ? "dark" : "light");
            }}
            type="switch"
            id="custom-switch"
            label={mode === "light" ? <Navbar.Text>Light mode</Navbar.Text> : <Navbar.Text>Dark mode</Navbar.Text>}
          />
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
