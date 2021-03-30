import { useLocation } from "react-router-dom";

let VerifyExperiencePage = () => {
  let location = useLocation();
  console.log(location.state);
  return null;
}

export default VerifyExperiencePage;