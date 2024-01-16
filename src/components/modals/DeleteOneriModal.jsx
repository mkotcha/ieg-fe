import axios from "axios";
import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { hideDeleteOneriModalAction } from "../../redux/actions";

const DeleteOneriModal = () => {
    const dispatch = useDispatch();
    const showDeleteOneriModal = useSelector(state => state.modal.showDeleteOneriModal);
    const token = useSelector(state => state.auth.token);
    const id = useSelector(state => state.modal.deleteOneriId);
    const handleDelete = async () => {
        const url = `${import.meta.env.VITE_REACT_APP_API_URL}/oneri/` + id;
        const response = await axios.delete(url, {
            headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response);
        dispatch(hideDeleteOneriModalAction());
    };

    return (
        <>
            <Modal show={showDeleteOneriModal} onHide={() => dispatch(hideDeleteOneriModalAction())}>
                <Modal.Header closeButton>
                    <Modal.Title>Elimina oneri</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>Sei sicuro di voler eliminare gli oneri?</p>
                    <p>L&apos; operazione è irreversibile!</p>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => dispatch(hideDeleteOneriModalAction())}>
                        Annulla
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Elimina
                    </Button>
                </Modal.Footer>
            </Modal>
        </>


    )


}

export default DeleteOneriModal;