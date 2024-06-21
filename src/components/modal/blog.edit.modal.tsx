import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Spinner } from "react-bootstrap";

interface IBlogs {
  id: number;
  title: string;
  content: string;
  author: string;
}

const BlogEditModal = (props: any) => {
  const { isOpenUpdateModal, setIsOpenUpdateModal, dataBlog } = props;
  const [id, setId] = useState();

  const [title, setTitle] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const queryClient = useQueryClient();

  useEffect(() => {
    if (dataBlog?.id) {
      setId(dataBlog?.id);
      setTitle(dataBlog?.title);
      setAuthor(dataBlog?.author);
      setContent(dataBlog?.content);
    }
  }, [dataBlog]);

  const mutation = useMutation({
    mutationFn: async (payload: IBlogs) => {
      const res = await fetch(`http://localhost:8000/blogs/${payload?.id}`, {
        method: "PUT",
        body: JSON.stringify({
          title: payload?.title,
          content: payload?.content,
          author: payload?.author,
        }),
        headers: { "Content-Type": " application/json" },
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchAllBlogPosts"] });
      setIsOpenUpdateModal(false);
      toast.success("User Updated!");
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

    // Call API
    if (title && author && content && id) {
      mutation.mutate({ title, author, content, id });
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
          <Modal.Title>Update A Blog</Modal.Title>
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

export default BlogEditModal;
