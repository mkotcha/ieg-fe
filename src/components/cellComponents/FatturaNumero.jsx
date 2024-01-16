import axios from "axios";
import { Button } from "react-bootstrap";
import { useSelector } from "react-redux";

const FatturaNumero = params => {
  const token = useSelector(state => state.auth.token);
  const fetchPdf = async () => {
    const url = `${import.meta.env.VITE_REACT_APP_API_URL}/fatture/${params.data.numeroFattura}/pdf`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob",
    });
    if (response.status === 200) {
      const url = window.URL.createObjectURL(response.data);
      window.open(url, "_blank");
      const link = document.createElement("a");
      link.href = url;
      const fileName = response.headers["x-filename"];
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
    }
  };

  const fetchXlsx = async () => {
    const url = `${import.meta.env.VITE_REACT_APP_API_URL}/fatture/${params.data.numeroFattura}/xlsx`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob",
    });
    if (response.status === 200) {
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      const fileName = response.headers["x-filename"];
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
    }
  };

  return (
    <>
      <div className="d-flex">
        <div>{params.data.numeroFattura} </div>
        <Button size="sm" variant="success" onClick={fetchXlsx} className="ms-auto me-1 border border-0">
          <i className="bi bi-table"></i>
        </Button>
        <Button size="sm" variant="danger" onClick={fetchPdf} className="ms-1 border border-0">
          <i className="bi bi-file-pdf-fill"></i>
        </Button>
      </div>
    </>
  );
};

export default FatturaNumero;
