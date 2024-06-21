import Modal from "react-bootstrap/Modal";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

interface IUser {
  id: number;
  email: string;
  name: string;
}

const UserEditModal = (props: any) => {
  const { isOpenUpdateModal, setIsOpenUpdateModal, dataUser } = props;
  const [id, setId] = useState();
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const queryClient = useQueryClient();

  useEffect(() => {
    if (dataUser?.id) {
      setId(dataUser?.id);
      setEmail(dataUser?.email);
      setName(dataUser?.name);
    }
  }, [dataUser]);

  // API Update User
  const mutation = useMutation({
    mutationFn: async (payload: IUser) => {
      // Call API
      const res = await fetch(`http://localhost:8000/users/${payload.id}`, {
        method: "PUT",
        body: JSON.stringify({
          email: payload.email,
          name: payload.name,
        }),
        headers: { "Content-Type": " application/json" },
      });
      return res.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchUsers"] });
      toast.success("User Updated!");
      setIsOpenUpdateModal(false);
    },
  });

  // handleSubmit
  const handleSubmit = () => {
    if (!email) {
      alert("email empty");
      return;
    }
    if (!name) {
      alert("name empty");
      return;
    }

    // Call API & Update User
    if (email && name && id) {
      mutation.mutate({ email, name, id });
    }
  };

  return (
    <>
      <Modal
        show={isOpenUpdateModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        backdrop={false}
        onHide={() => setIsOpenUpdateModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Update A User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FloatingLabel label="Email" className="mb-3">
            <Form.Control value={email} onChange={(e) => setEmail(e.target.value)} type="text" />
          </FloatingLabel>
          <FloatingLabel label="Name">
            <Form.Control value={name} onChange={(e) => setName(e.target.value)} type="text" />
          </FloatingLabel>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="warning" onClick={() => setIsOpenUpdateModal(false)} className="mr-2">
            Cancel
          </Button>

          {mutation.isPending ? (
            <Button variant="primary" disabled>
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
              <span style={{ marginLeft: "4px" }}>Updating</span>
            </Button>
          ) : (
            <Button onClick={() => handleSubmit()}>Confirm</Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UserEditModal;
