
import { 
  FaBirthdayCake, FaGlassCheers, FaHeart, FaUsers,
  FaChurch, FaPrayingHands, FaMosque, FaCross,
  FaSchool, 
  FaRegQuestionCircle
} from "react-icons/fa";
import { TbSchool } from "react-icons/tb";
export interface EventType {
  name: string;
  icon: React.ElementType;
  path?: string;
  
}
// 🎉 Social Events

export const SocialEvents: EventType[] = [
  { name: "Birthday", icon: FaBirthdayCake, path: "/create-event/social/birthday" },
  { name: "Wedding", icon: FaHeart, path: "/create-event/social/wedding" },
  { name: "Party", icon: FaGlassCheers, path: "/create-event/social/party" },
  { name: "Reunion", icon: FaUsers, path: "/create-event/social/reunion" },
  { name: "School Anniversary", icon: FaSchool, path: "/create-event/school/anniversary" },
];

// ⛪ Religious Events
export const ReligiousEvents: EventType[] = [
  { name: "Church Service", icon: FaChurch, path: "/create-event/religious/church-service" },
  { name: "Prayer Meeting", icon: FaPrayingHands, path: "/create-event/religious/prayer" },
  { name: "Mosque Gathering", icon: FaMosque, path: "/create-event/religious/mosque" },
  { name: "Christian Conference", icon: FaCross, path: "/create-event/religious/conference" },
  
];

// 🏫 School Events
export const SchoolEvents: EventType[] = [
  {name:"School event", icon:TbSchool  },
  { name: "Other", icon:FaRegQuestionCircle , path:"/create-event/social/reunion"},
  
];