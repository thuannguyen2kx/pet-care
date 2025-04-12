import AppointmentList from "@/features/appointment/components/appointment-list";

const AppointmentListPage: React.FC = () => {
  return (
    <>
      <div className="container mx-auto py-6">
        <AppointmentList />
      </div>
    </>
  );
};

export default AppointmentListPage;