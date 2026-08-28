import { useNavigate } from "react-router-dom";
import BusinessForm from "../components/BusinessForm";

function ListYourBusiness() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold text-white">List Your Business</h1>
      <p className="mt-1 text-sm text-slate-300">
        Submit your facility for review. Once approved by an admin, it will
        appear publicly on CoastSafe.
      </p>
      <div className="mt-6">
        <BusinessForm onCreated={() => navigate("/my-listings")} />
      </div>
    </div>
  );
}

export default ListYourBusiness;
