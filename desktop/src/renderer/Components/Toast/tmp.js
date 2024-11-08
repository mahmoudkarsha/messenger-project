function Index() {
  const [visible, setVisible] = useState(true);
  const [toastElements, setToastElements] = useState([]);

  setTimeout(() => {
    setVisible(false);
  }, 2000);

  return visible ? (
    <ToastContainer>
      <Toast>Hi there</Toast>
    </ToastContainer>
  ) : null;
}

export default Index;

export const ToastContainer = styled.div`
  position: fixed;
  z-index: 1000;
  top: 20px;
  left: 20px;
  animation-name: example;
  animation-duration: 2s;
`;

export const Toast = styled.div`
  height: 70px;
  width: 250px;
  background-color: #fff;
  border: 1px solid #aaa;
  z-index: 1000;
`;
