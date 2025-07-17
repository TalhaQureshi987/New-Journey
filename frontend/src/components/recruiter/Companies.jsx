import useGetAllCompanies from "@/hooks/useGetAllCompanies";
import CompaniesTable from "./CompaniesTable";

const Companies = () => {
  useGetAllCompanies();

  return (
    <div>
      <CompaniesTable />
    </div>
  );
};

export default Companies;
