import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

interface IUserDelete {
  id: number;
}

const UserDeleteModal = (props: any) => {
  const { dataUser, isOpenDeleteModal, setIsOpenDeleteModal } = props;
  const queryClient = useQueryClient();

  //Define API Delete User
  const mutation = useMutation({
    mutationFn: async (payload: IUserDelete) => {
      const res = await fetch(`http://localhost:8000/users/${payload?.id}`, {
        method: "DELETE",
        headers: { "Content-Type": " application/json" },
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchUsers"] });
      toast.success("User Deleted!");
      setIsOpenDeleteModal(false);
    },
  });

  const handleSubmit = () => {
    // Call API Delete User
    if (dataUser.id) {
      mutation.mutate({ id: dataUser?.id });
    }
  };

  return (
    <Modal
      show={isOpenDeleteModal}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      backdrop={false}
      onHide={() => setIsOpenDeleteModal(false)}
    >
      <Modal.Header closeButton>
        <Modal.Title>Delete A User</Modal.Title>
      </Modal.Header>
      <Modal.Body>Delete the user: {dataUser?.email ?? ""}</Modal.Body>
      <Modal.Footer>
        <Button variant="warning" onClick={() => setIsOpenDeleteModal(false)} className="mr-2">
          Cancel
        </Button>

        {mutation.isPending ? (
          <Button variant="primary" disabled>
            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
            <span style={{ marginLeft: "4px" }}>Deleting</span>
          </Button>
        ) : (
          <Button onClick={() => handleSubmit()}>Confirm</Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default UserDeleteModal;
