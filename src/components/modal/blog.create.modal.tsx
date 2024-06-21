import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Spinner } from "react-bootstrap";

interface IBlogs {
  title: string;
  author: string;
  content: string;
}

const BlogCreateModal = (props: any) => {
  const { isOpenCreateModal, setIsOpenCreateModal } = props;
  const [title, setTitle] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: IBlogs) => {
      //   return axios.post("/todos", newTodo);
      const res = await fetch(`http://localhost:8000/blogs/`, {
        method: "POST",
        body: JSON.stringify({
          title: payload.title,
          author: payload.author,
          content: payload.content,
        }),
        headers: { "Content-Type": " application/json" },
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchAllBlogPosts"] });
      setIsOpenCreateModal(false);
      toast.success("User Created!");
      setTitle("");
      setAuthor("");
      setContent("");
    },
  });

  const handleSubmit = () => {
    if (!title) {
      alert("title empty");
      return;
    }
    if (!author) {
      alert("author empty");
      return;
    }
    if (!content) {
      alert("content empty");
      return;
    }
    //Call API
    console.log({ title, author, content }); //payload
    mutation.mutate({ title, author, content });
  };

  return (
    <>
      <Modal
        show={isOpenCreateModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        backdrop={false}
        onHide={() => setIsOpenCreateModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add A New Blog</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FloatingLabel label="Title" className="mb-3">
            <Form.Control value={title} onChange={(e) => setTitle(e.target.value)} type="text" />
          </FloatingLabel>
          <FloatingLabel label="Author" className="mb-3">
            <Form.Control value={author} onChange={(e) => setAuthor(e.target.value)} type="text" />
          </FloatingLabel>
          <FloatingLabel label="Content">
            <Form.Control value={content} onChange={(e) => setContent(e.target.value)} type="text" />
          </FloatingLabel>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="warning" onClick={() => setIsOpenCreateModal(false)} className="mr-2">
            Cancel
          </Button>

          {mutation.isPending ? (
            <Button variant="primary" disabled>
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
              <span style={{ marginLeft: "4px" }}>Creatting</span>
            </Button>
          ) : (
            <Button onClick={() => handleSubmit()}>Save</Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default BlogCreateModal;
