import StaffFirstImage from "@/assets/images/staff-1.png";
import StaffSecondImage from "@/assets/images/staff-2.png";
import StaffThirdImage from "@/assets/images/staff-3.png";

// Mock API call for team members
const members =  [
    { 
      id: 1, 
      name: "Stephen King", 
      image: StaffFirstImage,
      color: "text-orange-500"
    },
    { 
      id: 2, 
      name: "Nina Davidson", 
      image: StaffSecondImage,
      color: "text-green-500"
    },
    { 
      id: 3, 
      name: "Lydia Harrison", 
      image: StaffThirdImage,
      color: "text-blue-500"
    }
  ]

const TeamMembers = () => {

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="text-primary text-xs uppercase font-semibold mb-2">Nhân viên cửa hàng</div>
          <h2 className="text-3xl font-bold mb-2">
            Gặp gỡ các thành viên nhóm được chứng nhận<br />
            & chuyên gia
          </h2>
        </div>
        
       
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {members.map(member => (
              <div key={member.id} className="flex flex-col items-center">
                <div className={`rounded-full p-2 mb-4`}>
                  <div className="overflow-hidden rounded-full">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <div className={`${member.color} mt-2 font-semibold`}>Nhân viên</div>
              </div>
            ))}
          </div>
       
      </div>
    </section>
  );
};

export default TeamMembers;